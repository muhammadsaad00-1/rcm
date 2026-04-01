import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userData?.role !== 'admin') redirect('/dashboard');

  // --- Data fetching ---
  const [
    { data: allClaims },
    { data: allPayments },
    { data: allPatients },
    { data: allUsers },
  ] = await Promise.all([
    supabase.from('claims').select('id, status, total_charge, service_date, created_at'),
    supabase.from('payments').select('amount_paid, payment_type, payment_date, created_at'),
    supabase.from('patients').select('id, created_at, is_active'),
    supabase.from('users').select('id, role, created_at, is_active'),
  ]);

  // --- Claims summary ---
  const claimsStatusMap = (allClaims || []).reduce((acc, c) => {
    acc[c.status] = acc[c.status] || { count: 0, total: 0 };
    acc[c.status].count++;
    acc[c.status].total += parseFloat(c.total_charge || 0);
    return acc;
  }, {});

  const totalBilled = (allClaims || []).reduce((s, c) => s + parseFloat(c.total_charge || 0), 0);

  // --- Payments summary ---
  const totalCollected = (allPayments || []).reduce((s, p) => s + parseFloat(p.amount_paid || 0), 0);
  const insuranceCollected = (allPayments || [])
    .filter(p => p.payment_type === 'insurance')
    .reduce((s, p) => s + parseFloat(p.amount_paid || 0), 0);
  const patientCollected = (allPayments || [])
    .filter(p => p.payment_type === 'patient')
    .reduce((s, p) => s + parseFloat(p.amount_paid || 0), 0);

  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';

  // --- Monthly revenue (last 6 months) ---
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const monthPayments = (allPayments || []).filter(p => {
      const pd = new Date(p.payment_date || p.created_at);
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
    });
    const amount = monthPayments.reduce((s, p) => s + parseFloat(p.amount_paid || 0), 0);
    const claims = (allClaims || []).filter(c => {
      const cd = new Date(c.service_date || c.created_at);
      return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
    }).length;
    return { label, amount, claims };
  });

  const maxMonthlyAmount = Math.max(...monthlyData.map(m => m.amount), 1);

  // --- Users by role ---
  const roleMap = (allUsers || []).reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  // --- Claims this month vs last month ---
  const thisMonth = (allClaims || []).filter(c => {
    const d = new Date(c.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonth = (allClaims || []).filter(c => {
    const d = new Date(c.created_at);
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear();
  }).length;
  const claimsTrend = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(0) : null;

  return (
    <DashboardLayout user={userData} role="admin">
      <div>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c', marginBottom: '8px' }}>
            Reports & Analytics
          </h1>
          <p style={{ color: '#718096' }}>
            Financial performance, claim trends, and operational metrics
          </p>
        </div>

        {/* KPI Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <KPICard label="Total Billed" value={`$${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="#667eea" icon="📋" sub={`${allClaims?.length || 0} claims`} />
          <KPICard label="Total Collected" value={`$${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="#48bb78" icon="💰" sub={`Balance: $${(totalBilled - totalCollected).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          <KPICard label="Collection Rate" value={`${collectionRate}%`} color={parseFloat(collectionRate) >= 80 ? '#48bb78' : parseFloat(collectionRate) >= 60 ? '#ed8936' : '#f56565'} icon="📈" sub="Collected / Billed" />
          <KPICard label="Active Patients" value={allPatients?.filter(p => p.is_active).length || 0} color="#4299e1" icon="🏥" sub={`${allPatients?.length || 0} total`} />
        </div>

        {/* Revenue Bar Chart */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '24px' }}>
            Monthly Revenue — Last 6 Months
          </h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '180px' }}>
            {monthlyData.map((m, i) => {
              const barHeight = maxMonthlyAmount > 0 ? Math.max((m.amount / maxMonthlyAmount) * 140, 4) : 4;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#667eea', fontWeight: '600' }}>
                    {m.amount > 0 ? `$${(m.amount / 1000).toFixed(1)}k` : '—'}
                  </div>
                  <div style={{
                    width: '100%',
                    height: `${barHeight}px`,
                    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '6px 6px 0 0',
                    minHeight: '4px'
                  }} />
                  <div style={{ fontSize: '11px', color: '#a0aec0', textAlign: 'center' }}>{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Claims by Status */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
              Claims by Status
            </h2>
            {Object.keys(claimsStatusMap).length === 0 ? (
              <p style={{ color: '#a0aec0', fontSize: '14px' }}>No claims data yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {Object.entries(claimsStatusMap)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([status, data]) => {
                    const pct = allClaims?.length > 0 ? ((data.count / allClaims.length) * 100).toFixed(0) : 0;
                    return (
                      <div key={status}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              width: '10px', height: '10px', borderRadius: '50%',
                              background: getStatusColor(status), display: 'inline-block'
                            }} />
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748', textTransform: 'capitalize' }}>{status}</span>
                          </div>
                          <span style={{ fontSize: '13px', color: '#718096' }}>{data.count} &nbsp;·&nbsp; ${data.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ height: '6px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: getStatusColor(status), borderRadius: '4px' }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Payment Breakdown */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
              Payment Breakdown
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <PaymentBreakdownRow
                label="Insurance Payments"
                amount={insuranceCollected}
                total={totalCollected}
                color="#4299e1"
              />
              <PaymentBreakdownRow
                label="Patient Payments"
                amount={patientCollected}
                total={totalCollected}
                color="#48bb78"
              />
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748' }}>Total Collected</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748' }}>
                  ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* User Roles */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
              Staff by Role
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { role: 'admin', color: '#667eea', label: 'Admin' },
                { role: 'billing', color: '#4299e1', label: 'Billing' },
                { role: 'support', color: '#48bb78', label: 'Support' },
                { role: 'finance', color: '#ed8936', label: 'Finance' },
              ].map(({ role, color, label }) => (
                <div key={role} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                    <span style={{ fontSize: '14px', color: '#4a5568' }}>{label}</span>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '12px', fontSize: '13px',
                    fontWeight: '700', background: color, color: 'white'
                  }}>
                    {roleMap[role] || 0}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#718096' }}>Total Staff</span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#2d3748' }}>{allUsers?.length || 0}</span>
            </div>
          </div>

          {/* Claim Volume Summary */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
              Claim Volume Summary
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <SummaryRow label="This Month" value={thisMonth} extra={claimsTrend !== null ? `${claimsTrend > 0 ? '▲' : '▼'} ${Math.abs(claimsTrend)}% vs last month` : null} trendUp={claimsTrend > 0} />
              <SummaryRow label="Last Month" value={lastMonth} />
              <SummaryRow label="Total Claims" value={allClaims?.length || 0} />
              <SummaryRow label="Avg Charge / Claim" value={allClaims?.length > 0 ? `$${(totalBilled / allClaims.length).toFixed(2)}` : '$0.00'} />
              <SummaryRow label="Open (Draft + Submitted)" value={(claimsStatusMap?.draft?.count || 0) + (claimsStatusMap?.submitted?.count || 0)} />
              <SummaryRow label="Denied Claims" value={claimsStatusMap?.denied?.count || 0} highlight={claimsStatusMap?.denied?.count > 0} />
            </div>
          </div>
        </div>

        {/* Monthly Claims Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748', marginBottom: '20px' }}>
            Monthly Performance — Last 6 Months
          </h2>
          <table style={{ width: '100%', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: '#718096', fontWeight: '600' }}>Month</th>
                <th style={{ padding: '10px 12px', color: '#718096', fontWeight: '600' }}>Claims</th>
                <th style={{ padding: '10px 12px', color: '#718096', fontWeight: '600' }}>Revenue Collected</th>
              </tr>
            </thead>
            <tbody>
              {[...monthlyData].reverse().map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 12px', fontWeight: '600', color: '#2d3748' }}>{m.label}</td>
                  <td style={{ padding: '12px 12px', color: '#4a5568' }}>{m.claims}</td>
                  <td style={{ padding: '12px 12px', color: '#4a5568' }}>
                    ${m.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function KPICard({ label, value, color, icon, sub }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderTop: `4px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <p style={{ fontSize: '12px', color: '#718096', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <span style={{ fontSize: '28px' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '28px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' }}>{value}</p>
      {sub && <p style={{ fontSize: '12px', color: '#a0aec0' }}>{sub}</p>}
    </div>
  );
}

function PaymentBreakdownRow({ label, amount, total, color }) {
  const pct = total > 0 ? ((amount / total) * 100).toFixed(0) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', color: '#4a5568' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#2d3748' }}>
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({pct}%)
        </span>
      </div>
      <div style={{ height: '8px', background: '#edf2f7', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '4px' }} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value, extra, trendUp, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '13px', color: '#718096' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {extra && (
          <span style={{ fontSize: '11px', color: trendUp ? '#48bb78' : '#f56565', fontWeight: '600' }}>{extra}</span>
        )}
        <span style={{
          fontSize: '14px', fontWeight: '700',
          color: highlight ? '#f56565' : '#2d3748'
        }}>{value}</span>
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
