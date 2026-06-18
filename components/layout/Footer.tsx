'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Clock, Phone, MapPin, Instagram, HelpCircle } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Our Menu' },
    { href: '/rooms', label: 'Book Room' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact Details' },
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand/About Brief */}<Image
                src="/logo/logo_GE.png"
                alt="Grand Emaar Logo"
                width={90}
                height={90}
                priority
                className="mb-3 ml-7 object-contain"
                />
          <div className="space-y-4">
            <Link href="/" className="flex flex-col items-start">
            <Image
                src="/logo/logo_GE.png"
                alt="Grand Emaar Logo"
                width={90}
                height={90}
                priority
                className="mb-3 ml-7 object-contain"
                />
            <span className="font-serif text-2xl font-bold tracking-tight text-white mb-1">
    GRAND EMAAR
            </span>

            <span className="text-xs font-sans tracking-[0.25em] uppercase text-[#C5A059] font-semibold">
            Hotel Nawabshah
            </span>

            </Link>
            <p className="text-sm font-light text-neutral-400 leading-relaxed pt-2">
              The first certified Two-Star hotel in Nawabshah and Shaheed Benazirabad District. Experience luxury accommodation paired with premium multi-cuisine dining.
            </p>
            <div className="flex items-center gap-4 pt-2">

  {/* Instagram */}
  <a
    href="https://instagram.com/grandemaarhotel"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-[#C5A059] text-neutral-400 transition-colors"
    aria-label="Instagram Profile"
  >
    <Instagram className="w-5 h-5" />
  </a>

  {/* Facebook */}
  <a
    href="https://facebook.com/p/Grand-Emaar-Hotel-Nawabshah-61579998419282/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-[#C5A059] text-neutral-400 transition-colors"
    aria-label="Facebook Page"
  >
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4H15c-1.2 0-1.6.7-1.6 1.5V12H17l-.5 3h-2.1v7A10 10 0 0 0 22 12z"/>
    </svg>
  </a>

  {/* TikTok */}
  <a
    href="https://tiktok.com/@grand_emaar_hotel_n.shah"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-[#C5A059] text-neutral-400 transition-colors"
    aria-label="TikTok Profile"
  >
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12.7 2h3.2a5.7 5.7 0 0 0 5.1 4.3v3.2a8.9 8.9 0 0 1-5.1-1.6v7.1a6.9 6.9 0 1 1-6.9-6.9c.4 0 .9 0 1.3.1v3.3a3.6 3.6 0 1 0 2.4 3.4V2z"/>
    </svg>
  </a>

</div>
          
          </div>

          {/* Opening and Contact Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-white tracking-wide border-b border-[#C5A059]/15 pb-2">
              Timings & Services
            </h3>
            <ul className="text-sm space-y-3 font-light text-neutral-400">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-300">Room Bookings</p>
                  <p className="text-xs">24 Hours Open / 7 Days a Week</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-300">Restaurant Dine-in</p>
                  <p className="text-xs">07:00 AM - 01:00 AM Daily</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-neutral-300">Certified Two-Star</p>
                  <p className="text-xs">Premium Family Environments</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-white tracking-wide border-b border-[#C5A059]/15 pb-2">
              Quick Links
            </h3>
            <ul className="text-sm space-y-2.5 font-light">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-[#C5A059] text-neutral-400 transition-colors block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin-login"
                  className="text-xs tracking-wider text-neutral-500 hover:text-[#C5A059] transition-colors uppercase font-mono block pt-2"
                >
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-medium text-white tracking-wide border-b border-[#C5A059]/15 pb-2">
              Contact Us
            </h3>
            <ul className="text-sm space-y-3 font-light text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-[#C5A059] shrink-0 mt-1" />
                <span className="leading-tight">
                  Al Makkah Tower, Opposite H.M Khoja Tower,  
                  Sakrand Road, Nawabshah 67450, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-[#C5A059] shrink-0" />
                <a href="tel:+923082077721" className="hover:text-[#C5A059] transition-colors font-mono">
                  +92 308 2077721
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-[#C5A059] shrink-0" />
                <span className="font-mono text-xs">info@grandemaar.auth.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Subfooter */}
        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono tracking-wider">
          <p>&copy; {currentYear} Grand Emaar Hotel Nawabshah. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-[#C5A059]">Certified 2-Star Class</span>
            <span className="text-neutral-600">|</span>
            <p>Developed with Premium Grace</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
