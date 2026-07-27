import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { notifyClaimDenied } from '@/lib/notify';

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
    const { error, status } = await getAuthedUser(supabase);
    if (error) return NextResponse.json({ error }, { status });

    const { searchParams } = new URL(request.url);
    const isAppealed = searchParams.get('is_appealed');

    let query = supabase
      .from('denials')
      .select(`
        *,
        claims!inner(
          claim_number, total_charge, status,
          patients!inner(first_name, last_name),
          users!claims_submitted_by_fkey(full_name)
        )
      `)
      .order('denial_date', { ascending: false });

    if (isAppealed !== null && isAppealed !== '') {
      query = query.eq('is_appealed', isAppealed === 'true');
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
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { claim_id, denial_reason, denial_date, amount_denied, denial_code } = body;

    if (!claim_id || !denial_reason || !denial_date || !amount_denied) {
      return NextResponse.json({ error: 'claim_id, denial_reason, denial_date, and amount_denied are required' }, { status: 400 });
    }

    // Verify claim exists and update its status
    const { data: claim } = await supabase.from('claims').select('id').eq('id', claim_id).single();
    if (!claim) return NextResponse.json({ error: 'Claim not found' }, { status: 404 });

    const { data, error: insertError } = await supabase
      .from('denials')
      .insert({
        claim_id,
        denial_reason: denial_reason.trim(),
        denial_date,
        amount_denied: parseFloat(amount_denied),
        denial_code: denial_code || null,
        is_appealed: false,
      })
      .select()
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });

    // Update claim status to denied
    await supabase.from('claims').update({ status: 'denied' }).eq('id', claim_id);

    // Fetch claim + patient for notification (non-blocking)
    supabase.from('claims').select('claim_number, patients(first_name, last_name), users!claims_submitted_by_fkey(full_name)').eq('id', claim_id).single()
      .then(({ data: claimData }) => {
        if (claimData) {
          notifyClaimDenied({
            claimNumber: claimData.claim_number,
            patientName: `${claimData.patients?.first_name || ''} ${claimData.patients?.last_name || ''}`.trim(),
            amount: amount_denied,
            reason: denial_reason,
            deniedBy: claimData.users?.full_name || 'Unknown',
          });
        }
      });

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
