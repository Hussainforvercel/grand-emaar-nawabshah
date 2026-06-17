'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import RestaurantSection from '@/components/home/RestaurantSection';
import RoomsPreview from '@/components/home/RoomsPreview';
import CTASection from '@/components/home/CTASection';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import DishesSection from '@/components/home/DishesSection';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation bar */}
        <Navbar />

        {/* Hero Area */}
        <HeroSection />

        {/* Hotel Pillars / Highlights / Services section */}
        <ServicesSection />

        {/* Restaurant spotlight block */}
        <RestaurantSection />


<DishesSection />

        {/* Rooms / Rest House Quick Preview */}
        <RoomsPreview />

        {/* Direct Call to Action Panel */}
        <CTASection />
      </div>

      {/* Global Floating Sticky WhatsApp Bubble */}
      <WhatsAppButton variant="floating" message="Hello Grand Emaar Hotel Nawabshah, I would like to book a table or stay room of mine." />

      {/* Footer bar */}
      <Footer />
    </div>
  );
}
