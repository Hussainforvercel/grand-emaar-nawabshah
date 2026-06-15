'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Shield, Sparkles, Tv, Wifi } from 'lucide-react';
import Image from 'next/image';
import SectionTitle from '@/components/common/SectionTitle';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function RoomsPreview() {
  const rooms = [
    {
      name: 'Standard Room',
      desc: 'Elegant and air-conditioned cozy sanctuary perfect for business travelers with supreme linen sets and essential amenities.',
      price: 'Contact for Prices',
      image: 'https://picsum.photos/seed/standardroom/600/400',
      facilities: ['Smart AC Units', 'High-Speed Wifi', 'Clean Towels', 'HD Cable TV'],
    },
    {
      name: 'Deluxe Room',
      desc: 'Our gorgeous executive choice boasting spacious layouts, superior views, high-grade lounging furniture, and deluxe complimentary packages.',
      price: 'Premium Choice',
      image: 'https://picsum.photos/seed/deluxeroom/600/400',
      facilities: ['Acoustic Soundproofing', 'King Size Beds', 'In-Room Breakfasts', 'Concierge Service'],
    },
    {
      name: 'Family Executive Room',
      desc: 'Spacious joint master suite configuration optimized specifically for traveling families expecting maximum safety, luxury hygiene, and warmth.',
      price: 'Perfect for Family',
      image: 'https://picsum.photos/seed/familyroom/600/400',
      facilities: ['2 Inter-connected spaces', 'Lounge Sitting Area', 'Kid Safe layout', 'Priority Parking Slots'],
    },
  ];

  const whatsappMessage = 'Hello Grand Emaar Hotel, I want to book a room.';
  const link = getWhatsAppLink(whatsappMessage);

  return (
    <section className="bg-[#F9F6F0]/40 py-20 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          title="Premium Accommodations"
          subtitle="A Peaceful Sanctuary in Nawabshah"
        />

        {/* Room showcase cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          {rooms.map((room, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-white border border-neutral-200/60 rounded-sm overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative h-64 overflow-hidden select-none">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-neutral-900/90 backdrop-blur-sm px-3.5 py-1 text-[#C5A059] border border-[#C5A059]/25 text-[10px] uppercase tracking-widest font-bold">
                  {room.price}
                </div>
              </div>

              {/* Core Content */}
              <div className="p-6 md:p-8 flex-col flex-1 flex justify-between space-y-6">
                <div className="space-y-4 text-left">
                  <h3 className="font-serif text-xl font-bold text-neutral-900 group-hover:text-[#C5A059] transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-neutral-500 text-xs md:text-sm font-light leading-relaxed">
                    {room.desc}
                  </p>

                  <div className="pt-2">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-2">Available Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                       {room.facilities.map((fac, fIdx) => (
                        <span key={fIdx} className="text-[11px] bg-neutral-50 text-neutral-600 px-2.5 py-1 rounded-sm border border-neutral-100 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`preview-room-book-${idx}`}
                    className="block w-full py-2.5 bg-neutral-900 hover:bg-[#C5A059] hover:text-white text-[#C5A059] text-xs font-semibold uppercase tracking-widest text-center transition-all sm:rounded-sm border border-[#C5A059]/20"
                  >
                    Book Room via WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all Rooms direct page Link banner */}
        <div className="text-center pt-8">
          <Link
            href="/rooms"
            id="home-view-all-rooms"
            className="inline-flex items-center gap-2 text-[#C5A059] font-semibold text-xs tracking-widest uppercase hover:text-neutral-900 transition-colors border-b-2 border-[#C5A059] pb-1.5"
          >
            Explore Full Rooms Page & Facilities
          </Link>
        </div>

      </div>
    </section>
  );
}
