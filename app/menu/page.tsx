'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/common/SectionTitle';
import CategoryFilter from '@/components/menu/CategoryFilter';
import MenuGrid from '@/components/menu/MenuGrid';
import WelcomePopup from '@/components/common/WelcomePopup';
import { MenuItem } from '@/types/menu';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Search, UtensilsCrossed, X } from 'lucide-react';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMenuAndCategories() {
      setIsLoading(true);

      if (!isSupabaseConfigured || !supabase) {
        setItems([]);
        setCategories(['All']);
        setIsLoading(false);
        return;
      }

      try {
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true)
          .order('sort_order', { ascending: true })
          .order('name', { ascending: true });

        if (menuError) {
          throw menuError;
        }

        const fetchedItems = (menuData || []) as MenuItem[];
        setItems(fetchedItems);

        const uniqueCategories = Array.from(
          new Set(
            fetchedItems
              .map((item) => item.category)
              .filter(Boolean)
          )
        );

        setCategories(['All', ...uniqueCategories]);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setItems([]);
        setCategories(['All']);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMenuAndCategories();
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const categoryFiltered =
      activeCategory === 'All'
        ? items
        : items.filter((item) => item.category === activeCategory);

    if (!query) {
      return categoryFiltered;
    }

    return categoryFiltered.filter((item) => {
      const searchableText = [
        item.name,
        item.category,
        item.description,
        item.price,
        item.is_available ? 'available' : 'not available soldout',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [items, activeCategory, searchQuery]);

  const askMenuMessage =
    'Hello Grand Emaar Hotel, I want to know about your menu.';

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <WelcomePopup duration={3000} logoSrc="/logo/logo.png" />

      <div>
        <Navbar />

        <section className="bg-neutral-950 text-white py-16 border-b border-[#C5A059]/15 relative">
          <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(#C5A059_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-3">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Culinary Symphony Menu
            </h1>

            <p className="text-sm md:text-base text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
              Serving highly hygienic Traditional, Fast, Continental and Sweets
              varieties in Nawabshah. Prepared by elite certified chefs.
            </p>
          </div>
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Savor Our Delicacies"
            subtitle="Carefully Cultivated Flavours"
          />

          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative bg-white border border-neutral-200 rounded-sm shadow-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search your favorite dish, category, price..."
                className="w-full pl-11 pr-11 py-3.5 text-sm text-neutral-800 bg-transparent outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-[#C5A059]/15 rounded-sm"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest font-mono text-neutral-400">
              <span>
                Showing{' '}
                <span className="text-neutral-900 font-bold">
                  {filteredItems.length}
                </span>{' '}
                of{' '}
                <span className="text-neutral-900 font-bold">
                  {items.length}
                </span>{' '}
                dishes
              </span>
            </div>
          </div>

          <div className="mb-12">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>

          {searchQuery.trim() && filteredItems.length === 0 && !isLoading && (
            <div className="mb-10 max-w-xl mx-auto text-center px-5 py-5 bg-amber-50 border border-amber-200 rounded-sm">
              <p className="text-sm text-amber-700">
                No dish found for{' '}
                <span className="font-semibold">"{searchQuery}"</span>. Try
                another dish name, category or price.
              </p>
            </div>
          )}

          <MenuGrid items={filteredItems} isLoading={isLoading} />

          {!isLoading && items.length === 0 && (
            <div className="mt-10 max-w-xl mx-auto text-center px-5 py-6 bg-neutral-50 border border-neutral-200 rounded-sm">
              <p className="text-sm text-neutral-600">
                No menu items found. Please add dishes from admin dashboard.
              </p>
            </div>
          )}

          <div className="mt-16 bg-neutral-950/5 border border-neutral-200/80 p-8 text-center rounded-sm space-y-6 max-w-2xl mx-auto select-none">
            <UtensilsCrossed className="w-8 h-8 text-[#C5A059] mx-auto" />

            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Custom Meal Queries or Catering Events?
              </h3>

              <p className="text-sm text-neutral-500 font-light leading-relaxed max-w-md mx-auto">
                Need extra spice customization, allergy exclusions, custom family
                combos, or outdoor home catering in Nawabshah? Click below to ask
                our service managers in a direct chat.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppLink(askMenuMessage)}
                target="_blank"
                rel="noopener noreferrer"
                id="menu-ask-menu-cta"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-[#A98443] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-md"
              >
                ASK ABOUT MENU ON WHATSAPP
              </a>
            </div>
          </div>
        </section>
      </div>

      <WhatsAppButton
        variant="floating"
        message="Hello Grand Emaar Hotel Nawabshah, I want to know about your menu."
      />

      <Footer />
    </div>
  );
}