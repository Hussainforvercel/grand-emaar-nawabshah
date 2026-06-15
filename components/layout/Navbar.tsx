'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const whatsAppLink = getWhatsAppLink('Hello Grand Emaar Hotel, I want to ask about your services.');

  return (
    <>
      {/* Top micro-bar for contact info */}
      <div className="bg-neutral-900 text-[#C5A059] text-xs py-2 px-4 md:px-8 flex justify-between items-center border-b border-[#C5A059]/10 transition-all duration-300">
        <div className="flex items-center gap-1.5 font-light">
          <MapPin className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Opposite H.M Khoja Tower, Nawabshah</span>
          <span className="sm:hidden inline">Nawabshah, Pakistan</span>
        </div>
        <div className="flex items-center gap-4 font-mono">
          <span>Call: +92 308 2077721</span>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 bg-white transition-all duration-300 w-full border-b',
          scrolled ? 'shadow-md py-1 border-neutral-100 bg-white/95 backdrop-blur-md' : 'py-3 border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo area */}
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-[#C5A059] transition-colors">
                GRAND EMAAR
              </span>
              <span className="text-[10px] sm:text-xs font-sans tracking-[0.3em] uppercase text-[#C5A059] font-semibold -mt-1 group-hover:text-neutral-950 transition-colors">
                Hotel Nawabshah
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-sm tracking-widest uppercase font-medium transition-all duration-200 relative py-1 hover:text-[#C5A059]',
                      isActive ? 'text-[#C5A059]' : 'text-neutral-700'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A059]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/admin-dashboard"
                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-[#C5A059] transition-colors"
              >
                Admin Panel
              </Link>
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                id="navbar-whatsapp-cta"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#C5A059] hover:bg-[#A98443] transition-colors rounded-full"
              >
                WhatsApp Book
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden gap-3">
              <Link
                href="/admin-dashboard"
                className="text-[10px] uppercase tracking-wider text-neutral-500 mr-1"
              >
                Admin
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-neutral-700 hover:text-[#C5A059] focus:outline-none p-1.5 rounded"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden bg-white border-t border-neutral-100 overflow-hidden shadow-inner"
            >
              <div className="px-4 pt-4 pb-6 space-y-3">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block px-3 py-2 text-sm tracking-widest uppercase font-semibold border-l-2 transition-all duration-150',
                        isActive
                          ? 'text-[#C5A059] border-[#C5A059] bg-neutral-50'
                          : 'text-neutral-600 border-transparent hover:text-neutral-900 hover:bg-neutral-50'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3 px-3">
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center gap-2 px-4 py-3 bg-[#C5A059] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#A98443] rounded-full transition-colors text-center"
                  >
                    Contact on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
