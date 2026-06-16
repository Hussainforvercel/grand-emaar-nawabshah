'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ChefHat, Hotel, MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';
import Image from 'next/image';

export default function HeroSection() {
  const whatsappBookMsg = 'Hello Grand Emaar Hotel Nawabshah, I would study package options to book a stay.';
  const whatsappContactMsg = 'Hello Grand Emaar Hotel Nawabshah, I would like to get general information about your hotel.';

  return (
    <section className="relative min-h-[90vh] flex items-center bg-neutral-950 text-white overflow-hidden py-16">
      
      {/* Background Graphic Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src=""
          alt="Grand Emaar Hotel Nawabshah Interior"
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover opacity-35 object-center scale-105 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FDFCF9] to-transparent z-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-900/90 border border-[#C5A059]/30 text-[#C5A059] rounded-full text-xs font-semibold tracking-widest uppercase"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              Nawabshah{"'"}s First Certified Two-Star Hotel
            </motion.div>

            <div className="space-y-2">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="block text-sm md:text-base font-sans tracking-[0.4em] uppercase text-[#C5A059] font-semibold"
              >
                Welcome to Excellence
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', damping: 25 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-serif tracking-tight leading-none"
              >
                Grand Emaar <br />
                <span className="text-[#C5A059] relative font-medium">
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
              className="text-sm md:text-lg text-neutral-300 font-light max-w-2xl leading-relaxed"
            >
              Grand Emaar Hotel holds the distinct honor of being the first Two-Star luxury hotel in Nawabshah and the Shaheed Benazirabad District. Discover exceptional comfort, pristine hospitality, and an outstanding restaurant family setup under one roof.
            </motion.p>

            {/* Interactive Call-to-actions */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link
                href="/menu"
                id="hero-menu-cta"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-neutral-900 border border-white hover:bg-[#C5A059] hover:border-[#C5A059] hover:text-white font-semibold tracking-wider text-sm transition-all duration-300 shadow-xl"
              >
                <ChefHat className="w-4 h-4" />
                VIEW FOOD MENU
              </Link>
              
              <a
                href={getWhatsAppLink(whatsappBookMsg)}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-book-room-cta"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C5A059] hover:bg-[#A98443] text-white font-semibold tracking-wider text-sm transition-all duration-300 shadow-xl"
              >
                <Hotel className="w-4 h-4" />
                BOOK ROOM ON WHATSAPP
              </a>

              <a
                href={getWhatsAppLink(whatsappContactMsg)}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-contact-cta"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-[#C5A059] border border-[#C5A059]/25 font-semibold tracking-wider text-sm transition-all duration-300 shadow-xl"
              >
                <MessageSquare className="w-4 h-4" />
                CONTACT ON WHATSAPP
              </a>
            </motion.div>

          </div>

          {/* Golden Badge Panel or Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="hidden lg:col-span-4 lg:flex flex-col border border-[#C5A059]/20 bg-neutral-900/90 p-8 text-center rounded-sm space-y-6 shadow-2xl relative"
          >
            {/* Elegant luxury framing */}
            <div className="absolute inset-2 border border-[#C5A059]/10 pointer-events-none" />
            
            <div className="w-16 h-16 rounded-full bg-neutral-950 flex items-center justify-center border-2 border-[#C5A059] mx-auto">
              <span className="text-[#C5A059] font-serif text-2xl font-bold">★★</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-medium tracking-wide text-white">District Milestone</h3>
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                “Official Star Category approved. Providing prime guest services and fine Pakistani & Chinese dining for our executive visitors and graceful families.”
              </p>
            </div>

            <div className="border-t border-[#C5A059]/20 pt-4 text-xs font-mono tracking-widest text-[#C5A059]">
              SECURE FAMILY ENVIRONMENT
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
