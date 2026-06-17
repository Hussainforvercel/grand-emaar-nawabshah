'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function RestaurantSection() {
  const categoriesList = [
    'Traditional Handi & Karahi',
    'Sizzling BBQ Platter Specialties',
    'Modern Fast Food & Burgers',
    'Premium Family Sitting Halls',
    'Traditional Breakfast & Lassi',
    'Refreshed Mocktails & Hot Beverages',
  ];

  return (
    <section className="bg-white py-20 border-b border-neutral-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Aesthetic Food Image Layout */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative aspect-video lg:aspect-square w-full rounded-sm overflow-hidden shadow-2xl group border border-[#C5A059]/10"
          >
            <Image
              src="/features-images/rest.png"
              alt="Grand Emaar Nawabshah Restaurant Dining"
              fill
              referrerPolicy="no-referrer"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Embedded Golden Tag overlay */}
            <div className="absolute bottom-6 left-6 right-6 bg-neutral-900/95 backdrop-blur-sm border border-[#C5A059]/30 p-5 text-left text-white shadow-lg">
              <span className="text-[#C5A059] uppercase tracking-widest text-[10px] font-bold block mb-1">Dine in Nawabshah</span>
              <p className="text-sm font-serif font-light text-neutral-300">
                {"\"Grand Emaar Restaurant serves sizzling BBQ & exquisite Pakistani tastes under clean, temperature-controlled family spaces.\""}
              </p>
            </div>
          </motion.div>

          {/* Narrative Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 space-y-6"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold block mb-2">
              Culinary Delights
            </span>
            
            <h2 className="text-3xl md:text-5xl font-serif text-neutral-900 font-medium leading-tight">
              Restaurant Worthy of Royalty
            </h2>
            
            <p className="text-neutral-500 font-light text-sm md:text-base leading-relaxed">
              We present an outstanding menu from Pakistani Desi traditions to Continental fast food, curated by our top culinary chefs. Every dish is seasoned with fresh, organic spices and presented in high elegance.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-4">
              {categoriesList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-neutral-700">
                  <div className="w-5 h-5 rounded-full bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-xs md:text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link
                href="/menu"
                id="restaurant-browse-menu"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-[#A98443] text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-md hover:scale-[1.01]"
              >
                Browse Menu <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/about"
                className="text-xs uppercase tracking-widest text-neutral-500 font-bold hover:text-[#C5A059] transition-colors py-2"
              >
                Learn About Family Halls
              </Link>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
