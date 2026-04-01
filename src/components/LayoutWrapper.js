'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { FullFooter } from '@/components/Footer';

const DASHBOARD_PREFIXES = ['/admin', '/portal', '/billing/dashboard', '/patients', '/payments', '/claims', '/auth'];

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_PREFIXES.some(prefix => pathname.startsWith(prefix));

  return (
    <>
      {!isDashboard && <Navbar />}
      <main>{children}</main>
      {!isDashboard && <FullFooter />}
    </>
  );
}
