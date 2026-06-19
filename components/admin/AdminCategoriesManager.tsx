'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MenuItem } from '@/types/menu';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import AdminCategoryForm, {
  CategoryFormPayload,
} from '@/components/admin/AdminCategoryForm';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORY_STORAGE_KEY = 'grand_emaar_menu_categories';
const MENU_STORAGE_KEY = 'grand_emaar_custom_menu_items';

export type MenuCategory = {
  id?: string;
  name: string;
  image_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type DeleteCategoryTarget = {
  id: string;
  name: string;
  dishCount: number;
};

type AdminCategoriesManagerProps = {
  isDemoMode: boolean;
  items: MenuItem[];
  onCategoriesChange?: (categories: MenuCategory[]) => void;
  onItemsChange?: React.Dispatch<React.SetStateAction<MenuItem[]>>;
};

function cleanCategoryPayload(categoryData: CategoryFormPayload) {
  return {
    name: String(categoryData.name || '').trim(),
    image_url: categoryData.image_url
      ? String(categoryData.image_url).trim()
      : null,
  };
}

export default function AdminCategoriesManager({
  isDemoMode,
  items,
  onCategoriesChange,
  onItemsChange,
}: AdminCategoriesManagerProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  );
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<DeleteCategoryTarget | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const getCategoryDishCount = (categoryName: string) => {
    return items.filter(
      (item) =>
        item.category?.trim().toLowerCase() ===
        categoryName.trim().toLowerCase()
    ).length;
  };

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return categories;

    return categories.filter((category) => {
      const dishCount = getCategoryDishCount(category.name);

      const searchableText = [category.name, dishCount, 'category']
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, searchQuery, items]);

  const updateCategoriesState = (nextCategories: MenuCategory[]) => {
    setCategories(nextCategories);
    onCategoriesChange?.(nextCategories);
  };

  const updateItemsCategoryNameLocally = (
    oldCategoryName: string,
    newCategoryName: string
  ) => {
    const updatedItems = items.map((item) => {
      if (
        item.category?.trim().toLowerCase() ===
        oldCategoryName.trim().toLowerCase()
      ) {
        return {
          ...item,
          category: newCategoryName,
        };
      }

      return item;
    });

    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(updatedItems));
    onItemsChange?.(updatedItems);
  };

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

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryFormOpen(true);
  };

  const openEditCategoryModal = (category: MenuCategory) => {
    setEditingCategory(category);
    setIsCategoryFormOpen(true);
  };

  const closeCategoryFormModal = () => {
    if (isCategorySubmitting) return;

    setIsCategoryFormOpen(false);
    setEditingCategory(null);
  };

  const closeDeleteCategoryModal = () => {
    if (isDeletingCategory) return;

    setDeleteTarget(null);
  };

  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    setErrorStatus(null);

    if (!isSupabaseConfigured || !supabase) {
      const localCategories = localStorage.getItem(CATEGORY_STORAGE_KEY);

      if (localCategories) {
        try {
          const parsedCategories = JSON.parse(localCategories);

          if (Array.isArray(parsedCategories)) {
            updateCategoriesState(parsedCategories);
          } else {
            updateCategoriesState([]);
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify([]));
          }
        } catch {
          updateCategoriesState([]);
          localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify([]));
        }
      } else {
        updateCategoriesState([]);
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

      updateCategoriesState(data || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      updateCategoriesState([]);
      setErrorStatus(
        err.message ||
          'Failed to read menu_categories table. Please create menu_categories table in Supabase.'
      );
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode]);

  useEffect(() => {
    if (isCategoryFormOpen || deleteTarget) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isCategoryFormOpen, deleteTarget]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (deleteTarget && !isDeletingCategory) {
        closeDeleteCategoryModal();
        return;
      }

      if (isCategoryFormOpen && !isCategorySubmitting) {
        closeCategoryFormModal();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [
    isCategoryFormOpen,
    isCategorySubmitting,
    deleteTarget,
    isDeletingCategory,
  ]);

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

    const editingCategoryId = editingCategory?.id || null;
    const oldCategoryName = editingCategory?.name || '';

    const alreadyExists = categories.some((category) => {
      const sameName =
        category.name.trim().toLowerCase() ===
        cleanedPayload.name.trim().toLowerCase();

      const sameCategory =
        editingCategoryId && category.id === editingCategoryId;

      return sameName && !sameCategory;
    });

    if (alreadyExists) {
      showBanner(`Category "${cleanedPayload.name}" already exists.`, true);
      setIsCategorySubmitting(false);
      return;
    }

    if (isDemoMode) {
      if (editingCategory) {
        const updatedCategories = categories.map((category) => {
          if (category.id === editingCategory.id) {
            return {
              ...category,
              name: cleanedPayload.name,
              image_url: cleanedPayload.image_url,
              updated_at: new Date().toISOString(),
            };
          }

          return category;
        });

        updateCategoriesState(updatedCategories);
        localStorage.setItem(
          CATEGORY_STORAGE_KEY,
          JSON.stringify(updatedCategories)
        );

        if (
          oldCategoryName &&
          oldCategoryName.trim().toLowerCase() !==
            cleanedPayload.name.trim().toLowerCase()
        ) {
          updateItemsCategoryNameLocally(oldCategoryName, cleanedPayload.name);
        }

        showBanner(`Successfully updated category "${cleanedPayload.name}"!`);
      } else {
        const newCategory: MenuCategory = {
          id: `local-category-${Date.now()}`,
          name: cleanedPayload.name,
          image_url: cleanedPayload.image_url,
          created_at: new Date().toISOString(),
        };

        const updatedCategories = [newCategory, ...categories];

        updateCategoriesState(updatedCategories);
        localStorage.setItem(
          CATEGORY_STORAGE_KEY,
          JSON.stringify(updatedCategories)
        );

        showBanner(`Successfully added category "${cleanedPayload.name}"!`);
      }

      setIsCategoryFormOpen(false);
      setEditingCategory(null);
      setIsCategorySubmitting(false);
      return;
    }

    if (!supabase) {
      showBanner('Supabase client is not configured.', true);
      setIsCategorySubmitting(false);
      return;
    }

    try {
      if (editingCategoryId) {
        const { error: categoryUpdateError } = await supabase
          .from('menu_categories')
          .update({
            ...cleanedPayload,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCategoryId);

        if (categoryUpdateError) throw categoryUpdateError;

        if (
          oldCategoryName &&
          oldCategoryName.trim().toLowerCase() !==
            cleanedPayload.name.trim().toLowerCase()
        ) {
          const { error: dishesUpdateError } = await supabase
            .from('menu_items')
            .update({
              category: cleanedPayload.name,
            })
            .eq('category', oldCategoryName);

          if (dishesUpdateError) throw dishesUpdateError;

          updateItemsCategoryNameLocally(oldCategoryName, cleanedPayload.name);
        }

        showBanner(
          `Successfully updated category "${cleanedPayload.name}" in database!`
        );
      } else {
        const { error } = await supabase
          .from('menu_categories')
          .insert([cleanedPayload]);

        if (error) throw error;

        showBanner(
          `Successfully added category "${cleanedPayload.name}" to database!`
        );
      }

      setIsCategoryFormOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      console.error('Error saving category:', err);
      showBanner(err.message || 'Failed to save category.', true);
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = (category: MenuCategory) => {
    if (!category.id) {
      showBanner('Category ID is missing. Cannot delete this category.', true);
      return;
    }

    const dishCount = getCategoryDishCount(category.name);

    setDeleteTarget({
      id: category.id,
      name: category.name,
      dishCount,
    });
  };

  const confirmDeleteCategory = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.dishCount > 0) {
      showBanner(
        `Cannot delete "${deleteTarget.name}" because ${deleteTarget.dishCount} dishes are assigned to it. First move or delete those dishes.`,
        true
      );
      setDeleteTarget(null);
      return;
    }

    setIsDeletingCategory(true);
    setSuccessMsg(null);
    setErrorStatus(null);

    if (isDemoMode) {
      const updatedCategories = categories.filter(
        (category) => category.id !== deleteTarget.id
      );

      updateCategoriesState(updatedCategories);
      localStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(updatedCategories)
      );

      showBanner(`Deleted category "${deleteTarget.name}" from local memory.`);
      setDeleteTarget(null);
      setIsDeletingCategory(false);
      return;
    }

    if (!supabase) {
      showBanner('Supabase client is not configured.', true);
      setIsDeletingCategory(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) throw error;

      showBanner(`Successfully deleted category "${deleteTarget.name}".`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      showBanner(err.message || 'Failed to delete category.', true);
    } finally {
      setIsDeletingCategory(false);
    }
  };

  return (
    <section className="space-y-4">
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

      <div className="rounded-sm border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-100 px-4 py-4">
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

          <button
            onClick={openAddCategoryModal}
            id="btn-add-new-category"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#C5A059] hover:bg-[#A98443] text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md rounded-sm cursor-pointer"
            type="button"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-neutral-100 bg-neutral-50/50 px-4 py-3">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search category by name..."
              className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-sm text-sm text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/15 transition-all"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 transition-colors"
                aria-label="Clear category search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-neutral-500">
            Showing{' '}
            <span className="font-bold text-neutral-900">
              {filteredCategories.length}
            </span>{' '}
            of{' '}
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
          ) : filteredCategories.length === 0 ? (
            <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-6 text-center">
              <p className="text-sm text-amber-700">
                No category found for{' '}
                <span className="font-semibold">"{searchQuery}"</span>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {filteredCategories.map((category) => {
                const dishCount = getCategoryDishCount(category.name);

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

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditCategoryModal(category)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-700 transition-colors hover:border-[#C5A059] hover:bg-[#F9F6F0] hover:text-[#A98443]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category)}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-red-100 bg-red-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>

                      {dishCount > 0 && (
                        <p className="mt-2 text-[10px] text-neutral-400">
                          Delete is blocked until dishes are moved from this
                          category.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
                    {editingCategory
                      ? 'Edit Menu Category'
                      : 'Add New Menu Category'}
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
                  initialCategory={editingCategory}
                  onSubmit={handleCategorySubmit}
                  onCancel={closeCategoryFormModal}
                  isSubmitting={isCategorySubmitting}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-modal-title"
          >
            <button
              type="button"
              aria-label="Close delete category popup overlay"
              className="absolute inset-0 w-full h-full cursor-default"
              onClick={closeDeleteCategoryModal}
              disabled={isDeletingCategory}
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
                      id="delete-category-modal-title"
                      className="font-serif text-xl font-bold text-neutral-900"
                    >
                      Delete Category?
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDeleteCategoryModal}
                  disabled={isDeletingCategory}
                  className="w-9 h-9 inline-flex items-center justify-center rounded-sm border border-neutral-200 text-neutral-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close delete category popup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 py-5 space-y-4">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Are you sure you want to delete this category?
                </p>

                <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Selected Category
                  </p>

                  <p className="mt-1 font-semibold text-neutral-900">
                    {deleteTarget.name}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {deleteTarget.dishCount} dishes assigned
                  </p>
                </div>

                {deleteTarget.dishCount > 0 && (
                  <div className="rounded-sm border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                    This category cannot be deleted until assigned dishes are
                    moved to another category.
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-neutral-100 bg-neutral-50 px-5 py-4">
                <button
                  type="button"
                  onClick={closeDeleteCategoryModal}
                  disabled={isDeletingCategory}
                  className="px-4 py-2 border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteCategory}
                  disabled={isDeletingCategory || deleteTarget.dishCount > 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeletingCategory ? 'Deleting...' : 'Yes, Delete Category'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}