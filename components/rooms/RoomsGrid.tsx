'use client';

import React from 'react';
import { Room } from '@/types/room';
import RoomCard from './RoomCard';

export default function RoomsGrid() {
  const rooms: Room[] = [
    {
      id: 'standard',
      name: 'Standard Room',
      description: 'Elegant and air-conditioned cozy retreat layout optimized for traveling business professionals or executive pairs. Fully equipped with modern fixtures, backup generator, quiet surroundings and premium hygiene standards.',
      price: 'Contact for Booking',
      image: 'https://picsum.photos/seed/stdroom/800/600',
      facilities: ['Smart AC System', 'Complimentary High-speed Wifi', 'Pure Linens', 'HD Cable TV', '24h Cold/Hot Shower', 'Clean Bathroom Kits'],
    },
    {
      id: 'deluxe',
      name: 'Deluxe Room',
      description: 'Our crown jewel chamber boasting a master king-size bed setup, larger panoramic layouts, refined acoustic wood paneling, premium sofas, and double complimentary breakfast. Ideal for executive travelers searching for elevated tranquility.',
      price: 'Executive Suite tier',
      image: 'https://picsum.photos/seed/dlxroom/800/600',
      facilities: ['Acoustic Soundproofing', 'King Size Master Bed', 'In-room Breakfast Option', 'Luggage Desk Support', 'Luxury Toiletries Set', 'Complimentary Water & Tea'],
    },
    {
      id: 'family',
      name: 'Family Executive Room',
      description: 'Expansive interconnected multi-bed suite configurations crafted specifically to provide ultimate privacy, top-tier safety, and exceptional modern luxury for visiting Pakistani and traveling families of 4-6 members on Sakrand Road.',
      price: 'Spacious Family Choice',
      image: 'https://picsum.photos/seed/famroom/800/600',
      facilities: ['Joint Multi-Bed setup', 'Spacious Sitting Lounges', 'Priority Car Parking', 'Kid Accommodative furniture', 'High Air-cooling power', '24h Quick Room Assistant'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}
