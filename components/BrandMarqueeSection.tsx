"use client";

import React from "react";
import Link from "next/link";
import { BRANDS } from "@/data/brands";
import { INITIAL_PRODUCTS } from "@/data/products";
import { Sparkles, ArrowRight } from "lucide-react";

export const BrandMarqueeSection: React.FC = () => {
  // Duplicate array 3 times for a continuous seamless marquee effect
  const marqueeItems = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section className="bg-white border-y border-neutral-200 py-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-800">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>Official Brand Partners Tracked Live ({BRANDS.length})</span>
        </div>
        <Link
          href="/brands"
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
        >
          <span>View All Brand Directories</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Marquee Track Container with gradient edge masks */}
      <div className="relative w-full overflow-hidden group">
        {/* Left Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Right Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Inner Track */}
        <div className="flex items-center gap-4 sm:gap-6 animate-marquee group-hover:[animation-play-state:paused] w-max py-2">
          {marqueeItems.map((brand, idx) => {
            const productCount = INITIAL_PRODUCTS.filter((p) => p.brandId === brand.id).length;

            return (
              <Link
                key={`${brand.id}-${idx}`}
                href={`/brand/${brand.slug || brand.id}`}
                className="flex items-center gap-3 bg-neutral-50 hover:bg-white border border-neutral-200/90 hover:border-neutral-900 px-4 py-2.5 rounded-2xl shadow-2xs hover:shadow-md transition-all shrink-0 group/card"
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-neutral-200 shrink-0 flex items-center justify-center p-0.5 shadow-2xs">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover rounded-lg group-hover/card:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-serif font-black text-xs sm:text-sm text-neutral-900 tracking-tight group-hover/card:text-rose-600 transition-colors whitespace-nowrap">
                    {brand.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {productCount} live deals
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
      `}</style>
    </section>
  );
};
