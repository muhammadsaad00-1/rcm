import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Suspense } from 'react';
import PatientsClient from './PatientsClient';

export default async function PatientsPage({ searchParams }) {
  const supabase = await createClient();
  const params = await searchParams;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (!userData) redirect('/auth/login?error=profile_missing');

  const search = params?.search || '';
  const statusFilter = params?.status || '';

  let query = supabase
    .from('patients')
    .select('*, users!patients_created_by_fkey(full_name)')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
  }
  if (statusFilter === 'active') query = query.eq('is_active', true);
  if (statusFilter === 'inactive') query = query.eq('is_active', false);

  const { data: patients, error } = await query;

  let pendingPortalCount = 0;
  if (userData.role === 'admin') {
    const { count } = await supabase
      .from('patient_portal_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    pendingPortalCount = count || 0;
  }

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a202c' }}>Patients</h1>
            <p style={{ color: '#718096' }}>Manage patient records and demographics</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {userData.role === 'admin' && (
              <Link href="/admin/patients/pending" style={{ position: 'relative', padding: '14px 20px', background: 'white', border: '2px solid #e2e8f0', color: '#1a202c', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                🔔 Portal Requests
                {pendingPortalCount > 0 && (
                  <span style={{ background: '#e53e3e', color: 'white', borderRadius: '999px', fontSize: '11px', fontWeight: '700', padding: '2px 7px', lineHeight: 1.4 }}>
                    {pendingPortalCount}
                  </span>
                )}
              </Link>
            )}
            {['admin', 'support'].includes(userData.role) && (
              <Link href="/patients/new" style={{ padding: '14px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                ➕ Add New Patient
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div style={{ color: '#f56565', marginBottom: '16px', padding: '12px', background: '#fff5f5', borderRadius: '8px' }}>
            Error loading patients: {error.message}
          </div>
        )}

        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>Loading...</div>}>
          <PatientsClient patients={patients || []} role={userData.role} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
