'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChefHat, Hotel, MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';
import Image from 'next/image';

export default function HeroSection() {
  const whatsappBookMsg =
    'Hello Grand Emaar Hotel Nawabshah, I would like to view package options to book a stay.';

  const whatsappContactMsg =
    'Hello Grand Emaar Hotel Nawabshah, I would like to get general information about your hotel.';

  return (
    <section className="relative w-full max-w-full min-h-[90vh] flex items-center bg-neutral-950 text-white overflow-x-hidden overflow-y-hidden py-16 sm:py-20">
      {/* Background Graphic Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/header/header.png"
          alt="Grand Emaar Hotel Nawabshah Interior"
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover opacity-35 object-center scale-105 filter brightness-75"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20 lg:to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDFCF9] to-transparent z-10" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-w-0">
          <div className="lg:col-span-8 space-y-6 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex max-w-full items-center gap-2 px-3 sm:px-4 py-1.5 bg-neutral-900/90 border border-[#C5A059]/30 text-[#C5A059] rounded-full text-[10px] sm:text-xs font-semibold tracking-wider sm:tracking-widest uppercase break-words"
            >
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              <span className="min-w-0 leading-relaxed">
                Nawabshah{"'"}s First Certified Two-Star Hotel
              </span>
            </motion.div>

            <div className="space-y-3 min-w-0">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="block text-xs sm:text-sm md:text-base font-sans tracking-[0.22em] sm:tracking-[0.35em] md:tracking-[0.4em] uppercase text-[#C5A059] font-semibold break-words"
              >
                Welcome to Excellence
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', damping: 25 }}
                className="max-w-full text-[2.45rem] leading-[0.95] sm:text-6xl lg:text-7xl font-serif tracking-tight break-words"
              >
                Grand Emaar <br />
                <span className="text-[#C5A059] relative inline-block max-w-full font-medium break-words">
                  Hotel Nawabshah
                  <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-[3px] bg-[#C5A059]/20" />
                </span>
              </motion.h1>
            </div>

            {/* Narrative Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-lg text-neutral-300 font-light max-w-2xl leading-relaxed break-words"
            >
              Grand Emaar Hotel holds the distinct honor of being the first
              Two-Star luxury hotel in Nawabshah and the Shaheed Benazirabad
              District. Discover exceptional comfort, pristine hospitality, and
              an outstanding restaurant family setup under one roof.
            </motion.p>

            {/* Interactive Call-to-actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 pt-4 w-full max-w-full"
            >
              <Link
                href="/menu"
                id="hero-menu-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 bg-white text-neutral-900 border border-white hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-white font-semibold tracking-wide sm:tracking-wider text-xs sm:text-sm text-center transition-all duration-300 shadow-xl"
              >
                <ChefHat className="w-4 h-4 shrink-0" />
                <span>VIEW FOOD MENU</span>
              </Link>

              <a
                href={getWhatsAppLink(whatsappBookMsg)}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-book-room-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 bg-[#C5A059] hover:bg-[#A98443] text-white font-semibold tracking-wide sm:tracking-wider text-xs sm:text-sm text-center transition-all duration-300 shadow-xl"
              >
                <Hotel className="w-4 h-4 shrink-0" />
                <span>BOOK ROOM ON WHATSAPP</span>
              </a>

              <a
                href={getWhatsAppLink(whatsappContactMsg)}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-contact-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-[#C5A059] border border-[#C5A059]/25 font-semibold tracking-wide sm:tracking-wider text-xs sm:text-sm text-center transition-all duration-300 shadow-xl"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>CONTACT ON WHATSAPP</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}