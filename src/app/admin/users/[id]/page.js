import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import UserEditForm from './UserEditForm';

export default async function EditUserPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single();

  if (!userData || userData.role !== 'admin') redirect('/auth/login?error=unauthorized');

  const { data: targetUser, error } = await supabase
    .from('users').select('*').eq('id', id).single();

  if (error || !targetUser) notFound();

  return (
    <DashboardLayout user={userData} role="admin">
      <UserEditForm targetUser={targetUser} currentUserId={user.id} />
    </DashboardLayout>
  );
}
