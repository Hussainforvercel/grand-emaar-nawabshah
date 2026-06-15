'use client';

import React from 'react';
import { motion } from 'motion/react';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Phone, Star, ShieldCheck } from 'lucide-react';

export default function CTASection() {
  const whatsAppLink = getWhatsAppLink('Hello Grand Emaar Hotel Nawabshah, I want to inquire about room booking or family restaurant reservation.');

  return (
    <section className="bg-neutral-950 text-white py-24 relative overflow-hidden">
      
      {/* Aesthetic geometric background grids */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(90deg,#C5A059_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,#C5A059_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Triple Star Gold Icon badge */}
        <div className="flex justify-center items-center gap-1.5 text-[#C5A059]">
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-6 h-6 fill-current" />
          <Star className="w-5 h-5 fill-current" />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-serif tracking-tight leading-tight">
            Plan an Unforgettable Stay or <br />
            <span className="text-[#C5A059]">Savor a Regal Meal</span> Today
          </h2>
          
          <p className="text-neutral-400 font-light text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Need directions, custom menus, room availability details, or special family reservations? Shoot us a fast WhatsApp message. We reply instantly.
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-neutral-400 font-light">
          <span className="flex items-center gap-1.5 border-r border-neutral-800 pr-6 last:border-0 last:pr-0">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            100% Guest Policy Secure
          </span>
          <span className="flex items-center gap-1.5 border-r border-neutral-800 pr-6 last:border-0 last:pr-0">
            <Star className="w-4 h-4 text-[#C5A059] fill-current" />
            First 2-Star Class in SBAD
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-[#C5A059]" />
            Direct Exec Callbacks
          </span>
        </div>

        {/* Primary Interactive Gold WhatsApp CTA */}
        <div className="pt-4">
          <motion.a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            id="cta-whatsapp-block-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#C5A059] hover:bg-[#A98443] text-neutral-950 hover:text-white font-bold text-sm md:text-base uppercase tracking-widest transition-all duration-300 shadow-2xl rounded-sm"
          >
            {/* WhatsApp Logo vector */}
            <svg
              className="w-5.5 h-5.5 fill-current shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
            </svg>
            Connect Instantly on WhatsApp
          </motion.a>
        </div>

      </div>
    </section>
  );
}
