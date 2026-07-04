'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

interface OrderSuccessPopupProps {
  onClose: () => void;
  logoSrc?: string;
}

export default function OrderSuccessPopup({
  onClose,
  logoSrc = '/logo/logo.png',
}: OrderSuccessPopupProps) {
  const [entered, setEntered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(enterTimer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 400);
  };

  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center bg-neutral-950/95 backdrop-blur-md transition-opacity duration-400 ${
        isClosing ? 'opacity-0' : entered ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Order confirmation"
    >
      {/* Glow layer */}
      <div
        className={`absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[#C5A059]/25 blur-[100px] transition-all duration-700 ${
          isClosing ? 'scale-75 opacity-0' : entered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      />

      <div
        className={`relative mx-4 flex flex-col items-center gap-6 overflow-hidden rounded-md border border-[#C5A059]/50 bg-gradient-to-b from-neutral-900 to-neutral-950 px-8 py-12 sm:px-14 sm:py-14 text-center shadow-[0_0_60px_-10px_rgba(197,160,89,0.35)] transition-all duration-500 ${
          isClosing
            ? 'scale-90 opacity-0 translate-y-4'
            : entered
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-90 opacity-0 translate-y-4'
        }`}
      >
        <span className="absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-[#C5A059]/70" />
        <span className="absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-[#C5A059]/70" />
        <span className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-[#C5A059]/70" />
        <span className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-[#C5A059]/70" />

        <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1.5px,transparent_1.5px)] [background-size:22px_22px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Logo */}
          <div
            className={`relative h-16 w-16 sm:h-20 sm:w-20 transition-transform duration-700 ${
              entered ? 'scale-100 rotate-0' : 'scale-50 rotate-12'
            }`}
          >
            <Image
              src={logoSrc}
              alt="Grand Emaar Logo"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>

          {/* Success check */}
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 transition-all delay-100 duration-500 ${
              entered ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <CheckCircle2 className="w-7 h-7 text-[#C5A059]" />
          </div>

          {/* Text */}
          <div
            className={`space-y-2 transition-all delay-150 duration-700 ${
              entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Thank You!
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-xs mx-auto">
              Your order has been submitted successfully.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="mt-2 px-8 py-3 bg-[#C5A059] hover:bg-[#A98443] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}