'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/common/SectionTitle';
import CategoryFilter from '@/components/menu/CategoryFilter';
import MenuGrid from '@/components/menu/MenuGrid';
import { MenuItem } from '@/types/menu';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Search, UtensilsCrossed, X } from 'lucide-react';
import WhatsAppButton from '@/components/common/WhatsAppButton';

// Mock/Default fallback dishes so the app has content even if Supabase is not connected
const fallbackMenuItems: MenuItem[] = [
  {
    name: 'Special Halwa Puri',
    price: 220,
    category: 'Breakfast',
    description:
      'Served piping hot with traditional chana masala curry and melt-in-the-mouth suji halwa.',
    image_url: 'https://picsum.photos/seed/halwapuri/500/400',
    is_available: true,
  },
  {
    name: 'Desi Ghee Paratha with Omelette',
    price: 280,
    category: 'Breakfast',
    description:
      'Crispy flaky paratha coated with high-purity Desi Ghee plus a local herb spiced double egg omelette.',
    image_url: 'https://picsum.photos/seed/desiparatha/500/400',
    is_available: true,
  },
  {
    name: 'Grand Zinger Burger',
    price: 450,
    category: 'Fast Food',
    description:
      'Crispiest fried chicken breast, double-layered iceberg lettuce, and local secret sauce in sesame bun.',
    image_url: 'https://picsum.photos/seed/zinger/500/400',
    is_available: true,
  },
  {
    name: 'Spicy Club Sandwich',
    price: 420,
    category: 'Fast Food',
    description:
      'Triple layered golden toasted bread, pulled chicken breasts, fried egg slice, and dynamic cheddar melting.',
    image_url: 'https://picsum.photos/seed/sandwich/500/400',
    is_available: true,
  },
  {
    name: 'Premium Chicken Handi',
    price: 950,
    category: 'Pakistani Food',
    description:
      'Traditional thick boneless cream curry cooked in clay pot vessels using fresh rural Pakistani spices.',
    image_url: 'https://picsum.photos/seed/chickenhandi/500/400',
    is_available: true,
  },
  {
    name: 'Executive Mutton Karahi',
    price: 1600,
    category: 'Pakistani Food',
    description:
      'Fresh mutton meat stew cooked in high flame with organic tomatoes, ginger cubes, and green bird-eye chilies.',
    image_url: 'https://picsum.photos/seed/muttonkarahi/500/400',
    is_available: true,
  },
  {
    name: 'Sizzling Seekh Kabab Platter',
    price: 850,
    category: 'BBQ',
    description:
      'Four thick mutton skewered kababs grilled over real coal beds, accompanied with cooling mint coriander raita.',
    image_url: 'https://picsum.photos/seed/beefkebabs/500/400',
    is_available: true,
  },
  {
    name: 'Kasturi Malai Boti',
    price: 820,
    category: 'BBQ',
    description:
      'Eight pieces of ultra tender boneless breast cubes seasoned with real dairy cream, cardamoms, and black pepper.',
    image_url: 'https://picsum.photos/seed/malaiboti/500/400',
    is_available: true,
  },
  {
    name: 'Chicken Shashlik with Rice',
    price: 780,
    category: 'Chinese',
    description:
      'Tangy red sweet & sour glaze with seasoned bell-peppers, onions, skewered chicken and premium egg fried rice.',
    image_url: 'https://picsum.photos/seed/shashlik/500/400',
    is_available: true,
  },
  {
    name: 'Dynamite Manchurian',
    price: 720,
    category: 'Chinese',
    description:
      'Wok-stir-fried crispy chicken bites cooked in spicy fresh garlic-ginger manchurian sauce.',
    image_url: 'https://picsum.photos/seed/manchurian/500/400',
    is_available: true,
  },
  {
    name: 'Traditional Sweet Lassi',
    price: 180,
    category: 'Beverages',
    description:
      'Whipped sweetened rural yogurt beverage served in heavy earthen clay glasses for exquisite legacy touch.',
    image_url: 'https://picsum.photos/seed/sweetlassi/500/400',
    is_available: true,
  },
  {
    name: 'Mint Margarita Cooler',
    price: 250,
    category: 'Beverages',
    description:
      'Pureed fresh local mint leaves, fresh lime zest, sparkling tonic water, and crushed cooling ice cubes.',
    image_url: 'https://picsum.photos/seed/mintmargarita/500/400',
    is_available: true,
  },
  {
    name: 'Special Royal Shahi Kheer',
    price: 190,
    category: 'Desserts',
    description:
      'Slow-simmered rich saffron condensed rice pudding loaded with pistachios, silver leaf overlays, and almonds.',
    image_url: 'https://picsum.photos/seed/kheer/500/400',
    is_available: true,
  },
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [usingFallbacks, setUsingFallbacks] = useState<boolean>(false);

  const categories = [
    'All',
    'Beverages',
    'Desserts',
    'Baar',
    'Coffee',
    'Breakfast',
    'Hot and Cold',
    'Fresh Juice and Shake',
    'Starter',
    'BBQ',
    'BBQ Fish',
    'BBQ Roll',
    'BBQ Platter',
    'Fast Food',
    'Sandwich',
    'Fries',
    'Biryani',
    'Soup',
    'Chinese Thai Gravies',
    'Noodles',
    'Rice',
    'Handi',
    'Karahi',
    'Tandori',
    'Salad',
    'Stakes',
    'Continental',
    'Pasta',
    'Sea Food',
    'Pizza Special',
    'Roll',
  ];

  useEffect(() => {
    async function fetchMenu() {
      setIsLoading(true);

      if (!isSupabaseConfigured) {
        console.log('Using fallback offline menu options.');

        const customLocalItems = localStorage.getItem(
          'grand_emaar_custom_menu_items'
        );

        if (customLocalItems) {
          try {
            setItems(JSON.parse(customLocalItems));
          } catch {
            setItems(fallbackMenuItems);
            localStorage.setItem(
              'grand_emaar_custom_menu_items',
              JSON.stringify(fallbackMenuItems)
            );
          }
        } else {
          setItems(fallbackMenuItems);
          localStorage.setItem(
            'grand_emaar_custom_menu_items',
            JSON.stringify(fallbackMenuItems)
          );
        }

        setUsingFallbacks(true);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase!
          .from('menu_items')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setItems(data);
          setUsingFallbacks(false);
        } else {
          console.log('Database returned empty menu_items list, using defaults.');
          setItems(fallbackMenuItems);
          setUsingFallbacks(true);
        }
      } catch (err: any) {
        console.error('Error fetching Supabase products:', err);
        setItems(fallbackMenuItems);
        setUsingFallbacks(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMenu();
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
      <div>
        <Navbar />

        {/* Menu Hero banner element */}
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

        {/* Core dynamic list */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {usingFallbacks && (
            <div className="mb-6 max-w-md mx-auto text-center px-4 py-2 bg-neutral-900 border border-[#C5A059]/35 rounded-sm">
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                Preview Mode Standard Menu Active
              </p>
            </div>
          )}

          <SectionTitle
            title="Savor Our Delicacies"
            subtitle="Carefully Cultivated Flavours"
          />

          {/* Search Bar */}
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

          {/* Category Tabs */}
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

          {/* Grid display items */}
          <MenuGrid items={filteredItems} isLoading={isLoading} />

          {/* Prompt banner bottom with WhatsApp CTA */}
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