import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

async function getAuthedUser(supabase) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { error: 'Unauthorized', status: 401 };

  const { data: userData, error: profileError } = await supabase
    .from('users')
    .select('id, role, is_active')
    .eq('id', user.id)
    .single();

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
      .from('patients')
      .select('*, users!patients_created_by_fkey(full_name), patient_insurance(*, insurance_companies(company_name, phone))')
      .eq('id', id)
      .single();

    if (fetchError || !data) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

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

    if (!['admin', 'billing', 'support'].includes(userData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();

    // Whitelist updatable fields — never allow id, created_by, created_at to be changed
    const allowed = [
      'first_name', 'last_name', 'date_of_birth', 'gender', 'ssn_last_4',
      'phone', 'email', 'address', 'city', 'state', 'zip_code',
      'emergency_contact_name', 'emergency_contact_phone', 'is_active',
    ];
    const updates = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error: updateError } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

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

    // Only admin can hard-delete; billing/support can only deactivate
    if (userData.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can delete patients' }, { status: 403 });
    }

    // Check for active claims before deleting
    const { data: activeClaims } = await supabase
      .from('claims')
      .select('id')
      .eq('patient_id', id)
      .not('status', 'in', '("void","paid")')
      .limit(1);

    if (activeClaims && activeClaims.length > 0) {
      return NextResponse.json({
        error: 'Cannot delete patient with active claims. Deactivate the patient instead.',
      }, { status: 409 });
    }

    const { error: deleteError } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);

    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
