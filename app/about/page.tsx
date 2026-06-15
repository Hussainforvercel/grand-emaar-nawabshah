'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/common/SectionTitle';
import Image from 'next/image';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Award, ShieldCheck, Heart, MapPin, Sparkles, Star } from 'lucide-react';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function AboutPage() {
  const whatsappMsg = 'Hello Grand Emaar Hotel Nawabshah, I would study about your packages or services.';

  const credentials = [
    {
      icon: Award,
      title: 'First Two-Star Certified',
      desc: 'Officially approved by Sindh Tourism and luxury hospitality departments as Shaheed Benazirabad District’s very first certified Two-Star class hotel.',
    },
    {
      icon: ShieldCheck,
      title: 'Elite Secured Environment',
      desc: 'Equipped with continuous CCTV monitoring, dedicated security guards, and rigid family-exclusive policies protecting your privacy.',
    },
    {
      icon: Heart,
      title: 'Flawless Local Hospitality',
      desc: 'Our staff represents the traditional warmth of Sindh coupled with modern, professional luxury hotel management principles.',
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* About Hero Header segment */}
        <section className="bg-neutral-950 text-white py-20 border-b border-[#C5A059]/15 relative">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(#C5A059_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-15" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Our Vision & Legacy
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              Grand Emaar Hotel is Nawabshah’s premier milestone in luxury accommodation and premium family dining. Explore our story of class and standards.
            </p>
          </div>
        </section>

        {/* Narrative Brand Story Section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Narrative Side */}
            <div className="lg:col-span-6 relative aspect-square md:aspect-video lg:aspect-square w-full rounded-sm overflow-hidden shadow-2xl group border border-[#C5A059]/15">
              <Image
                src="https://picsum.photos/seed/aboutemaar/800/800"
                alt="Grand Emaar Nawabshah Hospitality Lobby"
                fill
                referrerPolicy="no-referrer"
                className="object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-4 left-4 bg-neutral-900/90 text-[#C5A059] border border-[#C5A059]/20 px-3.5 py-1 text-[11px] uppercase tracking-widest font-bold">
                ESTABLISHED EXCELLENCE
              </div>
            </div>

            {/* Narrative Story Details */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold block">
                Nawabshah Landmark
              </span>
              
              <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 font-medium">
                The First Two-Star Hotel in Shaheed Benazirabad
              </h2>

              <p className="text-neutral-500 font-light text-sm md:text-base leading-relaxed">
                Prior to Grand Emaar Hotel Nawabshah, travelers, corporate executives, and local families struggled to find certified premium lodging. We established a landmark that offers deluxe soundproofed rooms, highly hygienic restaurant dining rooms, private spaces, and round-the-clock power backup.
              </p>

              <p className="text-neutral-500 font-light text-sm md:text-base leading-relaxed">
                Situated opposite the famous landmark <strong>H.M Khoja Tower</strong> on Sakrand Road, our facility delivers a double experience: executive rest rooms on the upper floors and an exquisite Pakistani and BBQ restaurant below. We welcome our visitors, business personnel, and family groups with unparalleled class.
              </p>

              {/* Star rating icons */}
              <div className="flex gap-1 text-[#C5A059] pt-2">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <span className="text-xs font-mono tracking-widest text-[#C5A059] font-bold ml-2 uppercase pt-0.5">Two-Star Official Grade</span>
              </div>
            </div>

          </div>
        </section>

        {/* Pillars of our service offerings */}
        <section className="bg-[#F9F6F0]/40 py-20 border-y border-neutral-150">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              title="The Grand Emaar Pillars"
              subtitle="Why Clients Choose Grand Emaar"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
              {credentials.map((pill, idx) => {
                const Icon = pill.icon;
                return (
                  <div key={idx} className="bg-white border border-neutral-200/50 p-8 rounded-sm text-left shadow-sm space-y-4">
                    <div className="w-11 h-11 bg-neutral-900 text-[#C5A059] border border-[#C5A059]/15 flex items-center justify-center rounded-sm">
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-neutral-900">
                      {pill.title}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-500 font-light leading-relaxed">
                      {pill.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick prompt to menu/rooms */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="font-serif text-2xl md:text-3xl text-neutral-900">
              Discover Our Multilingual, Highly Professional Service Flow
            </h2>
            <p className="text-neutral-500 font-light text-sm max-w-xl mx-auto leading-relaxed">
              We focus on premium comfort, meticulous security checks, clear billing structures, and beautiful family setups. Contact our front desk directly for booking reservations.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppLink(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                id="about-connect-desk-cta"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-[#A98443] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-sm shadow-md"
              >
                Inquire via WhatsApp Desk
              </a>
            </div>
          </div>
        </section>

      </div>

      <WhatsAppButton variant="floating" message="Hello Grand Emaar Hotel Nawabshah, I want to learn more about your services." />
      <Footer />
    </div>
  );
}
