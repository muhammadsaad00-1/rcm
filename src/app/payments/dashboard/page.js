import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function FinanceDashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect('/auth/login');

  const { data: userData, error: userError } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (userError || !userData) redirect('/auth/login?error=profile_missing');

  if (!['admin', 'finance'].includes(userData.role)) {
    redirect('/auth/login?error=unauthorized');
  }

  const [
    { data: allPayments },
    { data: thisMonthPayments },
    { data: allClaims },
    { data: arAging },
    { data: recentPayments },
  ] = await Promise.all([
    supabase.from('payments').select('amount_paid, payment_type, payment_date'),
    supabase.from('payments').select('amount_paid, payment_type')
      .gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)),
    supabase.from('claims').select('status, total_charge'),
    supabase.from('ar_aging').select('*').limit(10),
    supabase.from('payments')
      .select('*, claims(claim_number, patients(first_name, last_name)), users!payments_posted_by_fkey(full_name)')
      .order('payment_date', { ascending: false })
      .limit(10),
  ]);

  const totalCollected = (allPayments ?? []).reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
  const thisMonthTotal = (thisMonthPayments ?? []).reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
  const insuranceTotal = (allPayments ?? []).filter(p => p.payment_type === 'insurance').reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
  const patientTotal = (allPayments ?? []).filter(p => p.payment_type === 'patient').reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);

  const claimsByStatus = (allClaims ?? []).reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + parseFloat(c.total_charge || 0);
    return acc;
  }, {});

  const totalBilled = (allClaims ?? []).reduce((sum, c) => sum + parseFloat(c.total_charge || 0), 0);
  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';

  const paymentsByType = (allPayments ?? []).reduce((acc, p) => {
    if (!acc[p.payment_type]) acc[p.payment_type] = 0;
    acc[p.payment_type] += parseFloat(p.amount_paid || 0);
    return acc;
  }, {});

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="text-navy font-bold" style={{ fontSize: '32px', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Finance Dashboard
            </h1>
            <p className="text-gray text-sm">Revenue analytics, collection metrics, and AR overview</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/payments/new" className="btn-modern btn-modern-primary">
              💳 Post Payment
            </Link>
            <Link href="/payments" className="btn-modern btn-modern-outline" style={{ background: 'var(--white)' }}>
              View All Payments
            </Link>
          </div>
        </div>

        {/* Top KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <KpiCard label="Total Collected" value={`$${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} sub="All time" color="var(--green)" icon="💰" />
          <KpiCard label="This Month" value={`$${thisMonthTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} sub={new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} color="var(--teal)" icon="📅" />
          <KpiCard label="Collection Rate" value={`${collectionRate}%`} sub="Collected vs billed" color="var(--navy)" icon="📊" />
          <KpiCard label="Total Billed" value={`$${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} sub={`${allClaims?.length || 0} claims`} color="var(--gold)" icon="📄" />
        </div>

        {/* Revenue Split + Claims Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Revenue by Source */}
          <div className="card-modern">
            <h2 className="text-navy font-semibold text-lg" style={{ marginBottom: '20px' }}>Revenue by Source</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(paymentsByType).map(([type, amount]) => {
                const pct = totalCollected > 0 ? ((amount / totalCollected) * 100).toFixed(1) : 0;
                return (
                  <div key={type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="font-semibold text-navy" style={{ fontSize: '14px', textTransform: 'capitalize' }}>{type}</span>
                      <span className="font-semibold text-navy" style={{ fontSize: '14px' }}>${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-gray" style={{ fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--gray2)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: getTypeColor(type), borderRadius: '99px', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                );
              })}
              {Object.keys(paymentsByType).length === 0 && (
                <p className="text-gray text-sm" style={{ textAlign: 'center', padding: '24px 0' }}>No payment data yet</p>
              )}
            </div>
          </div>

          {/* Claims by Status (AR Overview) */}
          <div className="card-modern">
            <h2 className="text-navy font-semibold text-lg" style={{ marginBottom: '20px' }}>Claims Value by Status</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(claimsByStatus).map(([status, amount]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--off)', borderRadius: '8px', borderLeft: `3px solid ${getStatusColor(status)}` }}>
                  <span className="font-semibold text-navy" style={{ fontSize: '13px', textTransform: 'capitalize' }}>{status}</span>
                  <span className="font-semibold" style={{ fontSize: '14px', color: getStatusColor(status) }}>
                    ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
              {Object.keys(claimsByStatus).length === 0 && (
                <p className="text-gray text-sm" style={{ textAlign: 'center', padding: '24px 0' }}>No claims data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* AR Aging (if data available) */}
        {arAging && arAging.length > 0 && (
          <div className="card-modern" style={{ marginBottom: '24px' }}>
            <h2 className="text-navy font-semibold text-lg" style={{ marginBottom: '20px' }}>AR Aging Summary</h2>
            <div className="table-modern-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Bucket</th>
                    <th>Claims</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {arAging.map((row, i) => (
                    <tr key={i}>
                      <td className="font-semibold text-navy">{row.aging_bucket || row.bucket || `Row ${i + 1}`}</td>
                      <td className="text-gray">{row.claim_count ?? '—'}</td>
                      <td className="font-semibold" style={{ color: 'var(--navy)' }}>
                        {row.total_amount != null ? `$${parseFloat(row.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Payments */}
        <div className="card-modern">
          <div className="card-header-modern">
            <h2 className="text-navy font-semibold text-lg">Recent Payments</h2>
            <Link href="/payments" className="text-teal font-semibold text-sm" style={{ textDecoration: 'none' }}>View All →</Link>
          </div>
          {recentPayments && recentPayments.length > 0 ? (
            <div className="table-modern-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Claim</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Posted By</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="font-semibold text-navy">{p.payment_number}</td>
                      <td className="text-teal font-semibold">{p.claims?.claim_number || '—'}</td>
                      <td className="text-navy">{p.claims?.patients?.first_name} {p.claims?.patients?.last_name}</td>
                      <td>
                        <span className="badge-modern info" style={{ background: getTypeColor(p.payment_type), color: 'white', padding: '3px 10px', fontSize: '11px' }}>
                          {p.payment_type}
                        </span>
                      </td>
                      <td className="font-semibold" style={{ color: 'var(--green)' }}>
                        ${parseFloat(p.amount_paid).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-gray">{new Date(p.payment_date).toLocaleDateString()}</td>
                      <td className="text-gray">{p.users?.full_name || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--gray4)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💳</div>
              <p className="font-semibold" style={{ fontSize: '16px' }}>No payments posted yet</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function KpiCard({ label, value, sub, color, icon }) {
  return (
    <div className="card-modern card-modern-hover" style={{ borderTop: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <p className="text-gray font-semibold" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{label}</p>
          <p className="text-navy font-bold" style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
        </div>
        <div style={{ fontSize: '28px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--off)', borderRadius: '12px' }}>
          {icon}
        </div>
      </div>
      <p className="text-gray" style={{ fontSize: '13px', borderTop: '1px solid var(--gray1)', paddingTop: '10px' }}>{sub}</p>
    </div>
  );
}

function getTypeColor(type) {
  const colors = { insurance: '#4299e1', patient: '#48bb78', adjustment: '#ed8936', refund: '#f56565' };
  return colors[type] || '#718096';
}

function getStatusColor(status) {
  const colors = { draft: '#718096', submitted: '#4299e1', pending: '#ed8936', paid: '#48bb78', denied: '#f56565', appealed: '#9f7aea', void: '#a0aec0' };
  return colors[status] || '#718096';
}
