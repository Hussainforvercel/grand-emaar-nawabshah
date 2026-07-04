'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu as MenuIcon, X, MapPin, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface NavbarProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export default function Navbar({ cartCount = 0, onCartClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

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
      <div className="bg-neutral-900 text-[#C5A059] text-xs py-2 px-4 md:px-8 flex justify-between items-center border-b border-[#C5A059]/10">
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
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo/logo.png"
                alt="Grand Emaar Logo"
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </Link>

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
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <button
                type="button"
                onClick={onCartClick}
                className="relative w-11 h-11 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-[#C5A059] hover:border-[#C5A059]"
              >
                <ShoppingBag className="w-5 h-5" />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-[#C5A059] hover:bg-[#A98443] rounded-full"
              >
                WhatsApp Book
              </a>
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={onCartClick}
                className="relative w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5" />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C5A059] text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsOpen(true)}
                className="text-neutral-700 hover:text-[#C5A059] p-1.5 rounded"
                type="button"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-screen w-full bg-white shadow-2xl overflow-y-auto"
            >
              <div className="min-h-screen flex flex-col">
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
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-100"
                    type="button"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex-1 px-5 py-8">
                  <div className="space-y-3">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center justify-between w-full px-5 py-4 rounded-2xl text-base tracking-widest uppercase font-semibold border',
                            isActive
                              ? 'text-[#C5A059] border-[#C5A059]/30 bg-[#C5A059]/10'
                              : 'text-neutral-700 border-neutral-100 bg-neutral-50'
                          )}
                        >
                          {link.label}
                          <span>→</span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-neutral-100 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onCartClick?.();
                      }}
                      className="w-full flex justify-center items-center gap-2 px-5 py-4 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest rounded-full"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      View Bucket ({cartCount})
                    </button>

                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-center items-center gap-2 px-5 py-4 bg-[#C5A059] text-white text-xs uppercase font-bold tracking-widest rounded-full"
                    >
                      Contact on WhatsApp
                    </a>
                  </div>
                </nav>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}