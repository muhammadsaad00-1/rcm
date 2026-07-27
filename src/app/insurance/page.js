import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function InsurancePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (!userData) redirect('/auth/login?error=profile_missing');

  if (!['admin', 'billing', 'support'].includes(userData.role)) {
    redirect('/auth/login?error=unauthorized');
  }

  const [
    { data: companies },
    { data: patientInsurance },
  ] = await Promise.all([
    supabase.from('insurance_companies').select('*').order('company_name'),
    supabase
      .from('patient_insurance')
      .select('*, patients(first_name, last_name), insurance_companies(company_name)')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <div style={{ marginBottom: '32px' }}>
          <h1 className="text-navy font-bold" style={{ fontSize: '32px', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Insurance Management
          </h1>
          <p className="text-gray text-sm">Payer directory and patient insurance verification</p>
        </div>

        {/* Payer Directory */}
        <div className="card-modern" style={{ marginBottom: '24px' }}>
          <div className="card-header-modern">
            <h2 className="text-navy font-semibold text-lg">Payer Directory ({companies?.length || 0})</h2>
          </div>

          {companies && companies.length > 0 ? (
            <div className="table-modern-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Payer Name</th>
                    <th>Phone</th>
                    <th>Fax</th>
                    <th>Payer ID</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((co) => (
                    <tr key={co.id}>
                      <td className="font-semibold text-navy">{co.company_name}</td>
                      <td className="text-gray">{co.phone || '—'}</td>
                      <td className="text-gray">{co.fax || '—'}</td>
                      <td className="text-gray">{co.payer_id || '—'}</td>
                      <td className="text-gray" style={{ fontSize: '13px' }}>
                        {[co.address, co.city, co.state, co.zip_code].filter(Boolean).join(', ') || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--gray4)' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛡️</div>
              <p className="font-semibold" style={{ fontSize: '16px' }}>No payers in directory</p>
              <p className="text-sm text-gray">Add insurance companies to the database to see them here</p>
            </div>
          )}
        </div>

        {/* Recent Patient Insurance */}
        <div className="card-modern">
          <div className="card-header-modern">
            <h2 className="text-navy font-semibold text-lg">Recent Patient Insurance Records</h2>
            <Link href="/patients" className="text-teal font-semibold text-sm" style={{ textDecoration: 'none' }}>
              All Patients →
            </Link>
          </div>

          {patientInsurance && patientInsurance.length > 0 ? (
            <div className="table-modern-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Insurance Company</th>
                    <th>Policy #</th>
                    <th>Group #</th>
                    <th>Coverage Type</th>
                    <th>Effective Date</th>
                  </tr>
                </thead>
                <tbody>
                  {patientInsurance.map((ins) => (
                    <tr key={ins.id}>
                      <td className="font-semibold text-navy">
                        {ins.patients?.first_name} {ins.patients?.last_name}
                      </td>
                      <td className="text-navy">{ins.insurance_companies?.company_name || '—'}</td>
                      <td className="text-gray">{ins.policy_number || '—'}</td>
                      <td className="text-gray">{ins.group_number || '—'}</td>
                      <td>
                        {ins.coverage_type && (
                          <span className="badge-modern info" style={{ fontSize: '11px', textTransform: 'capitalize' }}>
                            {ins.coverage_type}
                          </span>
                        )}
                      </td>
                      <td className="text-gray">
                        {ins.effective_date ? new Date(ins.effective_date).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--gray4)' }}>
              <p className="font-semibold" style={{ fontSize: '16px' }}>No insurance records yet</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
