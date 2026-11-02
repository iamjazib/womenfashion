"use client";

import React from "react";
import { Product } from "@/types";
import { Sparkles, Flame, ArrowRight, ExternalLink } from "lucide-react";

interface FeaturedDealsSectionProps {
  products: Product[];
  onOpenHistory: (product: Product) => void;
  onToggleSave: (id: string) => void;
  savedIds: string[];
}

export const FeaturedDealsSection: React.FC<FeaturedDealsSectionProps> = ({
  products,
  onOpenHistory,
  onToggleSave,
  savedIds,
}) => {
  // Select top 4-6 highest discount items from different brands
  const featured = React.useMemo(() => {
    const brandSeen = new Set<string>();
    const selected: Product[] = [];

    // Sort by discount % descending
    const sorted = [...products].sort((a, b) => b.discountPct - a.discountPct);

    for (const p of sorted) {
      if (!brandSeen.has(p.brandId) && p.imageUrl) {
        brandSeen.add(p.brandId);
        selected.push(p);
      }
      if (selected.length >= 4) break;
    }

    return selected;
  }, [products]);

  if (featured.length === 0) return null;

  return (
    <section className="py-12 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              Flash Sale Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 tracking-tight">
              Featured Women's Fashion Discounts
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Handpicked biggest verified markdowns across Pakistan's top designer houses today.
            </p>
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 shrink-0">
            Up to 50% Verified OFF
          </span>
        </div>

        {/* 4-Card Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item) => {
            const savings = item.originalPrice - item.salePrice;
            return (
              <div
                key={item.id}
                className="group relative bg-neutral-50 hover:bg-white rounded-2xl border border-neutral-200 hover:border-neutral-900 p-3 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                {/* Image Wrap */}
                <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-neutral-200 mb-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80";
                    }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating Discount Tag */}
                  <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                    -{item.discountPct}% OFF
                  </div>
                  {/* Brand Tag */}
                  <div className="absolute bottom-2.5 left-2.5 bg-neutral-950/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-xs">
                    {item.brandName}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span className="font-semibold text-neutral-600 uppercase tracking-wider">
                        {item.pieceCount || item.category}
                      </span>
                      <button
                        onClick={() => onOpenHistory(item)}
                        className="text-emerald-700 hover:underline font-medium text-[10px]"
                      >
                        Price History
                      </button>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors mb-2">
                      {item.title}
                    </h3>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-2 border-t border-neutral-200/70">
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black font-mono text-neutral-950">
                          Rs. {item.salePrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-neutral-400 line-through font-mono">
                          Rs. {item.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                        Save Rs. {savings.toLocaleString()}
                      </span>
                    </div>

                    <a
                      href={`/go/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 bg-neutral-950 group-hover:bg-rose-600 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-2xs"
                    >
                      <span>Shop on {item.brandName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
