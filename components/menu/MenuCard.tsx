'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MenuItem } from '@/types/menu';
import { MessageCircle, Plus } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onOrderInRestaurant?: (item: MenuItem) => void;
}

const getSafeImageSrc = (item: MenuItem) => {
  if (item.image_url && item.image_url.trim() !== '') {
    return item.image_url.trim();
  }

  return `https://picsum.photos/seed/${encodeURIComponent(
    item.name || 'dish'
  )}/500/400`;
};

export default function MenuCard({ item, onOrderInRestaurant }: MenuCardProps) {
  const imageSrc = getSafeImageSrc(item);

  const whatsAppMessage = encodeURIComponent(
    `Hello Grand Emaar Hotel Nawabshah, I want to order this dish:\n\n1x ${item.name}\nPrice: Rs. ${Number(
      item.price || 0
    ).toLocaleString()}`
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral-950 border border-[#C5A059]/15 rounded-sm overflow-hidden shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(197,160,89,0.25)] hover:border-[#C5A059]/40 transition-all duration-300 flex flex-col justify-between group relative"
    >
      {!item.is_available && (
        <span className="absolute top-4 left-4 z-10 bg-black/90 text-neutral-400 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border border-neutral-800">
          Not Available
        </span>
      )}

      <div className="relative h-56 w-full overflow-hidden select-none bg-neutral-900 pt-0">
        <img
          src={imageSrc}
          alt={item.name || 'Dish image'}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(
              item.name || 'dish'
            )}/500/400`;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/10 to-transparent" />

        <div className="absolute bottom-4 right-4 bg-neutral-950/90 backdrop-blur-sm text-white border border-[#C5A059]/40 font-mono text-sm font-semibold px-3.5 py-1 rounded-sm shadow-md flex items-center gap-1">
          <span className="text-[#C5A059] text-xs">Rs.</span>
          {Number(item.price || 0).toLocaleString()}
        </div>
      </div>

      <div className="p-6 text-left flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#C5A059] px-2 py-0.5 rounded-sm bg-[#C5A059]/10 border border-[#C5A059]/25 font-semibold uppercase tracking-wider">
              {item.category}
            </span>

            {item.is_available && (
              <span className="inline-flex items-center gap-1 text-[9px] text-[#C5A059] font-bold tracking-wider uppercase ml-1.5">
                <span className="w-1 h-1 rounded-full bg-[#C5A059] animate-pulse" />
                Available Now
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors leading-snug">
            {item.name}
          </h3>

          <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed line-clamp-3">
            {item.description ||
              'Delicately crafted in Grand Emaar’s signature styles using premier fresh spices and pure refined hygiene controls.'}
          </p>
        </div>

        <div className="pt-3 border-t border-[#C5A059]/10 space-y-2">
          <a
            href={`https://wa.me/923082077721?text=${whatsAppMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-transparent border border-[#C5A059]/50 hover:bg-[#C5A059]/10 text-[#C5A059] text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Order on WhatsApp
          </a>

          <button
            type="button"
            onClick={() => onOrderInRestaurant?.(item)}
            disabled={!item.is_available}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C5A059] hover:bg-[#A98443] text-white text-[11px] font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Order in Restaurant
          </button>
        </div>
      </div>
    </motion.div>
  );
}

