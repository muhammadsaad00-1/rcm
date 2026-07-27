import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import DenialsActions from './DenialsActions';

export default async function DenialsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (!userData) redirect('/auth/login?error=profile_missing');

  if (!['admin', 'billing'].includes(userData.role)) {
    redirect('/auth/login?error=unauthorized');
  }

  const [
    { data: activeDenials },
    { data: appealedDenials },
  ] = await Promise.all([
    supabase
      .from('denials')
      .select('*, claims!inner(claim_number, total_charge, patients!inner(first_name, last_name), users!claims_submitted_by_fkey(full_name))')
      .eq('is_appealed', false)
      .order('denial_date', { ascending: false }),
    supabase
      .from('denials')
      .select('*, claims!inner(claim_number, total_charge, patients!inner(first_name, last_name))')
      .eq('is_appealed', true)
      .order('appeal_date', { ascending: false })
      .limit(20),
  ]);

  const totalAmountDenied = (activeDenials ?? []).reduce((sum, d) => sum + parseFloat(d.amount_denied || 0), 0);
  const totalAppealed = (appealedDenials ?? []).reduce((sum, d) => sum + parseFloat(d.amount_denied || 0), 0);

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="text-navy font-bold" style={{ fontSize: '32px', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Denials Management
            </h1>
            <p className="text-gray text-sm">Review denied claims, file appeals, and track resolution</p>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <KpiBox label="Active Denials" value={activeDenials?.length || 0} sub={`$${totalAmountDenied.toLocaleString('en-US', { minimumFractionDigits: 2 })} at risk`} color="var(--red)" />
          <KpiBox label="Appealed" value={appealedDenials?.length || 0} sub={`$${totalAppealed.toLocaleString('en-US', { minimumFractionDigits: 2 })} in dispute`} color="var(--gold)" />
          <KpiBox label="Appeal Rate" value={activeDenials?.length ? `${Math.round((appealedDenials?.length || 0) / ((activeDenials?.length || 0) + (appealedDenials?.length || 0)) * 100)}%` : '—'} sub="of all denials appealed" color="var(--teal)" />
        </div>

        {/* Active Denials */}
        <div className="card-modern" style={{ marginBottom: '24px' }}>
          <div className="card-header-modern">
            <h2 className="text-navy font-semibold text-lg">Active Denials — Require Action</h2>
            <span className="badge-modern danger">{activeDenials?.length || 0} open</span>
          </div>

          {activeDenials && activeDenials.length > 0 ? (
            <div className="table-modern-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Claim #</th>
                    <th>Patient</th>
                    <th>Denial Reason</th>
                    <th>Amount Denied</th>
                    <th>Denial Date</th>
                    <th>Submitted By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDenials.map((denial) => (
                    <tr key={denial.id}>
                      <td className="font-semibold text-navy">
                        <Link href={`/claims/${denial.claims?.id}`} style={{ color: 'var(--teal)', textDecoration: 'none' }}>
                          {denial.claims?.claim_number}
                        </Link>
                      </td>
                      <td className="text-navy">{denial.claims?.patients?.first_name} {denial.claims?.patients?.last_name}</td>
                      <td className="text-gray" style={{ maxWidth: '250px' }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {denial.denial_reason}
                        </span>
                      </td>
                      <td className="font-semibold" style={{ color: 'var(--red)' }}>
                        ${parseFloat(denial.amount_denied).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-gray">{new Date(denial.denial_date).toLocaleDateString()}</td>
                      <td className="text-gray">{denial.claims?.users?.full_name || '—'}</td>
                      <td>
                        <DenialsActions denial={denial} role={userData.role} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--gray4)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
              <p className="font-semibold" style={{ fontSize: '16px' }}>No active denials</p>
              <p className="text-sm text-gray">All claims are in good standing</p>
            </div>
          )}
        </div>

        {/* Appealed */}
        {appealedDenials && appealedDenials.length > 0 && (
          <div className="card-modern">
            <div className="card-header-modern">
              <h2 className="text-navy font-semibold text-lg">Appealed — In Progress</h2>
              <span className="badge-modern warning">{appealedDenials.length} appeals</span>
            </div>
            <div className="table-modern-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Claim #</th>
                    <th>Patient</th>
                    <th>Denial Reason</th>
                    <th>Amount</th>
                    <th>Appeal Date</th>
                    <th>Appeal Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appealedDenials.map((denial) => (
                    <tr key={denial.id}>
                      <td className="font-semibold text-navy">{denial.claims?.claim_number}</td>
                      <td className="text-navy">{denial.claims?.patients?.first_name} {denial.claims?.patients?.last_name}</td>
                      <td className="text-gray">{denial.denial_reason}</td>
                      <td className="font-semibold" style={{ color: 'var(--gold)' }}>
                        ${parseFloat(denial.amount_denied).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-gray">{denial.appeal_date ? new Date(denial.appeal_date).toLocaleDateString() : '—'}</td>
                      <td className="text-gray" style={{ fontSize: '13px' }}>{denial.appeal_notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function KpiBox({ label, value, sub, color }) {
  return (
    <div className="card-modern" style={{ borderTop: `4px solid ${color}` }}>
      <p className="text-gray font-semibold" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{label}</p>
      <p className="text-navy font-bold" style={{ fontSize: '32px', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '6px' }}>{value}</p>
      <p className="text-gray" style={{ fontSize: '13px' }}>{sub}</p>
    </div>
  );
}
