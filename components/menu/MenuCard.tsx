'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MenuItem } from '@/types/menu';
import Image from 'next/image';
import { Sparkles, Utensils } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  // Graceful fallback image if not provided
  const imageSrc = item.image_url || `https://picsum.photos/seed/${encodeURIComponent(item.name)}/500/400`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-neutral-200/60 rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
    >
      {/* Availability tags */}
      {!item.is_available && (
        <span className="absolute top-4 left-4 z-15 bg-neutral-900/90 text-neutral-400 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border border-neutral-800">
          Not Available
        </span>
      )}

      {/* Media Cover Frame */}
      <div className="relative h-56 w-full overflow-hidden select-none bg-neutral-55 pt-0">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          referrerPolicy="no-referrer"
          className="object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent" />
        
        {/* Price tag */}
        <div className="absolute bottom-4 right-4 bg-white text-neutral-950 border border-neutral-200 font-mono text-sm font-semibold px-3.5 py-1 rounded-sm shadow-md flex items-center gap-1">
          <span className="text-[#C5A059] text-xs">Rs.</span>
          {Number(item.price).toLocaleString()}
        </div>
      </div>

      {/* Content description panel */}
      <div className="p-6 text-left flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#C5A059] px-2 py-0.5 rounded-sm bg-[#C5A059]/10 border border-[#C5A059]/15 font-semibold uppercase tracking-wider">
              {item.category}
            </span>
            {item.is_available && (
              <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 font-bold tracking-wider uppercase ml-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Available Now
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold text-neutral-900 group-hover:text-[#C5A059] transition-colors leading-snug">
            {item.name}
          </h3>

          <p className="text-neutral-500 text-xs md:text-sm font-light leading-relaxed line-clamp-3">
            {item.description || 'Delicately crafted in Grand Emaar’s signature styles using premier fresh spices and pure refined hygiene controls.'}
          </p>
        </div>

        {/* WhatsApp action */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-400">Authentic Food</span>
          <a
            href={`https://wa.me/923082077721?text=${encodeURIComponent(
              `Hello Grand Emaar Hotel Nawabshah, I want to know about the availability of the dish: "${item.name}" (Rs. ${item.price}).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C5A059] hover:text-neutral-900 font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
          >
            Ask Now &rarr;
          </a>
        </div>
      </div>
    </motion.div>
  );
}
