'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  subtitleAbove?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  subtitleAbove = true,
  align = 'center',
  className,
}: SectionTitleProps) {
  const alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={cn('flex flex-col mb-10', alignmentClass[align], className)}>
      {subtitle && subtitleAbove && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-[0.25em] text-[#C5A059] font-semibold mb-2"
        >
          {subtitle}
        </motion.span>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-2xl md:text-4xl font-serif text-neutral-900 tracking-tight relative pb-4 font-medium"
      >
        {title}
        {/* Decorative gold double line in center or alignment */}
        <span
          className={cn(
            'absolute bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent w-24',
            align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'left' ? 'left-0' : 'right-0'
          )}
        />
        <span
          className={cn(
            'absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#C5A059] border border-white',
            align === 'center' ? 'block' : 'hidden'
          )}
        />
      </motion.h2>

      {subtitle && !subtitleAbove && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-neutral-500 mt-4 max-w-2xl font-light leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
