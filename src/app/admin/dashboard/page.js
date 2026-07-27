import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    redirect('/auth/login?error=profile_missing');
  }

  if (userData.role !== 'admin') {
    redirect('/auth/login?error=not_admin');
  }

  // Fetch dashboard stats — all errors swallowed so the page never hard-crashes
  const [
    { data: allUsers },
    { data: totalPatients },
    { data: totalClaims },
    { data: totalPayments },
    { data: recentClaims },
    { data: claimsByStatus },
  ] = await Promise.all([
    supabase.from('users').select('*').order('created_at', { ascending: false }),
    supabase.from('patients').select('id'),
    supabase.from('claims').select('id'),
    supabase.from('payments').select('amount_paid'),
    supabase.from('claims').select('id, claim_number, status, total_charge, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('claims').select('status, total_charge'),
  ]);

  const statusSummary = (claimsByStatus ?? []).reduce((acc, claim) => {
    if (!acc[claim.status]) acc[claim.status] = { count: 0, amount: 0 };
    acc[claim.status].count++;
    acc[claim.status].amount += parseFloat(claim.total_charge || 0);
    return acc;
  }, {});

  const totalRevenue = (totalPayments ?? []).reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);

  const usersByRole = (allUsers ?? []).reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout user={userData} role="admin">
      <div className="dashboard-content-main">
        {/* Page Header */}
        <div className="card-header-modern" style={{ borderBottom: 'none' }}>
          <div>
            <h1 className="text-navy font-bold" style={{ fontSize: '32px', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              System Overview
            </h1>
            <p className="text-gray text-sm">
              Manage users, track platform health, and overview revenue cycle metrics.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/admin/users/new" className="btn-modern btn-modern-primary">
              <span className="text-lg">+</span> Add User
            </Link>
            <Link href="/patients/new" className="btn-modern btn-modern-outline" style={{ background: 'var(--white)' }}>
              <span className="text-lg">+</span> Add Patient
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <StatCard
            title="Active Users"
            value={allUsers?.length || 0}
            icon="👥"
            color="var(--navy)"
            subtitle={`Admin: ${usersByRole?.admin || 0} | Billing: ${usersByRole?.billing || 0}`}
          />
          <StatCard
            title="Total Patients"
            value={totalPatients?.length || 0}
            icon="🏥"
            color="var(--teal)"
            subtitle="Registered active patients"
          />
          <StatCard
            title="Total Claims"
            value={totalClaims?.length || 0}
            icon="📄"
            color="var(--gold)"
            subtitle={`Pending action: ${statusSummary?.pending?.count || 0}`}
          />
          <StatCard
            title="Collected Revenue"
            value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon="💰"
            color="var(--green)"
            subtitle="From all system payments"
          />
        </div>

        {/* Two Column Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
          
          {/* Quick Actions (Left Column) */}
          <div className="card-modern card-modern-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="text-navy font-semibold text-lg" style={{ marginBottom: '20px' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <QuickActionItem title="Manage User Roles" link="/admin/users" icon="👤" />
              <QuickActionItem title="Browse Patient Records" link="/patients" icon="🏥" />
              <QuickActionItem title="Monitor All Claims" link="/claims" icon="📋" />
              <QuickActionItem title="Payment History" link="/payments" icon="💳" />
              <QuickActionItem title="Pending Portal Approvals" link="/admin/patients/pending" icon="🔔" />
            </div>
          </div>

          {/* Claims Status Summary (Right Column) */}
          <div className="card-modern">
            <h2 className="text-navy font-semibold text-lg" style={{ marginBottom: '20px' }}>
              Claims Health Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              {statusSummary && Object.entries(statusSummary).map(([status, data]) => (
                <div key={status} style={{
                  padding: '20px',
                  background: 'var(--off)',
                  borderRadius: 'var(--r-sm)',
                  borderLeft: `3px solid ${getStatusColor(status).trim()}`
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--gray4)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.05em' }}>
                    {status}
                  </div>
                  <div className="text-navy" style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                    {data.count}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text3)', fontWeight: '600' }}>
                    ${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management Overview */}
        <div className="card-modern">
          <div className="card-header-modern">
            <h2 className="text-navy font-semibold text-lg">Platform Users</h2>
            <Link href="/admin/users" className="text-teal font-semibold text-sm hover-lift" style={{ textDecoration: 'none' }}>
              View All Directory →
            </Link>
          </div>
          <div className="table-modern-wrapper">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {allUsers?.slice(0, 5).map((u) => (
                  <tr key={u.id}>
                    <td className="font-semibold text-navy">{u.full_name || '—'}</td>
                    <td className="text-gray">{u.email}</td>
                    <td>
                      <span className={`badge-modern ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-modern ${u.is_active ? 'success' : 'danger'}`}>
                        {u.is_active ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="text-gray">
                      {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Claims Table */}
        <div className="card-modern" style={{ marginTop: '24px' }}>
          <div className="card-header-modern">
            <h2 className="text-navy font-semibold text-lg">Live Claim Feed</h2>
            <Link href="/claims" className="text-teal font-semibold text-sm hover-lift" style={{ textDecoration: 'none' }}>
              View Claim Pipeline →
            </Link>
          </div>
          <div className="table-modern-wrapper">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Status Tracker</th>
                  <th>Billed Amount</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims?.map((claim) => (
                  <tr key={claim.id}>
                    <td className="font-semibold text-navy">#{claim.claim_number}</td>
                    <td>
                      <span className="badge-modern neutral" style={{ background: getStatusBg(claim.status), color: getStatusColor(claim.status) }}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="font-semibold text-navy">${parseFloat(claim.total_charge).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="text-gray">
                      {new Date(claim.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="card-modern card-modern-hover" style={{ borderTop: `4px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <p className="text-gray font-semibold text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            {title}
          </p>
          <p className="text-navy" style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1' }}>
            {value}
          </p>
        </div>
        <div style={{ 
          fontSize: '24px', 
          width: '48px', 
          height: '48px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'var(--off)', 
          borderRadius: '12px' 
        }}>
          {icon}
        </div>
      </div>
      {subtitle && (
        <p className="text-gray" style={{ fontSize: '13px', borderTop: '1px solid var(--gray1)', paddingTop: '12px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function QuickActionItem({ title, link, icon }) {
  return (
    <Link href={link} className="quick-action-item">
      <div style={{ fontSize: '20px' }}>{icon}</div>
      <div className="text-navy font-semibold text-sm">{title}</div>
      <div style={{ marginLeft: 'auto', color: 'var(--teal)' }}>→</div>
    </Link>
  );
}

function getRoleBadge(role) {
  switch(role) {
    case 'admin': return 'info';
    case 'billing': return 'success';
    case 'finance': return 'warning';
    default: return 'neutral';
  }
}

function getStatusColor(status) {
  const colors = {
    draft: 'var(--gray4)',
    submitted: '#2980b9',
    pending: 'var(--gold)',
    paid: 'var(--green)',
    denied: 'var(--red)',
    appealed: 'var(--navy)',
    void: 'var(--text3)'
  };
  return colors[status] || 'var(--text3)';
}

function getStatusBg(status) {
  const bgs = {
    draft: 'var(--gray1)',
    submitted: 'rgba(41, 128, 185, 0.1)',
    pending: 'rgba(245, 166, 35, 0.1)',
    paid: 'rgba(39, 174, 96, 0.1)',
    denied: 'rgba(232, 83, 75, 0.1)',
    appealed: 'rgba(11, 20, 55, 0.1)',
    void: 'var(--gray2)'
  };
  return bgs[status] || 'var(--gray1)';
}
