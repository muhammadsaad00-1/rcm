import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PatientEditForm from './PatientEditForm';

export default async function EditPatientPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (!userData) redirect('/auth/login?error=profile_missing');

  if (!['admin', 'billing', 'support'].includes(userData.role)) {
    redirect('/auth/login?error=unauthorized');
  }

  const { data: patient, error } = await supabase
    .from('patients').select('*').eq('id', id).single();

  if (error || !patient) notFound();

  return (
    <DashboardLayout user={userData} role={userData.role}>
      <PatientEditForm patient={patient} role={userData.role} />
    </DashboardLayout>
  );
}
