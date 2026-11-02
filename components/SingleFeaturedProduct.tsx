"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Product } from "@/types";
import {
  Sparkles,
  ShieldCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  Check,
  ArrowLeftRight,
  Pause,
  Play,
} from "lucide-react";
import { useCompare } from "@/context/CompareContext";

interface SingleFeaturedProductProps {
  products: Product[];
  onOpenHistory: (product: Product) => void;
}

export const SingleFeaturedProduct: React.FC<SingleFeaturedProductProps> = ({
  products,
  onOpenHistory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isInCompare, toggleCompare } = useCompare();

  // If passed an empty list or single product fallback
  const list = products && products.length > 0 ? products : [];
  const activeProduct = list[currentIndex] || list[0];

  const SLIDE_INTERVAL_MS = 5000;
  const TICK_INTERVAL_MS = 50;

  // 5-second automatic slider timer with progress bar
  useEffect(() => {
    if (list.length <= 1) return;

    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % list.length);
          return 0;
        }
        return prev + (TICK_INTERVAL_MS / SLIDE_INTERVAL_MS) * 100;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [list.length, isPaused, currentIndex]);

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleSelectIndex = (index: number) => {
    setProgress(0);
    setCurrentIndex(index);
  };

  if (!activeProduct) return null;

  const savings = activeProduct.originalPrice - activeProduct.salePrice;
  const isCompared = isInCompare(activeProduct.id);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "unstitched":
        return "Unstitched Lawn";
      case "festive":
        return "Festive & Luxury";
      case "pret":
        return "Ready-to-Wear (Pret)";
      case "western":
        return "Co-ords & Kurtis";
      default:
        return "Designer Clearance";
    }
  };

  return (
    <section
      className="py-14 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white relative overflow-hidden border-b border-neutral-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative Background Lighting */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Featured Product Slider • All Categories Spotlight</span>
            <span className="text-neutral-400">|</span>
            <span className="text-amber-400 font-mono text-[11px]">Auto 5s</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white">
            Top Pakistani Women's Deals Across All Categories
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5">
            Switching every 5 seconds across unstitched lawn, festive luxury, daily pret, and budget co-ords.
          </p>
        </div>

        {/* Category Pill Navigation Tabs */}
        {list.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto no-scrollbar py-1">
            {list.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105"
                      : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-current"></span>
                  <span>{getCategoryLabel(item.category)}</span>
                  <span className="opacity-70 text-[10px]">({item.brandName.split(" ")[0]})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Slider Card Container */}
        <div className="relative bg-neutral-950/85 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* 5-Second Progress Countdown Bar at Card Top */}
          <div className="absolute top-0 inset-x-0 h-1 bg-white/10 rounded-t-3xl overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Slider Prev / Next Controls */}
          {list.length > 1 && (
            <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
              <span className="text-xs font-mono text-neutral-400 mr-2 hidden sm:inline">
                {isPaused ? (
                  <span className="inline-flex items-center gap-1 text-amber-400">
                    <Pause className="w-3 h-3" /> Paused
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <Play className="w-3 h-3" /> 5s Slide
                  </span>
                )}
                {" • "}
                {currentIndex + 1}/{list.length}
              </span>

              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
                title="Previous deal"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
                title="Next deal"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Active Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: High-Res Image Showcase */}
            <div className="lg:col-span-5 relative group">
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-neutral-850 shadow-2xl border border-white/10">
                <img
                  key={activeProduct.id}
                  src={activeProduct.imageUrl}
                  alt={activeProduct.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80";
                  }}
                  className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105 animate-in fade-in duration-500"
                />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <Link
                    href={`/brand/${activeProduct.brandId}`}
                    className="pointer-events-auto bg-neutral-950/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-white/20 hover:bg-rose-600 transition-colors"
                  >
                    {activeProduct.brandName}
                  </Link>
                  <span className="bg-rose-600 text-white font-black text-sm px-3 py-1 rounded-lg shadow-xl">
                    -{activeProduct.discountPct}% OFF
                  </span>
                </div>

                {/* Verified Lowest Price Floating Tag */}
                <div className="absolute bottom-4 left-4 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Lowest Price in 30 Days</span>
                </div>

                {/* Category Floating Tag */}
                <div className="absolute bottom-4 right-4 bg-neutral-900/90 backdrop-blur-md text-rose-300 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-rose-500/30">
                  {getCategoryLabel(activeProduct.category)}
                </div>
              </div>
            </div>

            {/* Right Column: In-Depth Product Specs & Price Action */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-rose-400 font-bold uppercase tracking-wider mb-2">
                  <Link
                    href={`/brand/${activeProduct.brandId}`}
                    className="hover:underline text-rose-300"
                  >
                    {activeProduct.brandName} Official Store
                  </Link>
                  <span>•</span>
                  <span>{activeProduct.pieceCount || "Stitched Ensemble"}</span>
                  <span>•</span>
                  <span>{activeProduct.fabric || "Premium Women's Fabric"}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">
                    Category: {getCategoryLabel(activeProduct.category)}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
                  {activeProduct.title}
                </h3>
              </div>

              {/* Price Callout Banner */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <div className="text-xs text-neutral-400 mb-0.5">Live Sale Price:</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                      Rs. {activeProduct.salePrice.toLocaleString()}
                    </span>
                    <span className="text-base text-neutral-400 line-through font-mono">
                      Rs. {activeProduct.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-400 mb-0.5">Total Savings:</div>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg font-bold text-sm">
                    <TrendingDown className="w-4 h-4" />
                    <span>
                      Save Rs. {savings.toLocaleString()} ({activeProduct.discountPct}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Features Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>100% Original Brand Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Zero Price Inflation Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Official Brand Delivery & Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>Category Deals Updated Live</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={`/go/${activeProduct.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm py-4 px-6 rounded-xl transition-all shadow-xl hover:shadow-rose-600/30"
                >
                  <span>Shop on {activeProduct.brandName}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => toggleCompare(activeProduct)}
                  className={`flex items-center justify-center gap-2 border font-semibold text-xs py-4 px-5 rounded-xl transition-all ${
                    isCompared
                      ? "bg-rose-600 text-white border-rose-600"
                      : "bg-white/10 hover:bg-white/20 border-white/20 text-neutral-200 hover:text-white"
                  }`}
                  title={isCompared ? "Remove from compare" : "Add to compare"}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>{isCompared ? "In Comparison" : "Compare"}</span>
                </button>

                <button
                  onClick={() => onOpenHistory(activeProduct)}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 hover:text-white font-semibold text-xs py-4 px-5 rounded-xl transition-all"
                >
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span>Price History</span>
                </button>
              </div>

              {/* Slider Dots Indicator */}
              {list.length > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5">
                    {list.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectIndex(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentIndex
                            ? "w-8 bg-rose-500"
                            : "w-2 bg-white/20 hover:bg-white/40"
                        }`}
                        title={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] text-neutral-400">
                    Hover to pause • Switches every 5 seconds
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
