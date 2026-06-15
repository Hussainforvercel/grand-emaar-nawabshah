'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'black' | 'white' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  className,
  variant = 'gold',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none rounded-sm cursor-pointer select-none';
  
  const variants = {
    gold: 'bg-[#C5A059] hover:bg-[#A98443] text-white shadow-md active:shadow-sm hover:scale-[1.01]',
    black: 'bg-neutral-900 hover:bg-neutral-800 text-[#C5A059] border border-[#C5A059]/20 shadow-md hover:scale-[1.01]',
    white: 'bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 hover:scale-[1.01]',
    outline: 'border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-colors duration-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs md:text-sm tracking-wider',
    md: 'px-5 py-2.5 text-sm md:text-base tracking-wider font-semibold',
    lg: 'px-8 py-3.5 text-base md:text-lg tracking-widest uppercase font-bold',
  };

  const buttonContent = (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      {buttonContent}
    </motion.div>
  );
}
