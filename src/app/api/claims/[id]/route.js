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
    const { user, userData, error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    const { data, error: fetchError } = await supabase
      .from('claims')
      .select(`
        *,
        patients(first_name, last_name, date_of_birth, phone, email),
        users!claims_submitted_by_fkey(full_name),
        claim_line_items(*),
        payments(amount_paid, payment_type, payment_date),
        denials(denial_reason, denial_date, amount_denied, is_appealed)
      `)
      .eq('id', id)
      .single();

    if (fetchError || !data) return NextResponse.json({ error: 'Claim not found' }, { status: 404 });

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

    if (!['admin', 'billing'].includes(userData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Fetch existing claim to validate ownership for billing role
    const { data: existing } = await supabase.from('claims').select('submitted_by, status').eq('id', id).single();
    if (!existing) return NextResponse.json({ error: 'Claim not found' }, { status: 404 });

    if (userData.role === 'billing' && existing.submitted_by !== user.id) {
      return NextResponse.json({ error: 'You can only edit your own claims' }, { status: 403 });
    }

    // Paid/void claims cannot be edited
    if (['paid', 'void'].includes(existing.status) && userData.role !== 'admin') {
      return NextResponse.json({ error: 'Cannot edit a paid or voided claim' }, { status: 409 });
    }

    const body = await request.json();
    const allowed = ['status', 'service_date', 'total_charge', 'diagnosis_codes', 'procedure_codes', 'notes'];
    const updates = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Validate status transitions
    const validStatuses = ['draft', 'submitted', 'pending', 'paid', 'denied', 'appealed', 'void'];
    if (updates.status && !validStatuses.includes(updates.status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const { data, error: updateError } = await supabase
      .from('claims').update(updates).eq('id', id).select().single();

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
    const { user, userData, error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    if (userData.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can delete claims' }, { status: 403 });
    }

    const { data: existing } = await supabase.from('claims').select('status').eq('id', id).single();
    if (!existing) return NextResponse.json({ error: 'Claim not found' }, { status: 404 });

    if (existing.status === 'paid') {
      return NextResponse.json({ error: 'Cannot delete a paid claim. Void it instead.' }, { status: 409 });
    }

    const { error: deleteError } = await supabase.from('claims').delete().eq('id', id);
    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
