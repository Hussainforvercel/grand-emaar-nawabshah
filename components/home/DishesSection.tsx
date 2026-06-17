'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowRight, Flame, Star, Utensils } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';

export default function DishesSection() {
  const dishes = [
    {
      name: 'Chicken Karahi',
      category: 'Pakistani Special',
      price: 'Rs. 1,499',
      image: '/images/dishes/chicken-karahi.jpg',
      desc: 'Traditional spicy chicken karahi cooked with fresh tomatoes, green chilies, and signature spices.',
      tag: 'Chef Special',
    },
    {
      name: 'BBQ Platter',
      category: 'BBQ & Grill',
      price: 'Rs. 2,499',
      image: '/images/dishes/bbq-platter.jpg',
      desc: 'A premium platter with seekh kabab, malai boti, tikka, and grilled BBQ flavors.',
      tag: 'Most Loved',
    },
    {
      name: 'Chicken Biryani',
      category: 'Rice Special',
      price: 'Rs. 599',
      image: '/images/dishes/chicken-biryani.jpg',
      desc: 'Aromatic basmati rice layered with tender chicken and rich traditional spices.',
      tag: 'Popular',
    },
    {
      name: 'Chinese Chowmein',
      category: 'Chinese Cuisine',
      price: 'Rs. 899',
      image: '/images/dishes/chowmein.jpg',
      desc: 'Fresh noodles tossed with vegetables, chicken, and flavorful Chinese sauces.',
      tag: 'Fresh Taste',
    },
    {
      name: 'Zinger Burger',
      category: 'Fast Food',
      price: 'Rs. 699',
      image: '/images/dishes/zinger-burger.jpg',
      desc: 'Crispy chicken fillet served with fresh lettuce, sauces, and soft premium bun.',
      tag: 'Crispy',
    },
    {
      name: 'Club Sandwich',
      category: 'Snacks',
      price: 'Rs. 799',
      image: '/images/dishes/club-sandwich.jpg',
      desc: 'Layered sandwich with chicken, egg, cheese, fresh vegetables, and creamy sauces.',
      tag: 'Light Meal',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#FDFCF9] py-24 border-b border-neutral-100">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-[#C5A059]/10 blur-3xl" />
        <div className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-neutral-900/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-[#C5A059]/25 bg-white/80 px-4 py-2 shadow-sm backdrop-blur"
        >
          <Utensils className="h-4 w-4 text-[#C5A059]" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-700">
            Signature Menu
          </span>
        </motion.div>

        <SectionTitle
          title="Our Popular Dishes"
          subtitle="Taste of Grand Emaar"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mx-auto -mt-4 mb-14 max-w-2xl text-center text-sm sm:text-base text-neutral-500 leading-relaxed"
        >
          Discover our most loved dishes prepared with fresh ingredients,
          rich flavors, and premium hospitality standards.
        </motion.p>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[#C5A059]/40 hover:shadow-[0_25px_70px_rgba(197,160,89,0.16)]"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-neutral-100">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Tag */}
                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-900 shadow-sm backdrop-blur">
                  <Flame className="h-3.5 w-3.5 text-[#C5A059]" />
                  {dish.tag}
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4 rounded-full bg-[#C5A059] px-4 py-2 text-sm font-semibold text-white shadow-md">
                  {dish.price}
                </div>

                {/* Category */}
                <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                  {dish.category}
                </div>
              </div>

              {/* Content */}
              <div className="relative p-7">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="font-serif text-xl font-semibold text-neutral-950 transition-colors duration-300 group-hover:text-[#C5A059]">
                    {dish.name}
                  </h3>

                  <div className="flex items-center gap-1 text-[#C5A059]">
                    <Star className="h-4 w-4 fill-[#C5A059]" />
                    <span className="text-sm font-medium text-neutral-800">
                      4.9
                    </span>
                  </div>
                </div>

                <p className="mb-6 text-sm leading-7 text-neutral-500">
                  {dish.desc}
                </p>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-5">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                    Grand Emaar
                  </span>

                  <button className="group/btn flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-[#C5A059]">
                    Order Now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-16 overflow-hidden rounded-2xl bg-neutral-950 p-8 text-center shadow-xl sm:p-10"
        >
          <h3 className="font-serif text-2xl font-semibold text-white sm:text-3xl">
            Want to Explore the Full Menu?
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-neutral-300">
            Contact Grand Emaar on WhatsApp for complete menu details, food
            availability, family sitting, catering, and room booking queries.
          </p>

          <a
            href="https://wa.me/923000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#C5A059] px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-neutral-950"
          >
            View Full Menu on WhatsApp
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}