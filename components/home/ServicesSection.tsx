'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, Coffee, ShieldCheck, Heart, Sparkles, Building2 } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';

export default function ServicesSection() {
  const highlights = [
    {
      icon: Sparkles,
      title: 'First Two-Star Hotel',
      desc: 'Grand Emaar is officially the first Certified Two-Star hotel in Nawabshah and the surrounding Benazirabad region, adhering to elite service norms.',
    },
    {
      icon: ChefHat,
      title: 'Quality Food Catering',
      desc: 'Our supreme chef staff prepares Pakistan traditional grills, modern hot fast-food, BBQ, and savory Chinese courses with high hygiene standards.',
    },
    {
      icon: ShieldCheck,
      title: 'Comfortable & Secure Stay',
      desc: 'Relaxing rest rooms with full security, supreme air-cooling, prompt room service, and luxury linens designed for absolute privacy.',
    },
    {
      icon: Heart,
      title: 'Dedicated Family Sitting',
      desc: 'A gorgeous, well-spaced dedicated section where families can dine-in privately away from general rush, with superb hospitality.',
    },
    {
      icon: Building2,
      title: 'Prime Central Location',
      desc: 'Perfect road connection situated right at Al Makkah Tower, Sakrand Road, Nawabshah. Opposite the famous landmark H.M Khoja Tower.',
    },
    {
      icon: Coffee,
      title: 'Superior Amenities',
      desc: 'Enjoy backup secure generator flow, smart connectivity, delicious hot breakfasts, and instant customized WhatsApp customer concierge support.',
    },
  ];

  return (
    <section className="bg-[#FDFCF9] py-20 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Elegant Section Title */}
        <SectionTitle
          title="Exceptional Standards of Grand Emaar"
          subtitle="Hospitality Redefined"
        />

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{ y: -6, boxShadow: '0 12px 30px rgba(0,0,0,0.04)' }}
                className="bg-white border border-neutral-200/60 p-8 rounded-sm transition-all duration-300 relative group"
              >
                {/* Decorative golden accent bar on card left side on hover */}
                <span className="absolute left-0 top-0 h-full w-[3px] bg-[#C5A059] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
                
                <div className="w-12 h-12 rounded-sm bg-neutral-900 flex items-center justify-center text-[#C5A059] mb-6 border border-[#C5A059]/10 transition-colors group-hover:bg-[#C5A059] group-hover:text-white">
                  <IconComponent className="w-5.5 h-5.5" />
                </div>

                <h3 className="font-serif text-lg font-semibold text-neutral-900 group-hover:text-[#C5A059] transition-colors mb-3">
                  {item.title}
                </h3>
                
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
