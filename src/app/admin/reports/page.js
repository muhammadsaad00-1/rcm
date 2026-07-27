import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import ReportsExport from './ReportsExport';

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (!userData || !['admin', 'finance'].includes(userData.role)) {
    redirect('/auth/login?error=unauthorized');
  }

  const [
    { data: claims },
    { data: payments },
    { data: denials },
    { data: arAging },
  ] = await Promise.all([
    supabase.from('claims').select('id, claim_number, status, total_charge, service_date, created_at, patients(first_name, last_name)'),
    supabase.from('payments').select('id, payment_number, amount_paid, payment_type, payment_date, claims(claim_number, patients(first_name, last_name))'),
    supabase.from('denials').select('*, claims(claim_number, total_charge, patients(first_name, last_name))'),
    supabase.from('ar_aging').select('*'),
  ]);

  const agingBuckets = computeArAging(claims ?? [], payments ?? [], arAging ?? []);

  const totalBilled = (claims ?? []).reduce((s, c) => s + parseFloat(c.total_charge || 0), 0);
  const totalCollected = (payments ?? []).filter(p => ['insurance', 'patient'].includes(p.payment_type)).reduce((s, p) => s + parseFloat(p.amount_paid || 0), 0);
  const totalDenied = (denials ?? []).reduce((s, d) => s + parseFloat(d.amount_denied || 0), 0);
  const outstandingAR = totalBilled - totalCollected;
  const denialRate = (claims ?? []).length > 0
    ? (((claims ?? []).filter(c => c.status === 'denied').length / (claims ?? []).length) * 100).toFixed(1)
    : '0.0';
  const collectionRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="text-navy font-bold" style={{ fontSize: '32px', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Reports & Analytics
            </h1>
            <p className="text-gray text-sm">AR aging, revenue summary, denial analysis</p>
          </div>
          <ReportsExport claims={claims || []} payments={payments || []} denials={denials || []} agingBuckets={agingBuckets} />
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <Kpi label="Total Billed" value={`$${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} color="var(--navy)" />
          <Kpi label="Total Collected" value={`$${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} color="var(--green)" />
          <Kpi label="Outstanding AR" value={`$${outstandingAR.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} color="var(--gold)" />
          <Kpi label="Total Denied" value={`$${totalDenied.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} color="var(--red)" />
          <Kpi label="Denial Rate" value={`${denialRate}%`} color="var(--teal)" />
          <Kpi label="Collection Rate" value={`${collectionRate}%`} color="var(--navy)" />
        </div>

        {/* AR Aging Table */}
        <div className="card-modern" style={{ marginBottom: '24px' }}>
          <div className="card-header-modern">
            <h2 className="text-navy font-semibold text-lg">AR Aging Report</h2>
            <span className="text-gray text-sm">Outstanding balance by days since service date</span>
          </div>
          <div className="table-modern-wrapper">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Aging Bucket</th>
                  <th>Claims</th>
                  <th>Amount Outstanding</th>
                  <th>% of Total AR</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {agingBuckets.map((bucket) => {
                  const pct = outstandingAR > 0 ? ((bucket.amount / outstandingAR) * 100).toFixed(1) : '0.0';
                  const risk = bucket.label.includes('120+') ? 'High' : bucket.label.includes('91') ? 'Medium' : bucket.label.includes('61') ? 'Low' : 'Clean';
                  const riskColor = { High: 'var(--red)', Medium: 'var(--gold)', Low: '#4299e1', Clean: 'var(--green)' }[risk];
                  return (
                    <tr key={bucket.label}>
                      <td className="font-semibold text-navy">{bucket.label}</td>
                      <td className="text-gray">{bucket.count}</td>
                      <td className="font-semibold" style={{ color: bucket.amount > 0 ? 'var(--navy)' : 'var(--gray4)' }}>
                        ${bucket.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-gray">{pct}%</td>
                      <td>
                        <span className="badge-modern" style={{ background: `${riskColor}22`, color: riskColor, fontSize: '11px' }}>{risk}</span>
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ borderTop: '2px solid var(--border)' }}>
                  <td className="font-semibold text-navy">Total</td>
                  <td className="font-semibold text-navy">{(claims ?? []).filter(c => !['paid', 'void'].includes(c.status)).length}</td>
                  <td className="font-semibold text-navy">${outstandingAR.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="font-semibold text-navy">100%</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Claims by Status + Active Denials */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card-modern">
            <h2 className="text-navy font-semibold text-lg" style={{ marginBottom: '16px' }}>Claims by Status</h2>
            {Object.entries(
              (claims ?? []).reduce((acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; }, {})
            ).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray2)' }}>
                <span className="font-semibold text-navy" style={{ textTransform: 'capitalize' }}>{status}</span>
                <span className="badge-modern" style={{ background: getStatusBg(status), color: getStatusColor(status) }}>{count}</span>
              </div>
            ))}
          </div>

          <div className="card-modern">
            <h2 className="text-navy font-semibold text-lg" style={{ marginBottom: '16px' }}>Active Denials</h2>
            {(denials ?? []).filter(d => !d.is_appealed).length === 0 ? (
              <p className="text-gray text-sm" style={{ padding: '24px 0', textAlign: 'center' }}>No active denials — great work!</p>
            ) : (
              <div className="table-modern-wrapper">
                <table className="table-modern">
                  <thead><tr><th>Claim</th><th>Patient</th><th>Amount</th></tr></thead>
                  <tbody>
                    {(denials ?? []).filter(d => !d.is_appealed).slice(0, 8).map(d => (
                      <tr key={d.id}>
                        <td className="font-semibold text-navy">{d.claims?.claim_number}</td>
                        <td className="text-gray">{d.claims?.patients?.first_name} {d.claims?.patients?.last_name}</td>
                        <td style={{ color: 'var(--red)', fontWeight: '600' }}>${parseFloat(d.amount_denied).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ marginTop: '16px' }}>
              <Link href="/denials" className="text-teal font-semibold text-sm" style={{ textDecoration: 'none' }}>Manage All Denials →</Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function computeArAging(claims, payments, arAgingTable) {
  if (arAgingTable.length > 0) {
    return arAgingTable.map(row => ({
      label: row.aging_bucket || row.bucket || 'Unknown',
      count: row.claim_count || 0,
      amount: parseFloat(row.total_amount || 0),
    }));
  }

  const buckets = {
    'Current (0–30 days)': { count: 0, amount: 0 },
    '31–60 days': { count: 0, amount: 0 },
    '61–90 days': { count: 0, amount: 0 },
    '91–120 days': { count: 0, amount: 0 },
    '120+ days': { count: 0, amount: 0 },
  };

  const now = new Date();
  claims.filter(c => !['paid', 'void'].includes(c.status)).forEach(claim => {
    const serviceDate = new Date(claim.service_date || claim.created_at);
    const daysOld = Math.floor((now - serviceDate) / (1000 * 60 * 60 * 24));
    const outstanding = parseFloat(claim.total_charge || 0);
    if (outstanding <= 0) return;

    const key = daysOld <= 30 ? 'Current (0–30 days)'
      : daysOld <= 60 ? '31–60 days'
      : daysOld <= 90 ? '61–90 days'
      : daysOld <= 120 ? '91–120 days'
      : '120+ days';

    buckets[key].count++;
    buckets[key].amount += outstanding;
  });

  return Object.entries(buckets).map(([label, data]) => ({ label, ...data }));
}

function Kpi({ label, value, color }) {
  return (
    <div className="card-modern" style={{ borderTop: `4px solid ${color}` }}>
      <p className="text-gray font-semibold" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{label}</p>
      <p className="text-navy font-bold" style={{ fontSize: '26px', letterSpacing: '-0.02em' }}>{value}</p>
    </div>
  );
}

function getStatusColor(status) {
  const c = { draft: '#718096', submitted: '#2980b9', pending: '#ed8936', paid: '#48bb78', denied: '#f56565', appealed: '#9f7aea', void: '#a0aec0' };
  return c[status] || '#718096';
}
function getStatusBg(status) {
  const c = { submitted: 'rgba(41,128,185,0.1)', pending: 'rgba(245,166,35,0.1)', paid: 'rgba(39,174,96,0.1)', denied: 'rgba(232,83,75,0.1)', appealed: 'rgba(159,122,234,0.1)' };
  return c[status] || 'var(--gray1)';
}
