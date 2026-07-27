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
      .from('payments')
      .select('*, claims(claim_number, patients(first_name, last_name)), users!payments_posted_by_fkey(full_name)')
      .eq('id', id)
      .single();

    if (fetchError || !data) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { user, userData, error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    if (!['admin', 'billing', 'finance'].includes(userData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const allowed = ['payment_type', 'amount_paid', 'payment_date', 'check_number', 'payer_name', 'notes'];
    const updates = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error: updateError } = await supabase
      .from('payments').update(updates).eq('id', id).select().single();

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

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
      return NextResponse.json({ error: 'Only admins can delete payments' }, { status: 403 });
    }

    const { error: deleteError } = await supabase.from('payments').delete().eq('id', id);
    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
