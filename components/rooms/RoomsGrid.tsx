'use client';

import React from 'react';
import RoomCard from './RoomCard';

export default function RoomsGrid() {
  const rooms = [
    {
    name: 'Family Executive Suite',
    desc: 'Spacious joint master suite configuration optimized specifically for traveling families expecting maximum safety, luxury hygiene, and warmth.',
    price: 'Perfect for Family',
    image: '/room-images/family_executive.jpeg',
    facilities: [
      '2 Inter-connected spaces',
      'Lounge Sitting Area',
      'Kid Safe layout',
      'Priority Parking Slots'
    ]
  },
  {
    name: 'VIP Executive Room',
    desc: 'Premium master bedroom featuring a striking plush statement headboard, elegant golden-accented lounge chairs, and warm ambient tray-ceiling lighting for a luxurious stay.',
    price: 'Best for Luxury Seekers',
    image: '/room-images/Deluxe_room2.jpeg',
    facilities: [
      'Executive King Bed',
      'Air Conditioning',
      'Plush Statement Headboard',
      'VIP Seating Area',
      'Smart TV & Telephone',
      'High-Speed WiFi',
      'Attached Bathroom'
    ]
  },
    {
      name: 'Standard Room',
      desc: 'Elegant and air-conditioned cozy sanctuary perfect for business travelers with supreme linen sets and essential amenities.',
      price: 'Contact for Prices',
      image: '/room-images/Standard_room.jpeg',
      facilities: ['Smart AC Units', 'High-Speed Wifi', 'Clean Towels', 'HD Cable TV'],
    },
    {
      name: 'Deluxe Room',
      desc: 'Our gorgeous executive choice boasting spacious layouts, superior views, high-grade lounging furniture, and deluxe complimentary packages.',
      price: 'Premium Choice',
      image: '/room-images/Deluxe_room.jpeg',
      facilities: ['Acoustic Soundproofing', 'King Size Beds', 'In-Room Breakfasts', 'Concierge Service'],
    },
    {
      name: 'Family Executive Room',
      desc: 'Spacious joint master suite configuration optimized specifically for traveling families expecting maximum safety, luxury hygiene, and warmth.',
      price: 'Perfect for Family',
      image: '/room-images/family_executive_room.jpeg',
      facilities: ['2 Inter-connected spaces', 'Lounge Sitting Area', 'Kid Safe layout', 'Priority Parking Slots'],
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room, index) => (
        <RoomCard
          key={index}
          room={{
            id: `room-${index}`,   // 🔥 FIX: fake id generate
            name: room.name,
            description: room.desc,
            price: room.price,
            image: room.image,
            facilities: room.facilities,
          }}
        />
      ))}
    </div>
  );
}