'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';


export default function AdminDashboardEntryPage() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkAdminSessionAndRedirect = async () => {
      if (isSupabaseConfigured && supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session) {
          router.replace('/admin-login');
          return;
        }

        router.replace('/admin-dashboard/orders');
        return;
      }

      // Offline/demo mode session check
      const offlineSession = localStorage.getItem('grand_emaar_demo_session');

      if (!offlineSession) {
        router.replace('/admin-login');
        return;
      }

      router.replace('/admin-dashboard/orders');
    };

    checkAdminSessionAndRedirect();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]/30">
      <div className="flex flex-col items-center gap-3 text-neutral-500">
        <div className="w-10 h-10 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />

        <p className="text-xs uppercase font-mono tracking-widest font-bold">
          Redirecting to Orders...
        </p>
      </div>
    </div>
  );
}