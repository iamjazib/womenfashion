"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { BRANDS } from "@/data/brands";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export const BrandMarqueeSection: React.FC = () => {
  // Loop through all 10 listed brand logos seamlessly
  const marqueeBrands = useMemo(() => {
    // Repeat the 10 brands 3 times for a completely gap-free infinite scroll
    return [...BRANDS, ...BRANDS, ...BRANDS];
  }, []);

  return (
    <section className="bg-gradient-to-b from-neutral-50/80 via-white to-neutral-50/80 border-y border-neutral-200/90 py-7 overflow-hidden relative">
      {/* Top Header Label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            <Sparkles className="w-3 h-3 animate-pulse" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span>Official Brand Storefronts</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> 10 Verified Pakistani Brands
              </span>
            </h3>
          </div>
        </div>

        <Link
          href="/#catalog-section"
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group transition-colors"
        >
          <span>Explore All Brand Sales</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Infinite Logo Marquee Track Container with gradient fade masks */}
      <div className="relative w-full overflow-hidden group">
        {/* Left Gradient Edge Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />

        {/* Right Gradient Edge Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />

        {/* Continuous Auto-Scrolling Track (Pauses on user hover) */}
        <div className="flex items-center gap-4 sm:gap-6 animate-marquee group-hover:[animation-play-state:paused] w-max py-2 px-4">
          {marqueeBrands.map((brand, idx) => (
            <Link
              key={`${brand.id}-${idx}`}
              href={`/brand/${brand.slug}`}
              className="group/brand flex items-center gap-3.5 bg-white hover:bg-neutral-50/90 border border-neutral-200 hover:border-neutral-950 px-5 py-3 rounded-2xl shadow-2xs hover:shadow-md transition-all shrink-0 cursor-pointer min-w-[190px] sm:min-w-[210px] h-18 sm:h-20"
              title={`View ${brand.name} Clearance & Sales`}
            >
              {/* Brand Website Official Logo */}
              <div className="w-24 sm:w-28 h-10 sm:h-12 flex items-center justify-center p-1 relative shrink-0">
                <img
                  src={brand.logo}
                  alt={`${brand.name} official website logo`}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain filter group-hover/brand:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    // Fallback to stylized text badge if logo file cannot be parsed
                    const target = e.currentTarget;
                    target.style.display = "none";
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<span class="font-serif font-black text-xs sm:text-sm tracking-wider text-neutral-900">${brand.name}</span>`;
                    }
                  }}
                />
              </div>

              {/* Brand Details */}
              <div className="flex flex-col justify-center border-l border-neutral-100 pl-3">
                <span className="font-serif font-bold text-xs sm:text-sm text-neutral-900 group-hover/brand:text-rose-600 transition-colors line-clamp-1">
                  {brand.name}
                </span>
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  {brand.totalDeals} Deals
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
};
