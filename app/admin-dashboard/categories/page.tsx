'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { MenuItem } from '@/types/menu';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminCategoriesManager, {
  MenuCategory,
} from '@/components/admin/AdminCategoriesManager';

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [, setCategories] = useState<MenuCategory[]>([]);

  const [adminEmail, setAdminEmail] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);
  const [isAdminReady, setIsAdminReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkAdminSession = async () => {
      if (isSupabaseConfigured && supabase) {
        setIsDemoMode(false);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session) {
          router.replace('/admin-login');
          return;
        }

        setAdminEmail(session.user.email || 'Admin Staff');
        setIsAdminReady(true);
        return;
      }

      const offlineSession = localStorage.getItem('grand_emaar_demo_session');

      if (!offlineSession) {
        router.replace('/admin-login');
        return;
      }

      try {
        const parsed = JSON.parse(offlineSession);
        setAdminEmail(parsed.email || 'demo@grandemaar.com');
      } catch {
        setAdminEmail('demo@grandemaar.com');
      }

      setIsDemoMode(true);
      setIsAdminReady(true);
    };

    checkAdminSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    if (isDemoMode) {
      localStorage.removeItem('grand_emaar_demo_session');
      router.replace('/admin-login');
      return;
    }

    try {
      await supabase!.auth.signOut();
      router.replace('/admin-login');
    } catch (err) {
      console.error('Logout failed:', err);
      router.replace('/admin-login');
    }
  };

  if (!isAdminReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]/30">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <div className="w-10 h-10 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />

          <p className="text-xs uppercase font-mono tracking-widest font-bold">
            Checking admin session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F9F6F0]/20 overflow-hidden font-sans">
      <AdminSidebar
        onLogout={handleLogout}
        adminEmail={adminEmail}
        isDemoMode={isDemoMode}
      />

      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="space-y-8">
          <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
              Menu Categories
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold text-neutral-900">
              Manage Categories
            </h1>

            <p className="mt-2 text-sm text-neutral-500 max-w-2xl">
              Manage your restaurant menu categories with ease. Add, edit, or remove categories
            </p>
          </div>

          <AdminCategoriesManager
            isDemoMode={isDemoMode}
            items={items}
            onCategoriesChange={setCategories}
            onItemsChange={setItems}
          />
        </div>
      </main>
    </div>
  );
}