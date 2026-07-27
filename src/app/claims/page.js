import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Suspense } from 'react';
import ClaimsClient from './ClaimsClient';

export default async function ClaimsPage({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (!userData) redirect('/auth/login?error=profile_missing');

  const search = params?.search || '';
  const statusFilter = params?.status || '';

  let query = supabase
    .from('claims')
    .select('*, patients!inner(first_name, last_name), users!claims_submitted_by_fkey(full_name)')
    .order('created_at', { ascending: false });

  if (statusFilter) query = query.eq('status', statusFilter);
  if (search) {
    query = query.or(`claim_number.ilike.%${search}%`);
  }

  // Billing users only see their own claims
  if (userData.role === 'billing') {
    query = query.eq('submitted_by', user.id);
  }

  const { data: claims, error } = await query;

  // Status totals for header cards
  const statusTotals = (claims ?? []).reduce((acc, claim) => {
    if (!acc[claim.status]) acc[claim.status] = { count: 0, total: 0 };
    acc[claim.status].count++;
    acc[claim.status].total += parseFloat(claim.total_charge || 0);
    return acc;
  }, {});

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a202c' }}>Claims Management</h1>
            <p style={{ color: '#718096' }}>Track and manage insurance claims</p>
          </div>
          {['admin', 'billing'].includes(userData.role) && (
            <Link href="/claims/new" style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              ➕ New Claim
            </Link>
          )}
        </div>

        {/* Status Summary Cards */}
        {Object.keys(statusTotals).length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {Object.entries(statusTotals).map(([status, data]) => (
              <div key={status} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: `4px solid ${getStatusColor(status)}` }}>
                <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: '600', marginBottom: '8px' }}>{status}</div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' }}>{data.count}</div>
                <div style={{ fontSize: '13px', color: '#48bb78', fontWeight: '600' }}>${data.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ color: '#f56565', marginBottom: '16px', padding: '12px', background: '#fff5f5', borderRadius: '8px' }}>
            Error loading claims: {error.message}
          </div>
        )}

        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>Loading...</div>}>
          <ClaimsClient claims={claims || []} role={userData.role} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}

function getStatusColor(status) {
  const colors = { draft: '#718096', submitted: '#4299e1', pending: '#ed8936', paid: '#48bb78', denied: '#f56565', appealed: '#9f7aea', void: '#a0aec0' };
  return colors[status] || '#718096';
}
