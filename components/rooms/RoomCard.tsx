'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Room } from '@/types/room';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { ShieldAlert, Hotel, Wifi, Tv, Wind, ShieldCheck } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const whatsappMsg = `Hello Grand Emaar Hotel, I want to book a room. I am interested in the "${room.name}".`;
  const bookingLink = getWhatsAppLink(whatsappMsg);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, boxShadow: '0 15px 35px rgba(0,0,0,0.06)' }}
      className="bg-white border border-neutral-200/70 rounded-sm overflow-hidden transition-all duration-300 flex flex-col group shadow-sm"
    >
      {/* Premium Image element */}
      <div className="relative h-72 w-full overflow-hidden select-none">
        <Image
          src={room.image}
          alt={room.name}
          fill
          referrerPolicy="no-referrer"
          className="object-cover transition-transform duration-500 group-hover:scale-103"
        />
        {/* Floating Category/Price Card overlay */}
        <div className="absolute top-4 right-4 bg-neutral-900/95 backdrop-blur-sm border border-[#C5A059]/25 text-white px-4 py-1.5 font-mono text-xs font-semibold tracking-wider">
          {room.price}
        </div>
      </div>

      {/* Narrative Section */}
      <div className="p-6 md:p-8 flex-col flex-1 flex justify-between space-y-6">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-1.5 text-xs text-[#C5A059] uppercase tracking-[0.15em] font-medium">
            <Hotel className="w-3.5 h-3.5" />
            Two-Star Rest House standards
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight group-hover:text-[#C5A059] transition-colors">
            {room.name}
          </h3>

          <p className="text-neutral-500 text-xs md:text-sm font-light leading-relaxed">
            {room.description}
          </p>

          {/* Premium Facilities check grid */}
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold mb-3">
              Included Elite Amenities
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {room.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-2 text-neutral-600 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WhatsApp Book Now CTA Button */}
        <div className="pt-4 border-t border-neutral-100">
          <a
            href={bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            id={`room-card-book-now-${room.id}`}
            className="block w-full py-3 bg-[#C5A059] hover:bg-[#A98443] text-white text-xs font-bold tracking-widest uppercase text-center transition-all shadow-md rounded-sm cursor-pointer select-none"
          >
            Book Now via WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
}
