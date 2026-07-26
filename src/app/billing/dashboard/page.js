import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function BillingDashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    redirect('/auth/login?error=profile_missing');
  }

  if (userData.role !== 'billing' && userData.role !== 'admin') {
    redirect('/auth/login?error=unauthorized');
  }

  // Fetch claims submitted by this user
  const { data: myClaims } = await supabase
    .from('claims')
    .select('*')
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Get denials that need attention
  const { data: denials } = await supabase
    .from('denials')
    .select('*, claims!inner(claim_number)')
    .eq('is_appealed', false)
    .order('denial_date', { ascending: false })
    .limit(5);

  const claimsByStatus = myClaims?.reduce((acc, claim) => {
    if (!acc[claim.status]) {
      acc[claim.status] = { count: 0, amount: 0 };
    }
    acc[claim.status].count++;
    acc[claim.status].amount += parseFloat(claim.total_charge);
    return acc;
  }, {});

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a202c' }}>
          Billing Dashboard
        </h1>
        <p style={{ color: '#718096', marginBottom: '32px' }}>
          Manage claims, denials, and revenue cycle workflow
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <StatCard
            title="My Claims"
            value={myClaims?.length || 0}
            icon="📄"
            color="#4299e1"
          />
          <StatCard
            title="Pending Review"
            value={claimsByStatus?.pending?.count || 0}
            icon="⏱️"
            color="#ed8936"
          />
          <StatCard
            title="Active Denials"
            value={denials?.length || 0}
            icon="🚫"
            color="#f56565"
          />
          <StatCard
            title="Paid Claims"
            value={claimsByStatus?.paid?.count || 0}
            icon="✅"
            color="#48bb78"
          />
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#2d3748' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/claims/new" style={{
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>➕</span> New Claim
            </Link>
            <Link href="/denials" style={{
              padding: '16px 24px',
              background: '#f56565',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🚫</span> Review Denials
            </Link>
            <Link href="/patients" style={{
              padding: '16px 24px',
              background: '#48bb78',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🏥</span> Patient Lookup
            </Link>
          </div>
        </div>

        {/* Recent Claims */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2d3748' }}>
              My Recent Claims
            </h2>
            <Link href="/claims" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              View All →
            </Link>
          </div>
          {myClaims && myClaims.length > 0 ? (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Claim #</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Service Date</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {myClaims.map((claim) => (
                    <tr key={claim.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>{claim.claim_number}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: getStatusColor(claim.status),
                          color: 'white'
                        }}>
                          {claim.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#718096' }}>
                        {new Date(claim.service_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#2d3748' }}>${parseFloat(claim.total_charge).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#718096', textAlign: 'center', padding: '24px' }}>No claims yet. Create your first claim to get started.</p>
          )}
        </div>

        {/* Active Denials */}
        {denials && denials.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#2d3748' }}>
              Denials Requiring Action
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {denials.map((denial) => (
                <div key={denial.id} style={{
                  padding: '16px',
                  background: '#fff5f5',
                  borderLeft: '4px solid #f56565',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '4px' }}>
                        Claim: {denial.claims?.claim_number}
                      </div>
                      <div style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>
                        {denial.denial_reason}
                      </div>
                      <div style={{ fontSize: '12px', color: '#a0aec0' }}>
                        Denied on: {new Date(denial.denial_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#f56565' }}>
                      ${parseFloat(denial.amount_denied).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderTop: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '8px' }}>{title}</p>
          <p style={{ fontSize: '32px', fontWeight: '700', color: '#2d3748' }}>{value}</p>
        </div>
        <div style={{ fontSize: '40px' }}>{icon}</div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    draft: '#718096',
    submitted: '#4299e1',
    pending: '#ed8936',
    paid: '#48bb78',
    denied: '#f56565',
    appealed: '#9f7aea',
    void: '#a0aec0'
  };
  return colors[status] || '#718096';
}
