'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { MenuItem } from '@/types/menu';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMenuForm from '@/components/admin/AdminMenuForm';
import AdminMenuTable from '@/components/admin/AdminMenuTable';
import { Plus, Library, CheckCircle2, AlertCircle, X } from 'lucide-react';
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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const router = useRouter();

  const closeFormModal = () => {
    if (isSubmitting) return;
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const fetchDishes = async () => {
    setIsLoading(true);
    setErrorStatus(null);

    if (!isSupabaseConfigured || !supabase) {
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

      if (error) throw error;

      setItems(data || []);
    } catch (err: any) {
      console.error('Error fetching admin dishes:', err);
      setErrorStatus(err.message || 'Failed to read database menu catalog.');
      setItems(defaultMenuDishes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  // Popup open hone par background page scroll lock
  useEffect(() => {
    if (isFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isFormOpen]);

  // ESC key se popup close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFormOpen && !isSubmitting) {
        closeFormModal();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isFormOpen, isSubmitting]);

  const showBanner = (msg: string, isError = false) => {
    if (isError) {
      setErrorStatus(msg);
      setSuccessMsg(null);
    } else {
      setSuccessMsg(msg);
      setErrorStatus(null);
    }

    setTimeout(() => {
      setSuccessMsg(null);
      setErrorStatus(null);
    }, 4500);
  };

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
      const updatedList = [...items];

      if (dishId) {
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
        const newDish: MenuItem = {
          ...dishData,
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString(),
        } as MenuItem;

        updatedList.unshift(newDish);
        showBanner(`Successfully published fresh selection "${dishData.name}"!`);
      }

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

    try {
      const cleanedPayload = cleanMenuPayload(dishData);

      if (dishId) {
        const { error } = await supabase
          .from('menu_items')
          .update(cleanedPayload)
          .eq('id', dishId);

        if (error) throw error;

        showBanner(`Successfully updated dish "${dishData.name}" in database!`);
      } else {
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
      fetchDishes();
    } catch (err: any) {
      console.error('Error adding/updating dish:', err);
      showBanner(err.message || 'Failed to save menu changes.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const handleAddNewClick = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

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
      <AdminSidebar
        onLogout={handleLogout}
        adminEmail={adminEmail}
        isDemoMode={isDemoMode}
      />

      <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col justify-between">
        <div className="space-y-8">
          <AdminHeader items={items} />

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

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-neutral-800">
              <Library className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-lg font-bold">
                Active Dishes Database Table
              </h2>
            </div>

            <button
              onClick={handleAddNewClick}
              id="btn-add-new-dish"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C5A059] hover:bg-[#A98443] text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md rounded-sm cursor-pointer"
              type="button"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="space-y-8">
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

        <div className="pt-12 border-t text-left flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono text-neutral-400">
          <p>&copy; Grand Emaar Hotel Nawabshah. Managerial Auth Space.</p>
          <div className="flex gap-4">
            <span className="text-[#C5A059]">Certified Two-Star Node</span>
            <span>|</span>
            <span className="text-neutral-500">Db Table: menu_items</span>
          </div>
        </div>
      </main>

      {/* Add/Edit Dish Popup Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dish-modal-title"
          >
            <button
              type="button"
              aria-label="Close popup overlay"
              className="absolute inset-0 w-full h-full cursor-default"
              onClick={closeFormModal}
              disabled={isSubmitting}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm bg-[#F9F6F0] shadow-2xl border border-[#C5A059]/30"
            >
              <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-5 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                    Grand Emaar Admin
                  </p>
                  <h3
                    id="dish-modal-title"
                    className="font-serif text-xl font-bold text-neutral-900"
                  >
                    {editingItem ? 'Edit Culinary Selection' : 'Add New Culinary Selection'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={isSubmitting}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-sm border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close dish popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 md:p-6">
                <AdminMenuForm
                  initialItem={editingItem}
                  onSubmit={handleFormSubmit}
                  onCancel={closeFormModal}
                  isSubmitting={isSubmitting}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}