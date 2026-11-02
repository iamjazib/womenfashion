"use client";

import React, { useState } from "react";
import { Search, Flame, ArrowRight, Zap, Tag, ShieldCheck } from "lucide-react";
import { Product } from "@/types";
import { StackedCardShuffle } from "@/components/StackedCardShuffle";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectCategory: (cat: string) => void;
  onSelectMinDiscount: (pct: number) => void;
  onSelectBrand: (brandId: string) => void;
  products: Product[];
  totalDeals: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  onSelectMinDiscount,
  onSelectBrand,
  products,
  totalDeals,
}) => {
  const [internalQuery, setInternalQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(internalQuery);
    const el = document.getElementById("catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const trendingTags = [
    { label: "🔥 Flat 50% OFF", action: () => onSelectMinDiscount(50) },
    { label: "3-Piece Lawn", action: () => setSearchQuery("3 Piece") },
    { label: "Asim Jofa Wedding", action: () => onSelectBrand("asimjofa") },
    { label: "Baroque Chiffon", action: () => onSelectBrand("baroque") },
    { label: "Gul Ahmed Pret", action: () => onSelectBrand("gulahmed") },
    { label: "Under Rs. 3,500", action: () => setSearchQuery("2 Piece") },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-[#180911] to-neutral-950 text-white pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-rose-950/40">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/3"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Search */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Pulsing Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span className="tracking-wide uppercase text-[11px]">
                WOMEN FASHION RADAR • {totalDeals} Verified Women's Clothing Discounts
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight leading-[1.15] text-white">
                Pakistani Women's Fashion Sales. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200">
                  All Brands In One Luxury Radar.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl pt-1">
                Stop jumping between 20 brand tabs. Find real-time verified price drops across <strong className="text-white font-semibold">Gul Ahmed, Baroque, Asim Jofa, Limelight, Sana Safinaz, Junaid Jamshed, Alkaram Studio, and Zellbury</strong>.
              </p>
            </div>

            {/* High-Impact Hero Search Box */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <div className="flex items-center bg-white/10 hover:bg-white/15 focus-within:bg-white/20 backdrop-blur-xl border border-white/20 focus-within:border-rose-400/80 rounded-2xl p-1.5 transition-all shadow-2xl">
                <div className="pl-3.5 pr-2 text-rose-300">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={internalQuery}
                  onChange={(e) => {
                    setInternalQuery(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Search women's 3-piece lawn, chiffon, schiffli, kurta, brand..."
                  className="w-full bg-transparent text-white placeholder-neutral-400 text-sm sm:text-base px-2 py-2.5 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-lg flex items-center gap-1.5 shrink-0"
                >
                  <span>Search Sales</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Filter Tag Chips */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Trending Collections:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {trendingTags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      tag.action();
                      const el = document.getElementById("catalog-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs bg-white/5 hover:bg-white/15 border border-white/10 hover:border-rose-400/40 text-neutral-200 hover:text-white px-3 py-1.5 rounded-full transition-all font-medium flex items-center gap-1"
                  >
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-2 grid grid-cols-3 gap-2 sm:gap-4 border-t border-white/10 max-w-xl text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] leading-tight">Zero Fake Markups</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] leading-tight">Hourly Auto-Scanned</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-[11px] leading-tight">Direct Brand Checkout</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Stacked Card Shuffle Deck */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <StackedCardShuffle products={products} />
          </div>

        </div>
      </div>
    </section>
  );
};
