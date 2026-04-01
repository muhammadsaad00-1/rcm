import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function PatientsPage() {
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

  // Fetch all patients
  const { data: patients, error } = await supabase
    .from('patients')
    .select('*, users!patients_created_by_fkey(full_name)')
    .order('created_at', { ascending: false });

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a202c' }}>
              Patients
            </h1>
            <p style={{ color: '#718096' }}>
              Manage patient records and demographics
            </p>
          </div>
          {(userData.role === 'admin' || userData.role === 'support') && (
            <Link href="/patients/new" style={{
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
              <span>➕</span> Add New Patient
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <input
            type="text"
            placeholder="Search patients by name, phone, or email..."
            style={{
              width: '100%',
              padding: '14px 20px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Patients Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {error && (
            <div style={{ color: '#f56565', marginBottom: '16px', padding: '12px', background: '#fff5f5', borderRadius: '8px' }}>
              Error loading patients: {error.message}
            </div>
          )}
          
          {patients && patients.length > 0 ? (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>DOB</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Phone</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Created By</th>
                    <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>
                        {patient.first_name} {patient.last_name}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#718096' }}>
                        {new Date(patient.date_of_birth).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#718096' }}>{patient.phone}</td>
                      <td style={{ padding: '12px 8px', color: '#718096' }}>{patient.email || 'N/A'}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: patient.is_active ? '#c6f6d5' : '#fed7d7',
                          color: patient.is_active ? '#22543d' : '#742a2a'
                        }}>
                          {patient.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#718096', fontSize: '13px' }}>
                        {patient.users?.full_name || 'Unknown'}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <Link href={`/patients/${patient.id}`} style={{
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
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏥</div>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No patients found</p>
              <p style={{ fontSize: '14px' }}>Get started by adding your first patient</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
