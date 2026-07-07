'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { MenuItem } from '@/types/menu';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminDishesManager from '@/components/admin/AdminDishesManager';
import { MenuCategory } from '@/components/admin/AdminCategoriesManager';

export default function AdminDashboardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const [adminEmail, setAdminEmail] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);
  const [isAdminReady, setIsAdminReady] = useState(false);

  const router = useRouter();

  //  Fetch categories from Supabase so the dish form's dropdown is
  //  actually populated instead of always showing "No categories added yet"
  const fetchCategories = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setCategories([]);
      setIsCategoriesLoading(false);
      return;
    }

    setIsCategoriesLoading(true);

    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) {
      setCategories(data as MenuCategory[]);
    } else if (error) {
      console.error('Failed to fetch categories:', error);
    }

    setIsCategoriesLoading(false);
  };

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

  //  Load categories once the admin session check has completed
  useEffect(() => {
    fetchCategories();
  }, []);

  //  Keep categories in sync in realtime, so newly added/edited/deleted
  //  categories show up in the dish form dropdown without a manual refresh
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    const channel = supabase
      .channel('admin-categories-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_categories',
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, []);

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

      <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col justify-between">
        <div className="space-y-8">
          <AdminHeader items={items} />

          <AdminDishesManager
            isDemoMode={isDemoMode}
            categories={categories}
            onItemsChange={setItems}
          />
        </div>

        <div className="pt-12 border-t text-left flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono text-neutral-400">
          <p>&copy; Grand Emaar Hotel Nawabshah. Managerial Auth Space.</p>

          <div className="flex gap-4">
            <span className="text-[#C5A059]">Certified Two-Star Node</span>
            <span>|</span>
            <span className="text-neutral-500">
              Db Tables: menu_items / menu_categories
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
// import { MenuItem } from '@/types/menu';
// import AdminSidebar from '@/components/admin/AdminSidebar';
// import AdminHeader from '@/components/admin/AdminHeader';
// import AdminDishesManager from '@/components/admin/AdminDishesManager';
// import { MenuCategory } from '@/components/admin/AdminCategoriesManager';

// export default function AdminDashboardPage() {
//   const [items, setItems] = useState<MenuItem[]>([]);
//   const [categories] = useState<MenuCategory[]>([]);

//   const [adminEmail, setAdminEmail] = useState('');
//   const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);
//   const [isAdminReady, setIsAdminReady] = useState(false);

//   const router = useRouter();

//   useEffect(() => {
//     let isMounted = true;

//     const checkAdminSession = async () => {
//       if (isSupabaseConfigured && supabase) {
//         setIsDemoMode(false);

//         const {
//           data: { session },
//         } = await supabase.auth.getSession();

//         if (!isMounted) return;

//         if (!session) {
//           router.replace('/admin-login');
//           return;
//         }

//         setAdminEmail(session.user.email || 'Admin Staff');
//         setIsAdminReady(true);
//         return;
//       }

//       const offlineSession = localStorage.getItem('grand_emaar_demo_session');

//       if (!offlineSession) {
//         router.replace('/admin-login');
//         return;
//       }

//       try {
//         const parsed = JSON.parse(offlineSession);
//         setAdminEmail(parsed.email || 'demo@grandemaar.com');
//       } catch {
//         setAdminEmail('demo@grandemaar.com');
//       }

//       setIsDemoMode(true);
//       setIsAdminReady(true);
//     };

//     checkAdminSession();

//     return () => {
//       isMounted = false;
//     };
//   }, [router]);

//   const handleLogout = async () => {
//     if (isDemoMode) {
//       localStorage.removeItem('grand_emaar_demo_session');
//       router.replace('/admin-login');
//       return;
//     }

//     try {
//       await supabase!.auth.signOut();
//       router.replace('/admin-login');
//     } catch (err) {
//       console.error('Logout failed:', err);
//       router.replace('/admin-login');
//     }
//   };

//   if (!isAdminReady) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F9F6F0]/30">
//         <div className="flex flex-col items-center gap-3 text-neutral-500">
//           <div className="w-10 h-10 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />

//           <p className="text-xs uppercase font-mono tracking-widest font-bold">
//             Checking admin session...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-[#F9F6F0]/20 overflow-hidden font-sans">
//       <AdminSidebar
//         onLogout={handleLogout}
//         adminEmail={adminEmail}
//         isDemoMode={isDemoMode}
//       />

//       <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col justify-between">
//         <div className="space-y-8">
//           <AdminHeader items={items} />

//           <AdminDishesManager
//             isDemoMode={isDemoMode}
//             categories={categories}
//             onItemsChange={setItems}
//           />
//         </div>

//         <div className="pt-12 border-t text-left flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono text-neutral-400">
//           <p>&copy; Grand Emaar Hotel Nawabshah. Managerial Auth Space.</p>

//           <div className="flex gap-4">
//             <span className="text-[#C5A059]">Certified Two-Star Node</span>
//             <span>|</span>
//             <span className="text-neutral-500">
//               Db Tables: menu_items / menu_categories
//             </span>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }