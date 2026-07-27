'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ children, user, role }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navigation = {
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
      { name: 'Users', href: '/admin/users', icon: '👥' },
      { name: 'Patients', href: '/patients', icon: '🏥' },
      { name: 'Claims', href: '/claims', icon: '📄' },
      { name: 'Payments', href: '/payments', icon: '💳' },
      { name: 'Reports', href: '/admin/reports', icon: '📈' },
    ],
    billing: [
      { name: 'Dashboard', href: '/billing/dashboard', icon: '📊' },
      { name: 'Claims', href: '/claims', icon: '📄' },
      { name: 'Denials', href: '/denials', icon: '🚫' },
      { name: 'Payments', href: '/payments', icon: '💳' },
      { name: 'Patients', href: '/patients', icon: '🏥' },
    ],
    support: [
      { name: 'Patients', href: '/patients', icon: '🏥' },
      { name: 'Insurance', href: '/insurance', icon: '🛡️' },
    ],
    finance: [
      { name: 'Dashboard', href: '/payments/dashboard', icon: '📊' },
      { name: 'Payments', href: '/payments', icon: '💳' },
      { name: 'Reports', href: '/reports', icon: '📈' },
      { name: 'Claims', href: '/claims', icon: '📄' },
    ],
  };

  const navItems = navigation[role] || navigation.support;

  return (
    <div className="dashboard-layout-modern flex-container">
      {/* Mobile Header (Visible only on small screens) */}
      <div className="dashboard-mobile-header">
        <Link href="/" className="nav-logo">
          <img src="/logo1.jpg" alt="RenoxMed" style={{ height: '40px', width: 'auto' }} />
        </Link>
        <button className="mobile-menu-btn" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar-modern ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <img src="/logo1.jpg" alt="RenoxMed" style={{ height: '64px', width: 'auto', display: 'block', objectFit: 'contain', background: 'white', borderRadius: '10px', padding: '6px 12px' }} />
          </Link>
        </div>

        {/* User Info Card */}
        <div className="sidebar-user-card glass-panel">
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: 'var(--white)' }}>
            {user?.full_name || user?.email || 'Guest User'}
          </div>
          <div className="badge-modern info" style={{ padding: '3px 8px', fontSize: '10px' }}>
            {role || 'support'}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            onClick={() => router.push('/auth/logout')}
            className="sidebar-logout-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main-modern">
        <div className="dashboard-content-wrapper">
          {children}
        </div>
      </main>

      {/* Local CSS for Dashboard specific layout that might not belong in globals */}
      <style jsx>{`
        .dashboard-layout-modern {
          display: flex;
          min-height: 100vh;
          background: var(--gray1);
          overflow: hidden;
        }

        .dashboard-mobile-header {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 50;
        }

        .mobile-menu-btn {
          color: var(--navy);
          background: none;
          border: none;
        }

        .sidebar-modern {
          width: 260px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .sidebar-brand {
          padding: 32px 24px 24px;
        }

        .sidebar-user-card {
          margin: 0 16px 24px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--r-md);
        }

        .sidebar-nav {
          flex: 1;
          padding: 0 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .sidebar-footer {
          padding: 24px 16px;
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sidebar-logout-btn {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--r-sm);
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
        }

        .sidebar-logout-btn:hover {
          background: rgba(232, 83, 75, 0.15);
          color: var(--white);
          border-color: rgba(232, 83, 75, 0.3);
        }

        .dashboard-main-modern {
          flex: 1;
          min-width: 0; /* Prevents flex flex-child flex-wrap bug */
          height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        .dashboard-content-wrapper {
          padding: 40px;
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(11, 20, 55, 0.5);
          backdrop-filter: blur(2px);
          z-index: 90;
        }

        @media (max-width: 1024px) {
          .dashboard-content-wrapper { padding: 32px 24px; }
        }

        @media (max-width: 768px) {
          .dashboard-layout-modern {
            padding-top: 64px; /* Space for mobile header */
          }
          
          .dashboard-mobile-header {
            display: flex;
          }

          .sidebar-overlay {
            display: block;
          }

          .sidebar-modern {
            position: fixed;
            top: 0;
            left: 0;
            transform: translateX(-100%);
            z-index: 100;
          }
          
          .sidebar-modern.mobile-open {
            transform: translateX(0);
          }

          .dashboard-content-wrapper { padding: 24px 16px; }
        }
      `}</style>
    </div>
  );
}
