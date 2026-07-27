import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { notifyPaymentPosted } from '@/lib/notify';

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
    const paymentType = searchParams.get('payment_type');
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const claimId = searchParams.get('claim_id');

    let query = supabase
      .from('payments')
      .select('*, claims!inner(claim_number, total_charge, patients!inner(first_name, last_name)), users!payments_posted_by_fkey(full_name)')
      .order('payment_date', { ascending: false });

    if (paymentType) query = query.eq('payment_type', paymentType);
    if (fromDate) query = query.gte('payment_date', fromDate);
    if (toDate) query = query.lte('payment_date', toDate);
    if (claimId) query = query.eq('claim_id', claimId);

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

    if (!['admin', 'billing', 'finance'].includes(userData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions to post payments' }, { status: 403 });
    }

    const body = await request.json();
    const { claim_id, payment_type, amount_paid, payment_date, check_number, payer_name, notes } = body;

    if (!claim_id || !payment_type || !amount_paid || !payment_date) {
      return NextResponse.json({ error: 'claim_id, payment_type, amount_paid, and payment_date are required' }, { status: 400 });
    }

    const validTypes = ['insurance', 'patient', 'adjustment', 'refund'];
    if (!validTypes.includes(payment_type)) {
      return NextResponse.json({ error: `payment_type must be one of: ${validTypes.join(', ')}` }, { status: 400 });
    }

    if (isNaN(parseFloat(amount_paid)) || parseFloat(amount_paid) === 0) {
      return NextResponse.json({ error: 'amount_paid must be a non-zero number' }, { status: 400 });
    }

    // Verify claim exists
    const { data: claim } = await supabase.from('claims').select('id, status').eq('id', claim_id).single();
    if (!claim) return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    if (claim.status === 'void') return NextResponse.json({ error: 'Cannot post payment to a voided claim' }, { status: 409 });

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(10000 + Math.random() * 90000);
    const payment_number = `PAY-${today}-${rand}`;

    const { data, error: insertError } = await supabase
      .from('payments')
      .insert({
        payment_number,
        claim_id,
        payment_type,
        amount_paid: parseFloat(amount_paid),
        payment_date,
        check_number: check_number || null,
        payer_name: payer_name || null,
        notes: notes || null,
        posted_by: user.id,
      })
      .select()
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 });

    // Auto-update claim status to paid if payment_type is insurance or patient
    if (['insurance', 'patient'].includes(payment_type)) {
      await supabase.from('claims').update({ status: 'paid' }).eq('id', claim_id);
    }

    // Send notification (non-blocking)
    supabase.from('claims').select('claim_number, patients(first_name, last_name), users!claims_submitted_by_fkey(full_name)').eq('id', claim_id).single()
      .then(({ data: claimData }) => {
        if (claimData) {
          const poster = userData?.full_name || user.email;
          notifyPaymentPosted({
            paymentNumber: data.payment_number,
            claimNumber: claimData.claim_number,
            patientName: `${claimData.patients?.first_name || ''} ${claimData.patients?.last_name || ''}`.trim(),
            amount: amount_paid,
            type: payment_type,
            postedBy: poster,
          });
        }
      });

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
