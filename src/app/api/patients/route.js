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

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { user, userData, error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('is_active');

    let query = supabase
      .from('patients')
      .select('*, users!patients_created_by_fkey(full_name)')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }
    if (isActive !== null && isActive !== '') {
      query = query.eq('is_active', isActive === 'true');
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

    if (!['admin', 'billing', 'support'].includes(userData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { first_name, last_name, date_of_birth, gender, ssn_last_4, phone, email,
      address, city, state, zip_code, emergency_contact_name, emergency_contact_phone } = body;

    if (!first_name || !last_name) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    const { data, error: insertError } = await supabase
      .from('patients')
      .insert({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        date_of_birth,
        gender,
        ssn_last_4,
        phone,
        email: email || null,
        address,
        city,
        state,
        zip_code,
        emergency_contact_name,
        emergency_contact_phone,
        is_active: true,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
