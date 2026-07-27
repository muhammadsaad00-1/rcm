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

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { user, userData, error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const patientId = searchParams.get('patient_id');
    const search = searchParams.get('search');

    let query = supabase
      .from('claims')
      .select('*, patients!inner(first_name, last_name), users!claims_submitted_by_fkey(full_name)')
      .order('created_at', { ascending: false });

    if (statusFilter) query = query.eq('status', statusFilter);
    if (patientId) query = query.eq('patient_id', patientId);
    if (search) query = query.ilike('claim_number', `%${search}%`);

    // Billing users only see their own claims
    if (userData.role === 'billing') {
      query = query.eq('submitted_by', user.id);
    }

    const { data, error: fetchError } = await query;
    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { user, userData, error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    if (!['admin', 'billing'].includes(userData.role)) {
      return NextResponse.json({ error: 'Only admin and billing staff can create claims' }, { status: 403 });
    }

    const body = await request.json();
    const { patient_id, service_date, total_charge, diagnosis_codes, procedure_codes, notes } = body;

    if (!patient_id || !service_date || !total_charge) {
      return NextResponse.json({ error: 'patient_id, service_date, and total_charge are required' }, { status: 400 });
    }

    if (isNaN(parseFloat(total_charge)) || parseFloat(total_charge) <= 0) {
      return NextResponse.json({ error: 'total_charge must be a positive number' }, { status: 400 });
    }

    // Generate claim number: RCM-YYYYMMDD-XXXXX
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(10000 + Math.random() * 90000);
    const claim_number = `RCM-${today}-${rand}`;

    const { data, error: insertError } = await supabase
      .from('claims')
      .insert({
        claim_number,
        patient_id,
        service_date,
        total_charge: parseFloat(total_charge),
        diagnosis_codes: diagnosis_codes || null,
        procedure_codes: procedure_codes || null,
        notes: notes || null,
        status: 'draft',
        submitted_by: user.id,
      })
      .select()
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
