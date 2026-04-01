import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function ClaimsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch claims with patient info
  const { data: claims, error } = await supabase
    .from('claims')
    .select(`
      *,
      patients!inner(first_name, last_name),
      users!claims_submitted_by_fkey(full_name)
    `)
    .order('created_at', { ascending: false });

  // Calculate totals by status
  const statusTotals = claims?.reduce((acc, claim) => {
    if (!acc[claim.status]) {
      acc[claim.status] = { count: 0, total: 0 };
    }
    acc[claim.status].count++;
    acc[claim.status].total += parseFloat(claim.total_charge);
    return acc;
  }, {});

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a202c' }}>
              Claims Management
            </h1>
            <p style={{ color: '#718096' }}>
              Track and manage insurance claims
            </p>
          </div>
          {(userData.role === 'admin' || userData.role === 'billing') && (
            <Link href="/claims/new" style={{
              padding: '14px 24px',
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
          )}
        </div>

        {/* Status Summary */}
        {statusTotals && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {Object.entries(statusTotals).map(([status, data]) => (
              <div key={status} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderTop: `4px solid ${getStatusColor(status)}`
              }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#718096', 
                  textTransform: 'uppercase', 
                  fontWeight: '600',
                  marginBottom: '8px' 
                }}>
                  {status}
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' }}>
                  {data.count}
                </div>
                <div style={{ fontSize: '14px', color: '#48bb78', fontWeight: '600' }}>
                  ${data.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Claims Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select style={{
              padding: '10px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}>
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="denied">Denied</option>
            </select>
            <input
              type="text"
              placeholder="Search by claim number or patient..."
              style={{
                flex: 1,
                padding: '10px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                minWidth: '300px'
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#f56565', marginBottom: '16px', padding: '12px', background: '#fff5f5', borderRadius: '8px' }}>
              Error loading claims: {error.message}
            </div>
          )}
          
          {claims && claims.length > 0 ? (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Claim #</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Patient</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Service Date</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Amount</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Submitted By</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>
                        {claim.claim_number}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#2d3748' }}>
                        {claim.patients?.first_name} {claim.patients?.last_name}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#718096' }}>
                        {new Date(claim.service_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#2d3748', fontWeight: '600' }}>
                        ${parseFloat(claim.total_charge).toFixed(2)}
                      </td>
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
                      <td style={{ padding: '12px 8px', color: '#718096', fontSize: '13px' }}>
                        {claim.users?.full_name || 'Unknown'}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <Link href={`/claims/${claim.id}`} style={{
                          color: '#667eea',
                          textDecoration: 'none',
                          fontWeight: '600',
                          fontSize: '13px'
                        }}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No claims found</p>
              <p style={{ fontSize: '14px' }}>Create your first claim to get started</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
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
