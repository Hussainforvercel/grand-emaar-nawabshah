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
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Stop background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/rooms', label: 'Rooms' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const whatsAppLink = getWhatsAppLink(
    'Hello Grand Emaar Hotel, I want to ask about your services.'
  );

  return (
    <>
      {/* Top micro-bar for contact info */}
      <div className="bg-neutral-900 text-[#C5A059] text-xs py-2 px-4 md:px-8 flex justify-between items-center border-b border-[#C5A059]/10 transition-all duration-300">
        <div className="flex items-center gap-1.5 font-light min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline truncate">
            Opposite H.M Khoja Tower, Nawabshah
          </span>
          <span className="sm:hidden inline truncate">Nawabshah, Pakistan</span>
        </div>

        <div className="flex items-center gap-4 font-mono shrink-0">
          <span>Call: +92 308 2077721</span>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 bg-white transition-all duration-300 w-full border-b',
          scrolled
            ? 'shadow-md py-1 border-neutral-100 bg-white/95 backdrop-blur-md'
            : 'py-3 border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo area */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo/logo.png"
                alt="Grand Emaar Logo"
                className="h-14 sm:h-16 w-auto object-contain"
              />
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
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Action */}
            <div className="hidden lg:flex items-center gap-4">
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
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(true)}
                className="text-neutral-700 hover:text-[#C5A059] focus:outline-none p-1.5 rounded"
                aria-label="Open Menu"
                type="button"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full Screen Right Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dark overlay */}
            <button
              type="button"
              aria-label="Close Menu Overlay"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50"
            />

            {/* Right side drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="absolute right-0 top-0 h-screen w-full bg-white shadow-2xl overflow-y-auto"
            >
              <div className="min-h-screen flex flex-col">
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-100">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <img
                      src="/logo/logo.png"
                      alt="Grand Emaar Logo"
                      className="h-14 w-auto object-contain"
                    />
                  </Link>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-800 hover:bg-[#C5A059] hover:text-white transition-colors"
                    aria-label="Close Menu"
                    type="button"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Drawer Links */}
                <nav className="flex-1 px-5 py-8">
                  <div className="space-y-3">
                    {navLinks.map((link, index) => {
                      const isActive = pathname === link.href;

                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * index }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              'flex items-center justify-between w-full px-5 py-4 rounded-2xl text-base tracking-widest uppercase font-semibold transition-all duration-200 border',
                              isActive
                                ? 'text-[#C5A059] border-[#C5A059]/30 bg-[#C5A059]/10'
                                : 'text-neutral-700 border-neutral-100 bg-neutral-50 hover:text-[#C5A059] hover:border-[#C5A059]/30'
                            )}
                          >
                            {link.label}
                            <span className="text-lg">→</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-100">
                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-center items-center gap-2 px-5 py-4 bg-[#C5A059] text-white text-xs uppercase font-bold tracking-widest hover:bg-[#A98443] rounded-full transition-colors text-center"
                    >
                      Contact on WhatsApp
                    </a>
                  </div>
                </nav>

                {/* Drawer Footer */}
                <div className="px-5 py-5 border-t border-neutral-100 bg-neutral-50">
                  <div className="flex items-start gap-2 text-xs text-neutral-500">
                    <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <p>Opposite H.M Khoja Tower, Nawabshah, Pakistan</p>
                  </div>

                  <p className="mt-3 text-xs font-semibold text-neutral-700">
                    Call: +92 308 2077721
                  </p>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}