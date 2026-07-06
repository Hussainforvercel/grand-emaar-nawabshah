'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Utensils, AlertCircle, ArrowRight } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import MenuCard from '@/components/menu/MenuCard';
import { MenuItem } from '@/types/menu';
import { supabase } from '@/lib/supabaseClient';

export default function DishesSection() {
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPopularDishes = async () => {
      setIsLoading(true);
      setErrorStatus(null);

      const supabaseClient = supabase;

      if (!supabaseClient) {
        if (isMounted) {
          setErrorStatus(
            'Supabase is not configured. Please check your environment variables.'
          );
          setDishes([]);
          setIsLoading(false);
        }

        return;
      }

      try {
        const { data, error } = await supabaseClient
          .from('menu_items')
          .select(
            'id, name, description, price, category, image_url, is_available, is_popular, sort_order, created_at'
          )
          .eq('is_popular', true)
          .eq('is_available', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(6);

        if (!isMounted) return;

        if (error) {
          console.error('Popular dishes fetch error:', error);
          setErrorStatus('Unable to load popular dishes at the moment.');
          setDishes([]);
        } else {
          setDishes((data ?? []) as MenuItem[]);
        }
      } catch (error) {
        console.error('Unexpected popular dishes fetch error:', error);

        if (isMounted) {
          setErrorStatus('Something went wrong while loading popular dishes.');
          setDishes([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPopularDishes();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#FDFCF9] py-24 border-b border-neutral-100">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-[#C5A059]/10 blur-3xl" />
        <div className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-neutral-900/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#C5A059]/25 bg-white/80 px-4 py-2 shadow-sm backdrop-blur"
        >
          <Utensils className="h-4 w-4 text-[#C5A059]" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-700">
            Signature Menu
          </span>
        </motion.div>

        <SectionTitle
          title="Our Popular Dishes"
          subtitle="Taste of Grand Emaar"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto -mt-4 mb-14 max-w-2xl text-center text-sm sm:text-base text-neutral-500 leading-relaxed"
        >
          Discover our most loved dishes prepared with fresh ingredients,
          rich flavors, and premium hospitality standards.
        </motion.p>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
            <p className="mt-4 text-sm text-neutral-500">
              Loading popular dishes...
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorStatus && (
          <div className="mx-auto flex max-w-xl items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorStatus}</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !errorStatus && dishes.length === 0 && (
          <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm">
            <h3 className="font-serif text-xl font-semibold text-neutral-900">
              No Popular Dishes Added Yet
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-500">
              Mark dishes as popular from the admin dashboard and they will
              appear here automatically.
            </p>
          </div>
        )}

        {/* Dishes Grid - Reusing exact MenuCard design */}
        {!isLoading && !errorStatus && dishes.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish) => (
              <MenuCard key={dish.id || dish.name} item={dish} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-16 overflow-hidden rounded-2xl bg-neutral-950 p-8 text-center shadow-xl sm:p-10"
        >
          <h3 className="font-serif text-2xl font-semibold text-white sm:text-3xl">
            Want to Explore the Full Menu?
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-neutral-300">
            Contact Grand Emaar on WhatsApp for complete menu details, food
            availability, family sitting, catering, and room booking queries.
          </p>

          <a
            href="https://wa.me/923000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#C5A059] px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-neutral-950"
          >
            View Full Menu on WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
