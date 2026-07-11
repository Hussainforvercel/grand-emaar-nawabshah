'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { MenuItem } from '@/types/menu';
import { MessageCircle, Plus, ArrowRight } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onOrderInRestaurant?: (item: MenuItem) => void;
  // When true, shows a "Browse Menu" link instead of the "Order in Restaurant"
  // button. Pass this ONLY from the Homepage's Popular Dishes cards.
  // Leave it false/undefined on the /menu page so ordering stays functional there.
  showBrowseMenu?: boolean;
}

const getSafeImageSrc = (item: MenuItem) => {
  if (item.image_url && item.image_url.trim() !== '') {
    return item.image_url.trim();
  }

  return `https://picsum.photos/seed/${encodeURIComponent(
    item.name || 'dish'
  )}/500/400`;
};

export default function MenuCard({
  item,
  onOrderInRestaurant,
  showBrowseMenu = false,
}: MenuCardProps) {
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
        <span className="absolute top-3 left-3 z-10 bg-black/90 text-neutral-400 text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 border border-neutral-800">
          Not Available
        </span>
      )}

      <div className="relative h-36 md:h-40 w-full overflow-hidden select-none bg-neutral-900">
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

        <div className="absolute bottom-2.5 right-2.5 bg-neutral-950/90 backdrop-blur-sm text-white border border-[#C5A059]/40 font-mono text-xs font-semibold px-2.5 py-1 rounded-sm shadow-md flex items-center gap-1">
          <span className="text-[#C5A059] text-[10px]">Rs.</span>
          {Number(item.price || 0).toLocaleString()}
        </div>
      </div>

      <div className="p-3.5 text-left flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-[#C5A059] px-1.5 py-0.5 rounded-sm bg-[#C5A059]/10 border border-[#C5A059]/25 font-semibold uppercase tracking-wider">
              {item.category}
            </span>

            {item.is_available && (
              <span className="inline-flex items-center gap-1 text-[8px] text-[#C5A059] font-bold tracking-wider uppercase ml-1">
                <span className="w-1 h-1 rounded-full bg-[#C5A059] animate-pulse" />
                Available Now
              </span>
            )}
          </div>

          <h3 className="font-serif text-base font-bold text-white group-hover:text-[#C5A059] transition-colors leading-snug">
            {item.name}
          </h3>

          <p className="text-neutral-400 text-xs font-light leading-relaxed line-clamp-3">
            {item.description ||
              'Delicately crafted in Grand Emaar’s signature styles using premier fresh spices and pure refined hygiene controls.'}
          </p>
        </div>

        <div className="pt-2 border-t border-[#C5A059]/10 space-y-1.5">
          <a
            href={`https://wa.me/923082077721?text=${whatsAppMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-transparent border border-[#C5A059]/50 hover:bg-[#C5A059]/10 text-[#C5A059] text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Order on WhatsApp
          </a>

          {showBrowseMenu ? (
            // Homepage variant: sends visitors to the full /menu page instead
            // of triggering an in-restaurant order directly from this card.
            <Link
              href="/menu"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#C5A059] hover:bg-[#A98443] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors"
            >
              Browse Menu
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            // /menu page variant: keeps the original in-restaurant ordering flow.
            <button
              type="button"
              onClick={() => onOrderInRestaurant?.(item)}
              disabled={!item.is_available}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#C5A059] hover:bg-[#A98443] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              Order in Restaurant
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}