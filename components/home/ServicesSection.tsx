'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  ChefHat,
  Coffee,
  ShieldCheck,
  Heart,
  Sparkles,
  Building2,
  Star,
  ArrowRight,
} from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';

export default function ServicesSection() {
  const highlights = [
    {
      icon: Sparkles,
      title: 'First Two-Star Hotel',
      desc: 'Grand Emaar proudly holds the honor of being the first certified Two-Star hotel in Nawabshah and the surrounding Benazirabad region.',
    },
    {
      icon: ChefHat,
      title: 'Premium Food & Catering',
      desc: 'From traditional Pakistani BBQ to Chinese dishes and fast food, our kitchen delivers fresh, flavorful meals with high hygiene standards.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Comfortable Stay',
      desc: 'Enjoy peaceful rooms, complete privacy, air-conditioned comfort, quality linens, prompt service, and reliable security for every guest.',
    },
    {
      icon: Heart,
      title: 'Dedicated Family Sitting',
      desc: 'A private and comfortable family dining area designed for a calm, respectful, and enjoyable experience away from rush and noise.',
    },
    {
      icon: Building2,
      title: 'Prime Location',
      desc: 'Located at Al Makkah Tower, Sakrand Road, Nawabshah, opposite the well-known H.M Khoja Tower landmark.',
    },
    {
      icon: Coffee,
      title: 'Modern Amenities',
      desc: 'Backup generator support, clean environment, breakfast options, responsive staff, and quick WhatsApp assistance for bookings and queries.',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FDFCF9] py-24 border-b border-neutral-100">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#C5A059]/10 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-neutral-900/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#C5A059]/25 bg-white/80 px-4 py-2 shadow-sm backdrop-blur"
        >
          <Star className="h-4 w-4 fill-[#C5A059] text-[#C5A059]" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-700">
            Luxury Hospitality
          </span>
        </motion.div>

        <SectionTitle
          title="Exceptional Standards of Grand Emaar"
          subtitle="Hospitality Redefined"
        />

        {/* Intro Text */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto -mt-4 mb-14 max-w-2xl text-center text-sm sm:text-base text-neutral-500 leading-relaxed"
        >
          Experience premium dining, comfortable accommodation, family-friendly
          hospitality, and trusted service standards in the heart of Nawabshah.
        </motion.p>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[#C5A059]/40 hover:shadow-[0_25px_70px_rgba(197,160,89,0.14)]"
              >
                {/* Golden Top Line */}
                <span className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#C5A059] via-[#E3C878] to-[#C5A059] transition-transform duration-500 group-hover:scale-x-100" />

                {/* Card Glow */}
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#C5A059]/10 blur-2xl transition-all duration-500 group-hover:bg-[#C5A059]/20" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-[#C5A059] shadow-md transition-all duration-300 group-hover:bg-[#C5A059] group-hover:text-white group-hover:rotate-3">
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <span className="text-4xl font-serif text-neutral-100 transition-colors duration-300 group-hover:text-[#C5A059]/20">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mb-3 font-serif text-xl font-semibold text-neutral-950 transition-colors duration-300 group-hover:text-[#C5A059]">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-7 text-neutral-500">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-4 rounded-2xl border border-[#C5A059]/20 bg-neutral-950 p-6 text-white shadow-xl sm:grid-cols-3"
        >
          <div className="text-center">
            <h4 className="font-serif text-3xl font-semibold text-[#C5A059]">
              2-Star
            </h4>
            <p className="mt-1 text-sm text-neutral-300">
              Certified Hotel Standard
            </p>
          </div>

          <div className="text-center sm:border-x sm:border-white/10">
            <h4 className="font-serif text-3xl font-semibold text-[#C5A059]">
              Family
            </h4>
            <p className="mt-1 text-sm text-neutral-300">
              Dedicated Sitting Area
            </p>
          </div>

          <div className="text-center">
            <h4 className="font-serif text-3xl font-semibold text-[#C5A059]">
              24/7
            </h4>
            <p className="mt-1 text-sm text-neutral-300">
              Booking Assistance
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}