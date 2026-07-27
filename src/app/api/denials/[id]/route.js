import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

async function getAuthedUser(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: 'Unauthorized', status: 401 };

  const { data: userData, error: profileError } = await supabase
    .from('users').select('id, role, is_active').eq('id', user.id).single();

  if (profileError || !userData) return { error: 'Profile not found', status: 403 };
  if (!userData.is_active) return { error: 'Account inactive', status: 403 };

  return { user, userData };
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    const { data, error: fetchError } = await supabase
      .from('denials')
      .select('*, claims(claim_number, total_charge, patients(first_name, last_name))')
      .eq('id', id)
      .single();

    if (fetchError || !data) return NextResponse.json({ error: 'Denial not found' }, { status: 404 });

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { userData, error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    if (!['admin', 'billing'].includes(userData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const allowed = ['denial_reason', 'denial_date', 'amount_denied', 'denial_code', 'is_appealed', 'appeal_date', 'appeal_notes'];
    const updates = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data: denial } = await supabase.from('denials').select('claim_id').eq('id', id).single();

    const { data, error: updateError } = await supabase
      .from('denials').update(updates).eq('id', id).select().single();

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

    // If marking as appealed, update claim status
    if (updates.is_appealed === true && denial?.claim_id) {
      await supabase.from('claims').update({ status: 'appealed' }).eq('id', denial.claim_id);
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { userData, error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    if (userData.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can delete denial records' }, { status: 403 });
    }

    const { error: deleteError } = await supabase.from('denials').delete().eq('id', id);
    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
