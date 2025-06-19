'use client';

import { LandingPage } from '@/components/LandingPage';
import { Dashboard } from '@/components/Dashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  const user = session?.user;
  if (!user) {
    return <LandingPage />;
  }

  if (user.role == 'admin') {
    return <AdminDashboard />;
  }

  return <Dashboard />;
}

