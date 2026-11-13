"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { BRANDS } from "@/data/brands";
import { INITIAL_PRODUCTS } from "@/data/products";
import { Sparkles, ArrowRight, Tag } from "lucide-react";

export const BrandMarqueeSection: React.FC = () => {
  // Select top verified sales items across all 10 brands to showcase real products & names
  const marqueeProducts = useMemo(() => {
    const selected: typeof INITIAL_PRODUCTS = [];
    const brandIds = BRANDS.map((b) => b.id);

    // Pick top 2 high-discount products from each brand
    for (const bId of brandIds) {
      const brandMatches = INITIAL_PRODUCTS.filter(
        (p) => p.brandId === bId && p.imageUrl && p.title
      ).sort((a, b) => b.discountPct - a.discountPct);

      if (brandMatches.length > 0) {
        selected.push(...brandMatches.slice(0, 2));
      }
    }

    // Duplicate array twice for seamless continuous infinite scroll
    return [...selected, ...selected];
  }, []);

  return (
    <section className="bg-white border-y border-neutral-200 py-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-800">
          <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Live Featured Deals Across All 10 Brand Stores</span>
        </div>
        <Link
          href="/#catalog-section"
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
        >
          <span>Explore All 260+ Sales</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Marquee Track Container with gradient edge fade masks */}
      <div className="relative w-full overflow-hidden group">
        {/* Left Edge Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Right Edge Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Inner Track (Pauses on Hover) */}
        <div className="flex items-center gap-4 sm:gap-6 animate-marquee group-hover:[animation-play-state:paused] w-max py-2">
          {marqueeProducts.map((product, idx) => (
            <a
              key={`${product.id}-${idx}`}
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 bg-neutral-50 hover:bg-white border border-neutral-200/90 hover:border-neutral-900 p-2.5 sm:p-3 rounded-2xl shadow-2xs hover:shadow-lg transition-all shrink-0 group/card cursor-pointer"
            >
              {/* Product Image from Brand Website */}
              <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 relative">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover/card:scale-108 transition-transform duration-300"
                />
              </div>

              {/* Product Name & Brand Details */}
              <div className="flex flex-col justify-center max-w-[170px] sm:max-w-[210px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 truncate">
                    {product.brandName}
                  </span>
                  <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-black px-1.5 py-0.2 rounded shrink-0">
                    {product.discountPct}% OFF
                  </span>
                </div>

                {/* Product Name */}
                <h4 className="font-serif font-bold text-xs sm:text-sm text-neutral-950 line-clamp-1 group-hover/card:text-rose-600 transition-colors">
                  {product.title}
                </h4>

                {/* Prices */}
                <div className="flex items-center gap-1.5 mt-1 font-mono text-xs">
                  <span className="font-bold text-neutral-900">
                    Rs. {product.salePrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
};
