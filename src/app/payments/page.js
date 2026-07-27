import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Suspense } from 'react';
import PaymentsClient from './PaymentsClient';

export default async function PaymentsPage({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (!userData) redirect('/auth/login?error=profile_missing');

  const typeFilter = params?.type || '';
  const fromDate = params?.from || '';
  const toDate = params?.to || '';

  let query = supabase
    .from('payments')
    .select('*, claims!inner(claim_number, total_charge, patients!inner(first_name, last_name)), users!payments_posted_by_fkey(full_name)')
    .order('payment_date', { ascending: false });

  if (typeFilter) query = query.eq('payment_type', typeFilter);
  if (fromDate) query = query.gte('payment_date', fromDate);
  if (toDate) query = query.lte('payment_date', toDate);

  const { data: payments, error } = await query;

  const grandTotal = (payments ?? []).reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
  const totalsByType = (payments ?? []).reduce((acc, p) => {
    if (!acc[p.payment_type]) acc[p.payment_type] = { count: 0, total: 0 };
    acc[p.payment_type].count++;
    acc[p.payment_type].total += parseFloat(p.amount_paid || 0);
    return acc;
  }, {});

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a202c' }}>Payment Management</h1>
            <p style={{ color: '#718096' }}>Post and track payments received</p>
          </div>
          {['admin', 'billing', 'finance'].includes(userData.role) && (
            <Link href="/payments/new" style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              💳 Post Payment
            </Link>
          )}
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {Object.entries(totalsByType).map(([type, data]) => (
            <div key={type} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: `4px solid ${getTypeColor(type)}` }}>
              <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: '600', marginBottom: '8px' }}>{type}</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' }}>{data.count}</div>
              <div style={{ fontSize: '14px', color: '#48bb78', fontWeight: '600' }}>${data.total.toFixed(2)}</div>
            </div>
          ))}
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', color: 'white' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>Total Received</div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>${grandTotal.toFixed(2)}</div>
            <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>{payments?.length || 0} payments</div>
          </div>
        </div>

        {error && (
          <div style={{ color: '#f56565', marginBottom: '16px', padding: '12px', background: '#fff5f5', borderRadius: '8px' }}>
            Error loading payments: {error.message}
          </div>
        )}

        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>Loading...</div>}>
          <PaymentsClient payments={payments || []} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

function getTypeColor(type) {
  const colors = { insurance: '#4299e1', patient: '#48bb78', adjustment: '#ed8936', refund: '#f56565' };
  return colors[type] || '#718096';
}
