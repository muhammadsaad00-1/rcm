import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function UsersManagementPage() {
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

  if (userData?.role !== 'admin') {
    redirect('/auth/login?error=unauthorized');
  }

  // Fetch all users
  const { data: allUsers } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  // Group by role
  const roleStats = allUsers?.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout user={userData} role="admin">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#1a202c' }}>
              User Management
            </h1>
            <p style={{ color: '#718096' }}>
              Manage system users and their roles
            </p>
          </div>
          <Link href="/admin/users/new" style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            + Add New User
          </Link>
        </div>

        {/* Role Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <RoleStat role="Admin" count={roleStats?.admin || 0} color="#667eea" />
          <RoleStat role="Billing" count={roleStats?.billing || 0} color="#4299e1" />
          <RoleStat role="Support" count={roleStats?.support || 0} color="#48bb78" />
          <RoleStat role="Finance" count={roleStats?.finance || 0} color="#ed8936" />
        </div>

        {/* Users Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#2d3748' }}>
            All Users ({allUsers?.length || 0})
          </h2>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Email</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Phone</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Role</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Status</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Joined</th>
                  <th style={{ padding: '12px 8px', color: '#718096', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers?.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 8px', fontWeight: '600', color: '#2d3748' }}>
                      {u.full_name || '—'}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>
                      {u.email}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>
                      {u.phone || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: getRoleColor(u.role),
                        color: 'white'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: u.is_active ? '#48bb78' : '#f56565',
                        color: 'white'
                      }}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', color: '#718096' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <Link href={`/admin/users/${u.id}`} style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}>
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function RoleStat({ role, count, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase' }}>
        {role}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '700', color: '#2d3748' }}>
        {count}
      </div>
    </div>
  );
}

function getRoleColor(role) {
  const colors = {
    admin: '#667eea',
    billing: '#4299e1',
    support: '#48bb78',
    finance: '#ed8936'
  };
  return colors[role] || '#718096';
}
