'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/common/SectionTitle';
import CategoryFilter from '@/components/menu/CategoryFilter';
import MenuGrid from '@/components/menu/MenuGrid';
import WelcomePopup from '@/components/common/WelcomePopup';
import OrderSuccessPopup from '@/components/common/Ordersuccessfullpopup';
import { MenuItem } from '@/types/menu';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { getWhatsAppLink } from '@/lib/whatsapp';
import {
  Search,
  UtensilsCrossed,
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
} from 'lucide-react';
import WhatsAppButton from '@/components/common/WhatsAppButton';

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('grand_emaar_cart');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('grand_emaar_cart', JSON.stringify(cartItems));
  }, [cartItems]);

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
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true)
          .order('sort_order', { ascending: true })
          .order('name', { ascending: true });

        if (error) throw error;

        const fetchedItems = (data || []) as MenuItem[];
        setItems(fetchedItems);

        const uniqueCategories = Array.from(
          new Set(fetchedItems.map((item) => item.category).filter(Boolean))
        );

        setCategories(['All', ...uniqueCategories]);
      } catch (error) {
        console.error('Error fetching menu:', error);
        setItems([]);
        setCategories(['All']);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMenuAndCategories();
  }, []);

  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.name === item.name);

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          name: item.name,
          quantity: 1,
          price: Number(item.price),
          image: item.image_url || '',
        },
      ];
    });
  };

  const increaseQty = (name: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (name: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.name === name ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (name: string) => {
    setCartItems((prev) => prev.filter((item) => item.name !== name));
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const categoryFiltered =
      activeCategory === 'All'
        ? items
        : items.filter((item) => item.category === activeCategory);

    if (!query) return categoryFiltered;

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

  const orderMessage = `Hello Grand Emaar Hotel, I want to place this order:%0A%0A${cartItems
    .map(
      (item) =>
        `${item.quantity}x ${item.name} - Rs. ${item.price * item.quantity}`
    )
    .join('%0A')}%0A%0ATotal: Rs. ${cartTotal}`;

  const handleSubmitOrder = async () => {
    if (!customerName || !phone || cartItems.length === 0) {
      alert('Please add items and enter your name and phone number.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      alert('Order system is not connected with database.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from('orders').insert({
      customer_name: customerName,
      phone,
      address,
      items: cartItems,
      total_amount: cartTotal,
      status: 'pending',
      notes,
    });

    setIsSubmitting(false);

    if (error) {
      alert('Order submit nahi hua. Supabase orders table check karo.');
      console.error(error);
      return;
    }

    setShowSuccessPopup(true);

    setCartItems([]);
    setCustomerName('');
    setPhone('');
    setAddress('');
    setNotes('');
    setIsOrderOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <WelcomePopup duration={3000} logoSrc="/logo/logo.png" />

      <div>
        <Navbar cartCount={cartCount} onCartClick={() => setIsOrderOpen(true)} />

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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mt-3 text-center text-[11px] uppercase tracking-widest font-mono text-neutral-400">
              Showing{' '}
              <span className="text-neutral-900 font-bold">
                {filteredItems.length}
              </span>{' '}
              of{' '}
              <span className="text-neutral-900 font-bold">{items.length}</span>{' '}
              dishes
            </div>
          </div>

          <div className="mb-12">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>

          <MenuGrid
            items={filteredItems}
            isLoading={isLoading}
            onOrderInRestaurant={(item) => {
              addToCart(item);
              setIsOrderOpen(true);
            }}
          />

          {!isLoading && items.length === 0 && (
            <div className="mt-10 max-w-xl mx-auto text-center px-5 py-6 bg-neutral-50 border border-neutral-200 rounded-sm">
              <p className="text-sm text-neutral-600">
                No menu items found. Please add dishes from admin dashboard.
              </p>
            </div>
          )}

          <div className="mt-16 bg-neutral-950/5 border border-neutral-200/80 p-8 text-center rounded-sm space-y-6 max-w-2xl mx-auto">
            <UtensilsCrossed className="w-8 h-8 text-[#C5A059] mx-auto" />

            <h3 className="font-serif text-xl font-bold text-neutral-900">
              Ready to Order?
            </h3>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsOrderOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest rounded-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                View Bucket
              </button>

              <a
                href={getWhatsAppLink(orderMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-[#A98443] text-white text-xs font-bold uppercase tracking-widest rounded-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Order Bucket on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Order Bucket - redesigned dark/gold theme with item images */}
      {isOrderOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex justify-end">
          <button
            type="button"
            onClick={() => setIsOrderOpen(false)}
            className="absolute inset-0"
            aria-label="Close order bucket"
          />

          <div className="relative bg-neutral-950 border-l border-[#C5A059]/20 w-full max-w-md h-screen overflow-y-auto">
            <div className="sticky top-0 z-10 bg-neutral-950/95 backdrop-blur-sm flex items-center justify-between px-6 py-5 border-b border-[#C5A059]/15">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                <h2 className="font-serif text-2xl font-bold text-white">
                  Order Bucket
                </h2>
              </div>

              <button
                onClick={() => setIsOrderOpen(false)}
                type="button"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-8">
              {cartItems.length === 0 ? (
                <div className="py-20 text-center">
                  <ShoppingBag className="w-12 h-12 mx-auto text-neutral-700 mb-3" />

                  <p className="text-sm text-neutral-500">
                    No items added yet.
                  </p>
                </div>
              ) : (
                <div className="py-6 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.name}
                      className="border border-[#C5A059]/15 bg-neutral-900 p-3 rounded-sm"
                    >
                      <div className="flex justify-between gap-3">
                        <div className="flex gap-3">
                          <img
                            src={
                              item.image ||
                              `https://picsum.photos/seed/${encodeURIComponent(
                                item.name
                              )}/100/100`
                            }
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover rounded-sm border border-[#C5A059]/20 flex-shrink-0"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(
                                item.name
                              )}/100/100`;
                            }}
                          />

                          <div>
                            <h3 className="font-bold text-white leading-snug">
                              {item.name}
                            </h3>

                            <p className="text-sm text-[#C5A059] font-mono">
                              Rs. {item.price} x {item.quantity}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.name)}
                          type="button"
                          className="text-red-400 hover:text-red-300 shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => decreaseQty(item.name)}
                          type="button"
                          className="w-8 h-8 border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 rounded-sm flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="text-sm font-bold text-white w-6 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQty(item.name)}
                          type="button"
                          className="w-8 h-8 border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 rounded-sm flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-[#C5A059]/20 pt-4 flex justify-between items-center">
                    <span className="text-neutral-400 uppercase text-xs tracking-widest font-mono">
                      Total
                    </span>
                    <span className="text-[#C5A059] font-bold text-xl">
                      Rs. {cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-neutral-900 border border-[#C5A059]/20 text-white placeholder:text-neutral-500 px-4 py-3 text-sm outline-none rounded-sm focus:border-[#C5A059]/50"
                    />

                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full bg-neutral-900 border border-[#C5A059]/20 text-white placeholder:text-neutral-500 px-4 py-3 text-sm outline-none rounded-sm focus:border-[#C5A059]/50"
                    />

                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Table Number / Delivery Address"
                      rows={3}
                      className="w-full bg-neutral-900 border border-[#C5A059]/20 text-white placeholder:text-neutral-500 px-4 py-3 text-sm outline-none rounded-sm focus:border-[#C5A059]/50"
                    />

                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Special Instructions"
                      rows={2}
                      className="w-full bg-neutral-900 border border-[#C5A059]/20 text-white placeholder:text-neutral-500 px-4 py-3 text-sm outline-none rounded-sm focus:border-[#C5A059]/50"
                    />

                    <button
                      type="button"
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                      className="w-full bg-[#C5A059] hover:bg-[#A98443] text-white py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm disabled:opacity-50 transition-colors"
                    >
                      {isSubmitting ? 'Submitting...' : 'Complete Restaurant Order'}
                    </button>

                    <a
                      href={getWhatsAppLink(orderMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex justify-center items-center gap-2 border border-[#C5A059]/50 hover:bg-[#C5A059]/10 text-[#C5A059] py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Order Bucket on WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <OrderSuccessPopup
          logoSrc="/logo/logo.png"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}

      <WhatsAppButton
        variant="floating"
        message="Hello Grand Emaar Hotel Nawabshah, I want to know about your menu."
      />

      <Footer />
    </div>
  );
}