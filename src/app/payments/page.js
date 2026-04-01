import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function PaymentsPage() {
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

  // Fetch payments with claim info
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      *,
      claims!inner(claim_number, total_charge, patients!inner(first_name, last_name)),
      users!payments_posted_by_fkey(full_name)
    `)
    .order('payment_date', { ascending: false });

  // Calculate totals
  const totalsByType = payments?.reduce((acc, payment) => {
    if (!acc[payment.payment_type]) {
      acc[payment.payment_type] = { count: 0, total: 0 };
    }
    acc[payment.payment_type].count++;
    acc[payment.payment_type].total += parseFloat(payment.amount_paid);
    return acc;
  }, {});

  const grandTotal = payments?.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0) || 0;

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a202c' }}>
              Payment Management
            </h1>
            <p style={{ color: '#718096' }}>
              Post and track payments received
            </p>
          </div>
          {(userData.role === 'admin' || userData.role === 'billing' || userData.role === 'finance') && (
            <Link href="/payments/new" style={{
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>💳</span> Post Payment
            </Link>
          )}
        </div>

        {/* Payment Type Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {totalsByType && Object.entries(totalsByType).map(([type, data]) => (
            <div key={type} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderTop: `4px solid ${getPaymentTypeColor(type)}`
            }}>
              <div style={{ 
                fontSize: '12px', 
                color: '#718096', 
                textTransform: 'uppercase', 
                fontWeight: '600',
                marginBottom: '8px' 
              }}>
                {type}
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' }}>
                {data.count}
              </div>
              <div style={{ fontSize: '14px', color: '#48bb78', fontWeight: '600' }}>
                ${data.total.toFixed(2)}
              </div>
            </div>
          ))}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            color: 'white'
          }}>
            <div style={{ 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              fontWeight: '600',
              marginBottom: '8px',
              opacity: 0.9
            }}>
              Total Received
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700' }}>
              ${grandTotal.toFixed(2)}
            </div>
            <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>
              {payments?.length || 0} payments
            </div>
          </div>
        </div>

        {/* Payments Table */}
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
              <option value="">All Types</option>
              <option value="insurance">Insurance</option>
              <option value="patient">Patient</option>
              <option value="adjustment">Adjustment</option>
              <option value="refund">Refund</option>
            </select>
            <input
              type="date"
              style={{
                padding: '10px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <div style={{ color: '#f56565', marginBottom: '16px', padding: '12px', background: '#fff5f5', borderRadius: '8px' }}>
              Error loading payments: {error.message}
            </div>
          )}
          
          {payments && payments.length > 0 ? (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Payment #</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Claim #</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Patient</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Type</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Amount</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Posted By</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>
                        {payment.payment_number}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#667eea', fontWeight: '600' }}>
                        {payment.claims?.claim_number || 'N/A'}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#2d3748' }}>
                        {payment.claims?.patients?.first_name} {payment.claims?.patients?.last_name}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: getPaymentTypeColor(payment.payment_type),
                          color: 'white'
                        }}>
                          {payment.payment_type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#48bb78', fontWeight: '700', fontSize: '15px' }}>
                        ${parseFloat(payment.amount_paid).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#718096' }}>
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#718096', fontSize: '13px' }}>
                        {payment.users?.full_name || 'Unknown'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: '#718096' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No payments found</p>
              <p style={{ fontSize: '14px' }}>Post your first payment to get started</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function getPaymentTypeColor(type) {
  const colors = {
    insurance: '#4299e1',
    patient: '#48bb78',
    adjustment: '#ed8936',
    refund: '#f56565'
  };
  return colors[type] || '#718096';
}
