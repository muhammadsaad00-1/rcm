import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function PatientDetailPage({ params }) {
  const { id } = await params;
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

  // Fetch patient
  const { data: patient, error } = await supabase
    .from('patients')
    .select('*, users!patients_created_by_fkey(full_name)')
    .eq('id', id)
    .single();

  if (error || !patient) {
    notFound();
  }

  // Fetch patient's claims
  const { data: claims } = await supabase
    .from('claims')
    .select('id, claim_number, status, total_charge, service_date, created_at')
    .eq('patient_id', id)
    .order('created_at', { ascending: false });

  // Fetch patient's insurance
  const { data: insurances } = await supabase
    .from('patient_insurance')
    .select('*, insurance_companies(company_name, phone)')
    .eq('patient_id', id);

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <Link href="/patients" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              ← Back to Patients
            </Link>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginTop: '8px', color: '#1a202c' }}>
              {patient.first_name} {patient.last_name}
            </h1>
            <p style={{ color: '#718096', marginTop: '4px' }}>
              Patient Record · Added {new Date(patient.created_at).toLocaleDateString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {(userData.role === 'admin' || userData.role === 'billing') && (
              <Link href={`/claims/new?patient=${id}`} style={{
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                + New Claim
              </Link>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Demographics */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
              Demographics
            </h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              <DetailRow label="Full Name" value={`${patient.first_name} ${patient.last_name}`} />
              <DetailRow label="Date of Birth" value={patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'N/A'} />
              <DetailRow label="Gender" value={patient.gender ? capitalize(patient.gender) : 'N/A'} />
              <DetailRow label="SSN (Last 4)" value={patient.ssn_last_4 ? `***-**-${patient.ssn_last_4}` : 'N/A'} />
              <DetailRow label="Status" value={
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: patient.is_active ? '#48bb78' : '#f56565',
                  color: 'white'
                }}>
                  {patient.is_active ? 'Active' : 'Inactive'}
                </span>
              } />
              <DetailRow label="Added By" value={patient.users?.full_name || 'N/A'} />
            </div>
          </div>

          {/* Contact Information */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
              Contact Information
            </h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              <DetailRow label="Phone" value={patient.phone || 'N/A'} />
              <DetailRow label="Email" value={patient.email || 'N/A'} />
              <DetailRow label="Address" value={patient.address || 'N/A'} />
              <DetailRow label="City" value={patient.city || 'N/A'} />
              <DetailRow label="State" value={patient.state || 'N/A'} />
              <DetailRow label="ZIP Code" value={patient.zip_code || 'N/A'} />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        {(patient.emergency_contact_name || patient.emergency_contact_phone) && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
              Emergency Contact
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <DetailRow label="Name" value={patient.emergency_contact_name || 'N/A'} />
              <DetailRow label="Phone" value={patient.emergency_contact_phone || 'N/A'} />
            </div>
          </div>
        )}

        {/* Insurance */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
            Insurance
          </h2>
          {insurances && insurances.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {insurances.map((ins) => (
                <div key={ins.id} style={{
                  padding: '16px',
                  background: '#f7fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <DetailRow label="Insurance Company" value={ins.insurance_companies?.company_name || 'N/A'} />
                    <DetailRow label="Policy Number" value={ins.policy_number || 'N/A'} />
                    <DetailRow label="Coverage Type" value={ins.coverage_type ? capitalize(ins.coverage_type) : 'N/A'} />
                    <DetailRow label="Group Number" value={ins.group_number || 'N/A'} />
                    <DetailRow label="Subscriber" value={ins.subscriber_name || 'N/A'} />
                    <DetailRow label="Effective Date" value={ins.effective_date ? new Date(ins.effective_date).toLocaleDateString() : 'N/A'} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#a0aec0', fontSize: '14px' }}>No insurance records on file.</p>
          )}
        </div>

        {/* Claims History */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>
              Claims History ({claims?.length || 0})
            </h2>
            {(userData.role === 'admin' || userData.role === 'billing') && (
              <Link href={`/claims/new?patient=${id}`} style={{
                color: '#667eea',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                + New Claim
              </Link>
            )}
          </div>
          {claims && claims.length > 0 ? (
            <table style={{ width: '100%', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px', color: '#718096', fontWeight: '600' }}>Claim #</th>
                  <th style={{ padding: '10px 8px', color: '#718096', fontWeight: '600' }}>Service Date</th>
                  <th style={{ padding: '10px 8px', color: '#718096', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '10px 8px', color: '#718096', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '10px 8px', color: '#718096', fontWeight: '600' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>
                      <Link href={`/claims/${claim.id}`} style={{ color: '#667eea', textDecoration: 'none' }}>
                        {claim.claim_number}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>
                      {claim.service_date ? new Date(claim.service_date).toLocaleDateString() : 'N/A'}
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
                    <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>
                      ${parseFloat(claim.total_charge || 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>
                      {new Date(claim.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#a0aec0', fontSize: '14px' }}>No claims on file for this patient.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '12px', color: '#a0aec0', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: '#2d3748', fontWeight: '500' }}>
        {value || '—'}
      </div>
    </div>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
