'use client';

import React from 'react';
import { MenuItem } from '@/types/menu';
import { ChefHat, Flame, ShieldCheck, ShoppingBag } from 'lucide-react';

interface AdminHeaderProps {
  items: MenuItem[];
}

export default function AdminHeader({ items }: AdminHeaderProps) {
  const totalItems = items.length;
  const availableItems = items.filter((i) => i.is_available).length;
  const soldOutItems = totalItems - availableItems;

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Upper bar heading block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900">
            Grand Emaar Nawabshah Menu Registry
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 font-light mt-1">
            Build, edit, delete, and control public dishes on your {"website's"} `/menu` portal.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900 border border-[#C5A059]/25 px-4 py-2 text-[#C5A059] rounded-sm text-xs font-mono font-bold uppercase tracking-wider">
          <Flame className="w-4 h-4 animate-bounce" />
          SYSTEM STABLE
        </div>
      </div>

      {/* Metrics bento-style badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Metric */}
        <div className="bg-white border rounded-sm p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold">Total Dishes</p>
            <p className="text-2xl font-bold font-serif text-neutral-900">{totalItems}</p>
          </div>
          <div className="w-10 h-10 bg-neutral-50 border flex items-center justify-center text-neutral-700 rounded-sm">
            <ChefHat className="w-5 h-5" />
          </div>
        </div>

        {/* Active Metric */}
        <div className="bg-white border rounded-sm p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-semibold">Active Available</p>
            <p className="text-2xl font-bold font-serif text-emerald-600">{availableItems}</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 rounded-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Sold out Metric */}
        <div className="bg-white border rounded-sm p-4 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 font-bold">Sold Out</p>
            <p className="text-2xl font-bold font-serif text-amber-600">{soldOutItems}</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 rounded-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

      </div>

    </div>
  );
}
