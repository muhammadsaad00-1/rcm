import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import ClaimActions from './ClaimActions';

export default async function ClaimDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (!userData) redirect('/auth/login?error=profile_missing');

  const { data: claim, error } = await supabase
    .from('claims')
    .select(`
      *,
      patients(id, first_name, last_name, date_of_birth, phone, email),
      users!claims_submitted_by_fkey(full_name),
      claim_line_items(*),
      payments(id, payment_number, amount_paid, payment_type, payment_date),
      denials(id, denial_reason, denial_date, amount_denied, is_appealed, appeal_notes)
    `)
    .eq('id', id)
    .single();

  if (error || !claim) notFound();

  const totalPaid = (claim.payments ?? []).reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
  const balance = parseFloat(claim.total_charge || 0) - totalPaid;

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <Link href="/claims" style={{ color: 'var(--teal)', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              ← Back to Claims
            </Link>
            <h1 className="text-navy font-bold" style={{ fontSize: '28px', letterSpacing: '-0.02em', marginTop: '8px', marginBottom: '4px' }}>
              Claim {claim.claim_number}
            </h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className="badge-modern" style={{ background: getStatusBg(claim.status), color: getStatusColor(claim.status), padding: '4px 12px' }}>
                {claim.status}
              </span>
              <span className="text-gray" style={{ fontSize: '13px' }}>
                Service: {claim.service_date ? new Date(claim.service_date).toLocaleDateString() : 'N/A'}
              </span>
              <span className="text-gray" style={{ fontSize: '13px' }}>
                Submitted by: {claim.users?.full_name || '—'}
              </span>
            </div>
          </div>
          <ClaimActions claim={claim} role={userData.role} userId={user.id} />
        </div>

        {/* Financial Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="card-modern" style={{ borderTop: '4px solid var(--navy)' }}>
            <p className="text-gray font-semibold" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Total Billed</p>
            <p className="text-navy font-bold" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
              ${parseFloat(claim.total_charge).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="card-modern" style={{ borderTop: '4px solid var(--green)' }}>
            <p className="text-gray font-semibold" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Total Paid</p>
            <p className="font-bold" style={{ fontSize: '28px', letterSpacing: '-0.02em', color: 'var(--green)' }}>
              ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="card-modern" style={{ borderTop: `4px solid ${balance > 0 ? 'var(--gold)' : 'var(--teal)'}` }}>
            <p className="text-gray font-semibold" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>Balance</p>
            <p className="font-bold" style={{ fontSize: '28px', letterSpacing: '-0.02em', color: balance > 0 ? 'var(--gold)' : 'var(--teal)' }}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Patient Info */}
          <div className="card-modern">
            <h2 className="text-navy font-semibold" style={{ fontSize: '16px', marginBottom: '16px' }}>Patient</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Row label="Name" value={
                <Link href={`/patients/${claim.patients?.id}`} style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: '600' }}>
                  {claim.patients?.first_name} {claim.patients?.last_name}
                </Link>
              } />
              <Row label="DOB" value={claim.patients?.date_of_birth ? new Date(claim.patients.date_of_birth).toLocaleDateString() : '—'} />
              <Row label="Phone" value={claim.patients?.phone || '—'} />
              <Row label="Email" value={claim.patients?.email || '—'} />
            </div>
          </div>

          {/* Claim Details */}
          <div className="card-modern">
            <h2 className="text-navy font-semibold" style={{ fontSize: '16px', marginBottom: '16px' }}>Claim Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Row label="Claim #" value={claim.claim_number} />
              <Row label="Service Date" value={claim.service_date ? new Date(claim.service_date).toLocaleDateString() : '—'} />
              <Row label="Diagnosis Codes" value={claim.diagnosis_codes || '—'} />
              <Row label="Procedure Codes" value={claim.procedure_codes || '—'} />
              {claim.notes && <Row label="Notes" value={claim.notes} />}
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="card-modern" style={{ marginBottom: '20px' }}>
          <div className="card-header-modern">
            <h2 className="text-navy font-semibold" style={{ fontSize: '16px' }}>Payments ({claim.payments?.length || 0})</h2>
            <Link href={`/payments/new?claim=${id}`} className="btn-modern btn-modern-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>
              + Post Payment
            </Link>
          </div>
          {claim.payments && claim.payments.length > 0 ? (
            <div className="table-modern-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {claim.payments.map(p => (
                    <tr key={p.id}>
                      <td className="font-semibold text-navy">{p.payment_number}</td>
                      <td>
                        <span className="badge-modern info" style={{ fontSize: '11px' }}>{p.payment_type}</span>
                      </td>
                      <td className="font-semibold" style={{ color: 'var(--green)' }}>
                        ${parseFloat(p.amount_paid).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-gray">{new Date(p.payment_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray text-sm" style={{ padding: '20px 0', textAlign: 'center' }}>No payments posted yet</p>
          )}
        </div>

        {/* Denials */}
        {claim.denials && claim.denials.length > 0 && (
          <div className="card-modern">
            <h2 className="text-navy font-semibold" style={{ fontSize: '16px', marginBottom: '16px' }}>Denial History</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {claim.denials.map((d) => (
                <div key={d.id} style={{ padding: '16px', background: d.is_appealed ? '#fffbf0' : '#fff5f5', borderLeft: `4px solid ${d.is_appealed ? 'var(--gold)' : 'var(--red)'}`, borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p className="font-semibold text-navy" style={{ marginBottom: '4px' }}>{d.denial_reason}</p>
                      {d.appeal_notes && <p className="text-gray" style={{ fontSize: '13px', marginTop: '6px' }}>Appeal: {d.appeal_notes}</p>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="font-semibold" style={{ color: 'var(--red)', fontSize: '16px' }}>
                        -${parseFloat(d.amount_denied).toFixed(2)}
                      </p>
                      <span className="badge-modern" style={{ fontSize: '11px', marginTop: '6px', display: 'inline-block', background: d.is_appealed ? 'rgba(245,166,35,0.1)' : 'rgba(232,83,75,0.1)', color: d.is_appealed ? 'var(--gold)' : 'var(--red)' }}>
                        {d.is_appealed ? 'Appealed' : 'Active Denial'}
                      </span>
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

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <span className="text-gray font-semibold" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: '120px', paddingTop: '2px' }}>{label}</span>
      <span className="text-navy" style={{ fontSize: '14px' }}>{value || '—'}</span>
    </div>
  );
}

function getStatusColor(status) {
  const c = { draft: '#718096', submitted: '#2980b9', pending: 'var(--gold)', paid: 'var(--green)', denied: 'var(--red)', appealed: '#9f7aea', void: '#a0aec0' };
  return c[status] || '#718096';
}
function getStatusBg(status) {
  const c = { draft: 'var(--gray1)', submitted: 'rgba(41,128,185,0.1)', pending: 'rgba(245,166,35,0.1)', paid: 'rgba(39,174,96,0.1)', denied: 'rgba(232,83,75,0.1)', appealed: 'rgba(159,122,234,0.1)', void: 'var(--gray2)' };
  return c[status] || 'var(--gray1)';
}
