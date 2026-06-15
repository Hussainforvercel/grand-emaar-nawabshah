'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/common/SectionTitle';
import RoomsGrid from '@/components/rooms/RoomsGrid';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Sparkles, Calendar, Coffee, ShieldAlert, BadgeCheck } from 'lucide-react';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function RoomsPage() {
  const generalBookingMsg = 'Hello Grand Emaar Hotel Nawabshah, I want to book a room. Let me know about room availibility dates.';

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Rooms Hero Header Segment */}
        <section className="bg-neutral-950 text-white py-20 border-b border-[#C5A059]/15 relative">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-y-0 right-0 left-0 bg-[radial-gradient(#C5A059_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-15" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Luxurious Rest House Rooms
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              Grand Emaar Hotel has the honor of being the first certified Two-Star hotel in Nawabshah and Shaheed Benazirabad, ensuring premium hospitality standards and absolute security.
            </p>
          </div>
        </section>

        {/* Dynamic Cards Grid Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Book Your Deluxe Retreat"
            subtitle="Pristine Executive Suites & Rooms"
          />

          <div className="mb-14">
            <RoomsGrid />
          </div>

          {/* Value Propositions Accordion/Informativ Grid */}
          <div className="bg-[#F9F6F0]/40 border border-neutral-200/60 p-8 md:p-12 rounded-sm max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <BadgeCheck className="w-5.5 h-5.5 text-[#C5A059]" />
                Hospitality Policies & Standards
              </h3>
              <ul className="space-y-3.5 text-xs md:text-sm text-neutral-600 font-light">
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059] font-semibold mt-0.5">&bull;</span>
                  <span><strong>Check-in Time:</strong> standard check-in hours, with flexibility based on room availability and express booking validations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059] font-semibold mt-0.5">&bull;</span>
                  <span><strong>Family and Executives ONLY:</strong> Pristine quiet, safe, and family-approved environment for complete comfort.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C5A059] font-semibold mt-0.5">&bull;</span>
                  <span><strong>Power Backup:</strong> Continuous standby heavy generator stream ensuring zero climate control interruptions.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5.5 h-5.5 text-[#C5A059]" />
                Instant Room Reservation Help
              </h3>
              <p className="text-xs md:text-sm text-neutral-500 font-light leading-relaxed mb-4">
                Booking at Grand Emaar Nawabshah is smooth, simple, and direct. Clicking {"\"Book Now\""} lets you discuss package options, group rates, corporate bookings, or special service checklists directly with our managers on WhatsApp.
              </p>
              <div className="pt-2">
                <a
                  href={getWhatsAppLink(generalBookingMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="rooms-general-book-cta"
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-neutral-900 hover:bg-[#C5A059] hover:text-white text-[#C5A059] border border-[#C5A059]/25 text-xs font-bold uppercase tracking-wider transition-all rounded-sm shadow-md"
                >
                  Message Reservation Desk
                </a>
              </div>
            </div>
          </div>

        </section>
      </div>

      <WhatsAppButton variant="floating" message="Hello Grand Emaar Hotel Nawabshah, I want to book a room stay." />
      <Footer />
    </div>
  );
}
