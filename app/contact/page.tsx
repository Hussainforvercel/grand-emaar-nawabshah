'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionTitle from '@/components/common/SectionTitle';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { getWhatsAppLink } from '@/lib/whatsapp';
import { Phone, MapPin, Mail, Clock, HelpCircle, Star } from 'lucide-react';

export default function ContactPage() {
  const contactMsg = 'Hello Grand Emaar Hotel, I want to contact your hospitality desk.';

  // Google Maps embed URL for Nawabshah Sakrand road area (Opposite H.M Khoja Tower)
  // We can use a clean premium real Google Map embed!
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.5369688461757!2d68.3970228!3d24.417238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x394c3dc00a89d38c%3A0xe21d8985ce9cdeb!2sSakrand%20Rd%2C%20Nawabshah!5e0!3m2!1sen!2spk!4v1718423233481!5m2!1sen!2spk";

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Contact Hero Header page Segment */}
        <section className="bg-neutral-950 text-white py-20 border-b border-[#C5A059]/15 relative">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-y-0 left-0 right-0 bg-[radial-gradient(#C5A059_1.2px,transparent_1.2px)] [background-size:20px_20px] opacity-15" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Connect With Us
            </h1>
            <p className="text-neutral-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
              We look forward to welcoming you to Grand Emaar Hotel Nawabshah. Reach out on WhatsApp, phone, or visit us directly on Sakrand Road.
            </p>
          </div>
        </section>

        {/* Core Contact Layout section */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionTitle
            title="Our Location & Details"
            subtitle="Get in Touch Instantly"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
            
            {/* Left side details cards */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* Card Address */}
              <div className="bg-white border border-neutral-200/60 p-6 md:p-8 rounded-sm shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-neutral-900 border border-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-neutral-900">Hotel Address</h3>
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">Central Landmark</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Al Makkah Tower, Opposite H.M Khoja Tower, Sakrand Road, Nawabshah 67450, Pakistan
                </p>
              </div>

              {/* Card Chat & Hotline */}
              <div className="bg-white border border-neutral-200/60 p-6 md:p-8 rounded-sm shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-neutral-900 border border-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-neutral-900">WhatsApp & Phone</h3>
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">24H Booking Desk</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm text-neutral-500">
                  <p className="flex items-center justify-between">
                    <span className="font-light">Official Mobile:</span>
                    <a href="tel:+923082077721" className="font-mono font-semibold text-neutral-800 hover:text-[#C5A059] transition-colors">
                      +92 308-2077721
                    </a>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="font-light">Manager Direct Chat:</span>
                    <a href={getWhatsAppLink('Inquires of grand hotel')} target="_blank" rel="noopener" className="font-mono text-emerald-600 font-semibold hover:underline">
                      Chat Now
                    </a>
                  </p>
                </div>
              </div>

              {/* Card Opening Hours */}
              <div className="bg-white border border-neutral-200/60 p-6 md:p-8 rounded-sm shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-neutral-900 border border-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-neutral-900">Operating Hours</h3>
                    <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">Continuous service</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs md:text-sm text-neutral-500 font-light">
                  <p className="flex justify-between">
                    <span>Rest House Booking:</span>
                    <strong className="text-neutral-800">24 Hours / 7 Days</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>Restaurant Hot Kitchen:</span>
                    <strong className="text-neutral-800">07:00 AM - 01:00 AM Same-day</strong>
                  </p>
                </div>
              </div>

            </div>

            {/* Right side Map Frame and quick message CTA */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Interactive map display wrapper */}
              <div className="bg-white border border-neutral-200/70 p-4 rounded-sm shadow-md space-y-4">
                <div className="flex items-center justify-between border-b pb-3 mb-2">
                  <div className="text-left">
                    <h3 className="font-serif text-lg font-bold text-neutral-900">Virtual Route Map</h3>
                    <p className="text-xs text-neutral-400 font-light">Locate opposite H.M Khoja Tower, Nawabshah</p>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059] px-2.5 py-1 rounded bg-[#C5A059]/10 font-bold">
                    Easy commute
                  </span>
                </div>

                <div className="relative w-full h-[320px] rounded-sm overflow-hidden bg-neutral-100 border">
                  {/* Google Map iframe */}
                  <iframe
                    title="Grand Emaar Hotel Nawabshah Google Map embed location"
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0"
                  />
                </div>
              </div>

              {/* Direct Booking Desk WhatsApp banner CTA */}
              <div className="bg-neutral-950 text-white p-8 rounded-sm text-left border border-[#C5A059]/20 relative select-none">
                <div className="absolute inset-1 border border-[#C5A059]/10 pointer-events-none" />
                <h3 className="font-serif text-xl font-bold tracking-tight mb-2">
                  Need Quick Assistance or Live Location Pin?
                </h3>
                <p className="text-neutral-400 text-xs md:text-sm font-light leading-relaxed mb-6">
                  Click below to directly chat with our front-desk manager on WhatsApp. We can send you directions via Google Maps live location pins!
                </p>
                
                <a
                  href={getWhatsAppLink(contactMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="contact-whatsapp-route-pin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] hover:bg-[#A98443] text-neutral-950 hover:text-white font-bold text-xs uppercase tracking-widest transition-all rounded-sm shadow-lg"
                >
                  Request route directions on WhatsApp
                </a>
              </div>

            </div>

          </div>

        </section>
      </div>

      <WhatsAppButton variant="floating" message="Hello Grand Emaar Hotel Nawabshah, I want to ask for location direction." />
      <Footer />
    </div>
  );
}
