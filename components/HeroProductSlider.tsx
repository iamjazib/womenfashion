"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Product } from "@/types";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroProductSliderProps {
  products: Product[];
}

export const HeroProductSlider: React.FC<HeroProductSliderProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);
  const isMouseDown = useRef(false);

  // Take top 5 featured products
  const slides = React.useMemo(() => {
    return products.slice(0, 6);
  }, [products]);

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-slide every 10 seconds (10000 ms)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse drag handlers for desktop swipe
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDown.current = true;
    mouseStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current) return;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown.current || mouseStartX.current === null) return;
    const distance = mouseStartX.current - e.clientX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    isMouseDown.current = false;
    mouseStartX.current = null;
  };

  const handleMouseLeave = () => {
    isMouseDown.current = false;
    mouseStartX.current = null;
    setIsPaused(false);
  };

  if (slides.length === 0) return null;

  const currentDeal = slides[currentIndex];
  const savings = currentDeal.originalPrice - currentDeal.salePrice;

  return (
    <div
      className="w-full max-w-sm select-none relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 backdrop-blur-xl rounded-2xl border border-white/15 p-4 shadow-2xl relative overflow-hidden group hover:border-rose-500/50 transition-all duration-300 cursor-grab active:cursor-grabbing">
        
        {/* Spotlight Header with Slide Indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-rose-500/30">
            <Sparkles className="w-3 h-3 text-rose-400" />
            <span>Featured Deal ({currentIndex + 1}/{slides.length})</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
            Save Rs. {savings.toLocaleString()}
          </span>
        </div>

        {/* Featured Product Image with transition */}
        <div className="relative aspect-4/5 w-full rounded-xl overflow-hidden bg-neutral-800 mb-3.5">
          <img
            key={currentDeal.id}
            src={currentDeal.imageUrl}
            alt={currentDeal.title}
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80";
            }}
            className="w-full h-full object-cover object-top transition-all duration-700 ease-out animate-in fade-in"
          />

          {/* Floating Discount Tag */}
          <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-black text-sm px-2.5 py-1 rounded-lg shadow-xl">
            -{currentDeal.discountPct}% OFF
          </div>

          {/* Brand Tag */}
          <div className="absolute bottom-2.5 left-2.5 bg-neutral-950/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-md">
            {currentDeal.brandName}
          </div>

          {/* Navigation Arrows inside Card */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
            title="Previous deal"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
            title="Next deal"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Deal Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>{currentDeal.fabric || "Women's Collection"}</span>
            <span>{currentDeal.pieceCount || "Stitched"}</span>
          </div>
          <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-rose-400 transition-colors">
            {currentDeal.title}
          </h3>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black font-mono text-white">
                Rs. {currentDeal.salePrice.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400 line-through font-mono">
                Rs. {currentDeal.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-neutral-400">Swipe for more</span>
          </div>

          {/* Direct Buy Button */}
          <a
            href={`/go/${currentDeal.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md"
          >
            <span>View Deal on {currentDeal.brandName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Slider Dots / 10s Timer Indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-rose-500" : "w-1.5 bg-white/30 hover:bg-white/60"
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
