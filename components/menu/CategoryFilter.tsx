'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#C5A059]/20 scrollbar-track-transparent">
      <div className="flex md:justify-center items-center gap-2 md:gap-3 min-w-max px-4">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={cn(
                'px-5 py-2.5 text-xs md:text-sm uppercase font-semibold tracking-wider transition-all duration-300 border rounded-sm cursor-pointer whitespace-nowrap',
                isActive
                  ? 'bg-neutral-950 border-[#C5A059]/60 text-[#C5A059] shadow-[0_4px_20px_-4px_rgba(197,160,89,0.45)] scale-[1.03]'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#C5A059]/50 hover:text-[#C5A059] hover:shadow-sm'
              )}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}