'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { MenuItem } from '@/types/menu';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminMenuForm from '@/components/admin/AdminMenuForm';
import AdminMenuTable from '@/components/admin/AdminMenuTable';
import AdminCategoryForm, {
  CategoryFormPayload,
} from '@/components/admin/AdminCategoryForm';
import {
  Plus,
  Library,
  CheckCircle2,
  AlertCircle,
  X,
  AlertTriangle,
  Trash2,
  Search,
  Tags,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MENU_STORAGE_KEY = 'grand_emaar_custom_menu_items';
const CATEGORY_STORAGE_KEY = 'grand_emaar_menu_categories';

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
    is_popular: false,
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
    is_popular: false,
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
    is_popular: true,
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
    is_popular: false,
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
    is_popular: false,
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
    is_popular: false,
  },
];

type MenuFormPayload = Omit<MenuItem, 'id' | 'created_at'> & {
  id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  is_featured?: boolean;
  is_popular?: boolean;
  sort_order?: number;
};

type MenuCategory = {
  id?: string;
  name: string;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type DeleteTarget = {
  id: string;
  name: string;
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
    is_popular: typeof rest.is_popular === 'boolean' ? rest.is_popular : false,
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

function cleanCategoryPayload(categoryData: CategoryFormPayload) {
  return {
    name: String(categoryData.name || '').trim(),
    image_url: categoryData.image_url
      ? String(categoryData.image_url).trim()
      : null,
  };
}

export default function AdminDashboardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);

  const [adminEmail, setAdminEmail] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const router = useRouter();

  const categoryOptions = useMemo(() => {
    return categories
      .map((category) => category.name)
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index);
  }, [categories]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) => {
      const searchableText = [
        item.name,
        item.category,
        item.description,
        item.price,
        item.is_available ? 'available' : 'soldout',
        item.is_popular ? 'popular' : 'not popular',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [items, searchQuery]);

  const closeFormModal = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setEditingItem(null);
  };

  const closeCategoryFormModal = () => {
    if (isCategorySubmitting) return;

    setIsCategoryFormOpen(false);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeleteTarget(null);
  };

  const fetchCategories = async () => {
    setIsCategoriesLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      const localCategories = localStorage.getItem(CATEGORY_STORAGE_KEY);

      if (localCategories) {
        try {
          const parsedCategories = JSON.parse(localCategories);

          if (Array.isArray(parsedCategories)) {
            setCategories(parsedCategories);
          } else {
            setCategories([]);
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify([]));
          }
        } catch {
          setCategories([]);
          localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify([]));
        }
      } else {
        setCategories([]);
        localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify([]));
      }

      setIsCategoriesLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCategories(data || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setErrorStatus(
        err.message ||
          'Failed to read menu_categories table. Please create menu_categories table in Supabase.'
      );
      setCategories([]);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const fetchDishes = async () => {
    setIsLoading(true);
    setErrorStatus(null);

    if (!isSupabaseConfigured || !supabase) {
      const localMenu = localStorage.getItem(MENU_STORAGE_KEY);

      if (localMenu) {
        try {
          setItems(JSON.parse(localMenu));
        } catch {
          setItems(defaultMenuDishes);
          localStorage.setItem(
            MENU_STORAGE_KEY,
            JSON.stringify(defaultMenuDishes)
          );
        }
      } else {
        setItems(defaultMenuDishes);
        localStorage.setItem(
          MENU_STORAGE_KEY,
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
          fetchCategories();
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
        fetchCategories();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Popup open hone par background page scroll lock
  useEffect(() => {
    if (isFormOpen || isCategoryFormOpen || deleteTarget) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isFormOpen, isCategoryFormOpen, deleteTarget]);

  // ESC key se popup close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (deleteTarget && !isDeleting) {
        closeDeleteModal();
        return;
      }

      if (isCategoryFormOpen && !isCategorySubmitting) {
        closeCategoryFormModal();
        return;
      }

      if (isFormOpen && !isSubmitting) {
        closeFormModal();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [
    isFormOpen,
    isSubmitting,
    isCategoryFormOpen,
    isCategorySubmitting,
    deleteTarget,
    isDeleting,
  ]);

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

  const handleCategorySubmit = async (categoryData: CategoryFormPayload) => {
    setIsCategorySubmitting(true);
    setSuccessMsg(null);
    setErrorStatus(null);

    const cleanedPayload = cleanCategoryPayload(categoryData);

    if (!cleanedPayload.name) {
      showBanner('Category name is required.', true);
      setIsCategorySubmitting(false);
      return;
    }

    const alreadyExists = categories.some(
      (category) =>
        category.name.trim().toLowerCase() ===
        cleanedPayload.name.trim().toLowerCase()
    );

    if (alreadyExists) {
      showBanner(`Category "${cleanedPayload.name}" already exists.`, true);
      setIsCategorySubmitting(false);
      return;
    }

    if (isDemoMode) {
      const newCategory: MenuCategory = {
        id: `local-category-${Date.now()}`,
        name: cleanedPayload.name,
        image_url: cleanedPayload.image_url,
        created_at: new Date().toISOString(),
      };

      const updatedCategories = [newCategory, ...categories];

      setCategories(updatedCategories);
      localStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(updatedCategories)
      );

      showBanner(`Successfully added category "${cleanedPayload.name}"!`);
      setIsCategoryFormOpen(false);
      setIsCategorySubmitting(false);
      return;
    }

    if (!supabase) {
      showBanner('Supabase client is not configured.', true);
      setIsCategorySubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_categories')
        .insert([cleanedPayload]);

      if (error) throw error;

      showBanner(
        `Successfully added category "${cleanedPayload.name}" to database!`
      );

      setIsCategoryFormOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error('Error adding category:', err);
      showBanner(err.message || 'Failed to save category.', true);
    } finally {
      setIsCategorySubmitting(false);
    }
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
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedList));

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

  // Ye function direct delete nahi karega.
  // Ye sirf confirmation popup open karega.
  const handleDeleteDish = (id: string | undefined, name: string) => {
    if (!id) {
      showBanner('Dish ID is missing. Cannot delete this item.', true);
      return;
    }

    setDeleteTarget({
      id,
      name,
    });
  };

  // Actual delete sirf popup ke confirm button se hoga.
  const confirmDeleteDish = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setSuccessMsg(null);
    setErrorStatus(null);

    const { id, name } = deleteTarget;

    if (isDemoMode) {
      const updatedList = items.filter((item) => item.id !== id);

      setItems(updatedList);
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedList));

      showBanner(`Deleted dish "${name}" from local memory.`);
      setDeleteTarget(null);
      setIsDeleting(false);
      return;
    }

    if (!supabase) {
      showBanner('Supabase client is not configured.', true);
      setIsDeleting(false);
      return;
    }

    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);

      if (error) throw error;

      showBanner(`Successfully deleted dish "${name}" from Supabase.`);
      setDeleteTarget(null);
      fetchDishes();
    } catch (err: any) {
      console.error('Error deleting dish:', err);
      showBanner(
        err.message || 'Failed to delete dish from database table.',
        true
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleAddCategoryClick = () => {
    setIsCategoryFormOpen(true);
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

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

          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-2 text-neutral-800">
                <Library className="w-5 h-5 text-[#C5A059]" />
                <h2 className="font-serif text-lg font-bold">
                  Restaurant Menu Management
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddCategoryClick}
                  id="btn-add-new-category"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#C5A059] hover:bg-[#A98443] text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md rounded-sm cursor-pointer"
                  type="button"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Add Category</span>
                </button>

                <button
                  onClick={handleAddNewClick}
                  id="btn-add-new-dish"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#C5A059] hover:bg-[#A98443] text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md rounded-sm cursor-pointer"
                  type="button"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Dynamic Categories Section */}
            <div className="rounded-sm border border-neutral-200 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-100 px-4 py-4">
                <div className="flex items-center gap-2 text-neutral-800">
                  <Tags className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <h3 className="font-serif text-lg font-bold">
                      Active Categories
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Categories created here will show in Add Dish form.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-neutral-500">
                  Total{' '}
                  <span className="font-bold text-neutral-900">
                    {categories.length}
                  </span>{' '}
                  categories
                </div>
              </div>

              <div className="p-4">
                {isCategoriesLoading ? (
                  <div className="flex items-center justify-center py-10 text-neutral-400">
                    <div className="w-8 h-8 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />
                  </div>
                ) : categories.length === 0 ? (
                  <div className="rounded-sm border border-dashed border-[#C5A059]/40 bg-[#F9F6F0]/60 px-4 py-8 text-center">
                    <Tags className="w-8 h-8 text-[#C5A059] mx-auto mb-3" />
                    <h4 className="font-serif text-lg font-bold text-neutral-900">
                      No Category Added Yet
                    </h4>
                    <p className="mt-1 text-sm text-neutral-500">
                      Click Add Category and create your first menu category.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {categories.map((category) => {
                      const dishCount = items.filter(
                        (item) =>
                          item.category?.trim().toLowerCase() ===
                          category.name.trim().toLowerCase()
                      ).length;

                      return (
                        <div
                          key={category.id || category.name}
                          className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
                            {category.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-[#F9F6F0]">
                                <ImageIcon className="w-8 h-8 text-[#C5A059]" />
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <p className="text-[10px] uppercase tracking-[0.22em] text-[#C5A059] font-bold">
                              Category
                            </p>
                            <h4 className="mt-1 font-serif text-lg font-bold text-neutral-900">
                              {category.name}
                            </h4>
                            <p className="mt-2 text-xs text-neutral-500">
                              {dishCount} dishes assigned
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-neutral-200 rounded-sm shadow-sm px-4 py-3">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search dish by name, category, description, price or popular..."
                  className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-sm text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15 transition-all"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="text-xs font-mono text-neutral-500">
                Showing{' '}
                <span className="font-bold text-neutral-900">
                  {filteredItems.length}
                </span>{' '}
                of{' '}
                <span className="font-bold text-neutral-900">
                  {items.length}
                </span>{' '}
                dishes
              </div>
            </div>

            {searchQuery.trim() && filteredItems.length === 0 && (
              <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                No dish found for{' '}
                <span className="font-semibold">"{searchQuery}"</span>. Try
                searching another name, category or price.
              </div>
            )}
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
                items={filteredItems}
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
            <span className="text-neutral-500">
              Db Tables: menu_items / menu_categories
            </span>
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
                    {editingItem
                      ? 'Edit Culinary Selection'
                      : 'Add New Culinary Selection'}
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
                  // categoryOptions={categoryOptions}
                  categoryOptions={categories}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Category Popup Modal */}
      <AnimatePresence>
        {isCategoryFormOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
          >
            <button
              type="button"
              aria-label="Close category popup overlay"
              className="absolute inset-0 w-full h-full cursor-default"
              onClick={closeCategoryFormModal}
              disabled={isCategorySubmitting}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-sm bg-[#F9F6F0] shadow-2xl border border-[#C5A059]/30"
            >
              <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-5 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-bold">
                    Grand Emaar Admin
                  </p>
                  <h3
                    id="category-modal-title"
                    className="font-serif text-xl font-bold text-neutral-900"
                  >
                    Add New Menu Category
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeCategoryFormModal}
                  disabled={isCategorySubmitting}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-sm border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close category popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 md:p-6">
                <AdminCategoryForm
                  onSubmit={handleCategorySubmit}
                  onCancel={closeCategoryFormModal}
                  isSubmitting={isCategorySubmitting}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dish-modal-title"
          >
            <button
              type="button"
              aria-label="Close delete popup overlay"
              className="absolute inset-0 w-full h-full cursor-default"
              onClick={closeDeleteModal}
              disabled={isDeleting}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 18 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-md rounded-sm bg-white shadow-2xl border border-red-100 overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-red-500 font-bold">
                      Delete Confirmation
                    </p>
                    <h3
                      id="delete-dish-modal-title"
                      className="font-serif text-xl font-bold text-neutral-900"
                    >
                      Delete Dish?
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-sm border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close delete popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 py-5 space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Are you sure you want to delete this dish? This action cannot
                  be undone.
                </p>

                <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Selected Dish
                  </p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {deleteTarget.name}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-neutral-100 bg-neutral-50 px-5 py-4">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteDish}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Dish'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}