'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { MenuItem } from '@/types/menu';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMenuForm from '@/components/admin/AdminMenuForm';
import AdminMenuTable from '@/components/admin/AdminMenuTable';
import { Plus, Library, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Shared default fallback items
const defaultMenuDishes: MenuItem[] = [
  {
    id: 'mock-1',
    name: 'Special Halwa Puri',
    price: 220,
    category: 'Breakfast',
    description:
      'Served piping hot with traditional chana masala curry and melt-in-the-mouth suji halwa.',
    image_url: 'https://picsum.photos/seed/halwapuri/500/400',
    is_available: true,
  },
  {
    id: 'mock-2',
    name: 'Desi Ghee Paratha with Omelette',
    price: 280,
    category: 'Breakfast',
    description:
      'Crispy flaky paratha coated with high-purity Desi Ghee plus a local herb spiced double egg omelette.',
    image_url: 'https://picsum.photos/seed/desiparatha/500/400',
    is_available: true,
  },
  {
    id: 'mock-3',
    name: 'Grand Zinger Burger',
    price: 450,
    category: 'Fast Food',
    description:
      'Crispiest fried chicken breast, double-layered iceberg lettuce, and local secret sauce in sesame bun.',
    image_url: 'https://picsum.photos/seed/ringer/500/400',
    is_available: true,
  },
  {
    id: 'mock-4',
    name: 'Premium Chicken Handi',
    price: 950,
    category: 'Pakistani Food',
    description:
      'Traditional thick boneless cream curry cooked in clay pot vessels using fresh rural Pakistani spices.',
    image_url: 'https://picsum.photos/seed/chickenhandi/500/400',
    is_available: true,
  },
  {
    id: 'mock-5',
    name: 'Sizzling Seekh Kabab Platter',
    price: 850,
    category: 'BBQ',
    description:
      'Four thick mutton skewered kababs grilled over real coal beds, accompanied with cooling mint coriander raita.',
    image_url: 'https://picsum.photos/seed/beefkebabs/500/400',
    is_available: true,
  },
  {
    id: 'mock-6',
    name: 'Traditional Sweet Lassi',
    price: 180,
    category: 'Beverages',
    description:
      'Whipped sweetened rural yogurt beverage served in heavy earthen clay glasses for exquisite legacy touch.',
    image_url: 'https://picsum.photos/seed/sweetlassi/500/400',
    is_available: true,
  },
];

type MenuFormPayload = Omit<MenuItem, 'id' | 'created_at'> & {
  id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_featured?: boolean;
  sort_order?: number;
};

function cleanMenuPayload(dishData: MenuFormPayload) {
  // Important:
  // id, created_at, updated_at database ke auto/generated fields hain.
  // Insert/update ke waqt inko Supabase mein send nahi karna.
  const { id, created_at, updated_at, ...rest } = dishData as any;

  const priceNumber = Number(rest.price);

  const payload: Record<string, any> = {
    name: String(rest.name || '').trim(),
    price: Number.isFinite(priceNumber) ? priceNumber : 0,
    category: String(rest.category || 'Uncategorized').trim(),
    description: rest.description ? String(rest.description).trim() : null,
    image_url: rest.image_url ? String(rest.image_url).trim() : null,
    is_available:
      typeof rest.is_available === 'boolean' ? rest.is_available : true,
  };

  if ('is_featured' in rest) {
    payload.is_featured = Boolean(rest.is_featured);
  }

  if ('sort_order' in rest) {
    const sortOrderNumber = Number(rest.sort_order);
    payload.sort_order = Number.isFinite(sortOrderNumber) ? sortOrderNumber : 0;
  }

  return payload;
}

export default function AdminDashboardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback banners
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const router = useRouter();

  // Read dishes list
  const fetchDishes = async () => {
    setIsLoading(true);
    setErrorStatus(null);

    if (!isSupabaseConfigured || !supabase) {
      // Offline LocalStorage management
      const localMenu = localStorage.getItem('grand_emaar_custom_menu_items');

      if (localMenu) {
        try {
          setItems(JSON.parse(localMenu));
        } catch {
          setItems(defaultMenuDishes);
          localStorage.setItem(
            'grand_emaar_custom_menu_items',
            JSON.stringify(defaultMenuDishes)
          );
        }
      } else {
        // First initialization in Demo mode
        setItems(defaultMenuDishes);
        localStorage.setItem(
          'grand_emaar_custom_menu_items',
          JSON.stringify(defaultMenuDishes)
        );
      }

      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setItems(data || []);
    } catch (err: any) {
      console.error('Error fetching admin dishes:', err);
      setErrorStatus(err.message || 'Failed to read database menu catalog.');

      // Graceful fallback to default items
      setItems(defaultMenuDishes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Authorize session
    if (isSupabaseConfigured && supabase) {
      setIsDemoMode(false);

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          router.replace('/admin-login');
        } else {
          setAdminEmail(session.user.email || 'Admin Staff');
          fetchDishes();
        }
      });
    } else {
      // In Demo Mode, verify offline local token
      const offlineSession = localStorage.getItem('grand_emaar_demo_session');

      if (!offlineSession) {
        router.replace('/admin-login');
      } else {
        try {
          const parsed = JSON.parse(offlineSession);
          setAdminEmail(parsed.email || 'demo@grandemaar.com');
        } catch {
          setAdminEmail('demo@grandemaar.com');
        }

        setIsDemoMode(true);
        fetchDishes();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const showBanner = (msg: string, isError = false) => {
    if (isError) {
      setErrorStatus(msg);
      setSuccessMsg(null);
    } else {
      setSuccessMsg(msg);
      setErrorStatus(null);
    }

    // Auto clear feedback after 4 seconds
    setTimeout(() => {
      setSuccessMsg(null);
      setErrorStatus(null);
    }, 4500);
  };

  // Create or Update dish
  const handleFormSubmit = async (dishData: MenuFormPayload) => {
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorStatus(null);

    const dishId =
      typeof dishData.id === 'string' && dishData.id.trim().length > 0
        ? dishData.id.trim()
        : null;

    if (!dishData.name || !String(dishData.name).trim()) {
      showBanner('Dish name is required.', true);
      setIsSubmitting(false);
      return;
    }

    if (!dishData.category || !String(dishData.category).trim()) {
      showBanner('Dish category is required.', true);
      setIsSubmitting(false);
      return;
    }

    if (isDemoMode) {
      // Simulation state database updates
      const updatedList = [...items];

      if (dishId) {
        // Editing Mode
        const editIdx = updatedList.findIndex((item) => item.id === dishId);

        if (editIdx > -1) {
          updatedList[editIdx] = {
            ...updatedList[editIdx],
            ...dishData,
            id: dishId,
          } as MenuItem;

          showBanner(`Successfully edited dish "${dishData.name}"!`);
        }
      } else {
        // Adding Mode
        const newDish: MenuItem = {
          ...dishData,
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString(),
        } as MenuItem;

        updatedList.unshift(newDish);
        showBanner(`Successfully published fresh selection "${dishData.name}"!`);
      }

      // Sync both lists
      setItems(updatedList);
      localStorage.setItem(
        'grand_emaar_custom_menu_items',
        JSON.stringify(updatedList)
      );
      setIsFormOpen(false);
      setEditingItem(null);
      setIsSubmitting(false);
      return;
    }

    if (!supabase) {
      showBanner('Supabase client is not configured.', true);
      setIsSubmitting(false);
      return;
    }

    // Direct Supabase integration flow
    try {
      const cleanedPayload = cleanMenuPayload(dishData);

      if (dishId) {
        // UPDATE
        // id ko update payload mein send nahi karna.
        const { error } = await supabase
          .from('menu_items')
          .update(cleanedPayload)
          .eq('id', dishId);

        if (error) throw error;

        showBanner(`Successfully updated dish "${dishData.name}" in database!`);
      } else {
        // INSERT
        // id ko insert payload mein send nahi karna.
        // Supabase/Postgres gen_random_uuid() se id khud generate karega.
        const { error } = await supabase
          .from('menu_items')
          .insert([cleanedPayload]);

        if (error) throw error;

        showBanner(
          `Successfully added dish "${dishData.name}" to database table!`
        );
      }

      setIsFormOpen(false);
      setEditingItem(null);
      fetchDishes(); // Refresh data grid
    } catch (err: any) {
      console.error('Error adding/updating dish:', err);
      showBanner(err.message || 'Failed to save menu changes.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete dish from registry
  const handleDeleteDish = async (id: string | undefined, name: string) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      `Are you absolutely sure you want to delete the dish: "${name}"?`
    );

    if (!confirmDelete) return;

    if (isDemoMode) {
      const updatedList = items.filter((item) => item.id !== id);
      setItems(updatedList);
      localStorage.setItem(
        'grand_emaar_custom_menu_items',
        JSON.stringify(updatedList)
      );
      showBanner(`Deleted dish "${name}" from local memory.`);
      return;
    }

    if (!supabase) {
      showBanner('Supabase client is not configured.', true);
      return;
    }

    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);

      if (error) throw error;

      showBanner(`Successfully deleted dish "${name}" from Supabase.`);
      fetchDishes();
    } catch (err: any) {
      console.error('Error deleting dish:', err);
      showBanner(
        err.message || 'Failed to delete dish from database table.',
        true
      );
    }
  };

  // Open form for fresh addition
  const handleAddNewClick = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  // Open form for edition
  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Handle Log Out flow
  const handleLogout = async () => {
    const confirmation = window.confirm(
      'Are you sure you want to log out of the administration panel?'
    );

    if (!confirmation) return;

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

  return (
    <div className="flex h-screen bg-[#F9F6F0]/20 overflow-hidden font-sans">
      {/* Sidebar layouts */}
      <AdminSidebar
        onLogout={handleLogout}
        adminEmail={adminEmail}
        isDemoMode={isDemoMode}
      />

      {/* Main dashboard content side */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Header block status */}
          <AdminHeader items={items} />

          {/* Feedback panels */}
          <AnimatePresence mode="wait">
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs md:text-sm rounded-sm flex items-center gap-2.5 text-left"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {errorStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-100 border border-red-200 text-red-800 text-xs md:text-sm rounded-sm flex items-center gap-2.5 text-left"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{errorStatus}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core admin actions bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-neutral-800">
              <Library className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-lg font-bold">
                Active Dishes Database Table
              </h2>
            </div>

            {!isFormOpen && (
              <button
                onClick={handleAddNewClick}
                id="btn-add-new-dish"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C5A059] hover:bg-[#A98443] text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md rounded-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Add New Dish</span>
              </button>
            )}
          </div>

          {/* Dynamic layout split: Table vs Form */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {isFormOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminMenuForm
                    initialItem={editingItem}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setEditingItem(null);
                    }}
                    isSubmitting={isSubmitting}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* List products grid table */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-400 space-y-2">
                <div className="w-10 h-10 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
                <p className="text-xs uppercase font-mono tracking-widest font-bold">
                  Loading system products...
                </p>
              </div>
            ) : (
              <AdminMenuTable
                items={items}
                onEdit={handleEditClick}
                onDelete={handleDeleteDish}
              />
            )}
          </div>
        </div>

        {/* Admin Footer meta */}
        <div className="pt-12 border-t text-left flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono text-neutral-400">
          <p>&copy; Grand Emaar Hotel Nawabshah. Managerial Auth Space.</p>
          <div className="flex gap-4">
            <span className="text-[#C5A059]">Certified Two-Star Node</span>
            <span>|</span>
            <span className="text-neutral-500">Db Table: menu_items</span>
          </div>
        </div>
      </main>
    </div>
  );
}