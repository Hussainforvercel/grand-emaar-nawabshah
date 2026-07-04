"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface WelcomePopupProps {
  /** Kitni der (milliseconds) popup dikhega. Default 5000ms = 5 seconds */
  duration?: number;
  /** Logo image ka path (public folder ke andar). Default /logo/logo.png */
  logoSrc?: string;
}

export default function WelcomePopup({
  duration = 5000,
  logoSrc = "/logo/logo.png",
}: WelcomePopupProps) {
  const [visible, setVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [entered, setEntered] = useState(false);

  // Thora delay se entrance animation trigger karo (smooth pop-in)
  useEffect(() => {
    const enterTimer = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(enterTimer);
  }, []);

  // Auto-close after `duration`
  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => setVisible(false), 600);
    }, duration);

    return () => clearTimeout(closeTimer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/95 backdrop-blur-md transition-opacity duration-600 ${
        isClosing ? "opacity-0" : entered ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome popup"
    >
      {/* Glow layer behind card */}
      <div
        className={`absolute h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-[#C5A059]/25 blur-[100px] transition-all duration-700 ${
          isClosing
            ? "scale-75 opacity-0"
            : entered
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0"
        }`}
      />

      <div
        className={`relative mx-4 flex flex-col items-center gap-6 overflow-hidden rounded-md border border-[#C5A059]/50 bg-gradient-to-b from-neutral-900 to-neutral-950 px-8 py-12 sm:px-16 sm:py-16 text-center shadow-[0_0_60px_-10px_rgba(197,160,89,0.35)] transition-all duration-500 ${
          isClosing
            ? "scale-90 opacity-0 translate-y-4"
            : entered
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-90 opacity-0 translate-y-4"
        }`}
      >
        {/* Corner accents */}
        <span className="absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-[#C5A059]/70" />
        <span className="absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-[#C5A059]/70" />
        <span className="absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-[#C5A059]/70" />
        <span className="absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-[#C5A059]/70" />

        {/* Decorative dotted background */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1.5px,transparent_1.5px)] [background-size:22px_22px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Logo with glowing ring */}
          {/* Logo */}
          <div
            className={`relative h-28 w-28 sm:h-32 sm:w-32 transition-transform duration-700 ${
              entered ? "scale-100 rotate-0" : "scale-50 rotate-12"
            }`}
          >
            <Image
              src={logoSrc}
              alt="Grand Emaar Logo"
              fill
              sizes="128px"
              className="object-contain"
              priority
            />
          </div>

          {/* Welcome text */}
          <div
            className={`space-y-3 transition-all delay-150 duration-700 ${
              entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#C5A059] via-[#E8CD8F] to-[#C5A059] bg-clip-text text-transparent">
                Grand Emaar
              </span>
            </h2>

            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#C5A059]/50" />
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#C5A059] font-mono">
                Nawabshah
              </p>
              <span className="h-px w-8 bg-[#C5A059]/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
