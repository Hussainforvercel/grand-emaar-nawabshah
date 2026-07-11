'use client';

import React from 'react';
import { MenuItem } from '@/types/menu';
import MenuCard from './MenuCard';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat } from 'lucide-react';

interface MenuGridProps {
  items: MenuItem[];
  isLoading: boolean;
  onOrderInRestaurant?: (item: MenuItem) => void;
}

export default function MenuGrid({
  items,
  isLoading,
  onOrderInRestaurant,
}: MenuGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-[#C5A059]/20 border-t-[#C5A059] rounded-full animate-spin" />

          <ChefHat className="w-6 h-6 text-[#C5A059] absolute" />
        </div>

        <p className="text-neutral-500 text-xs uppercase tracking-widest font-mono">
          Refining Dishes Matrix...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 px-4 max-w-md mx-auto border border-[#C5A059]/15 bg-neutral-950/[0.02] space-y-4 rounded-sm">
        <ChefHat className="w-12 h-12 text-[#C5A059] mx-auto opacity-40" />

        <h3 className="font-serif text-lg font-bold text-neutral-800">
          No Items under this Category
        </h3>

        <p className="text-sm text-neutral-400 font-light leading-relaxed">
          We are currently refreshing our kitchen menu choices under this
          specific category. Please browse other delicious category sections or
          ask on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <MenuCard
              key={item.id || item.name}
              item={item}
              onOrderInRestaurant={onOrderInRestaurant}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}



