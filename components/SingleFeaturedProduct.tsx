"use client";

import React from "react";
import { Product } from "@/types";
import { Sparkles, ShieldCheck, ExternalLink, ArrowRight, TrendingDown, Clock, Check } from "lucide-react";

interface SingleFeaturedProductProps {
  product: Product;
  onOpenHistory: (product: Product) => void;
}

export const SingleFeaturedProduct: React.FC<SingleFeaturedProductProps> = ({
  product,
  onOpenHistory,
}) => {
  if (!product) return null;

  const savings = product.originalPrice - product.salePrice;

  return (
    <section className="py-14 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white relative overflow-hidden border-b border-neutral-800">
      {/* Decorative Background Lighting */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Spotlight Deal of the Day
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white">
            Today's #1 Picked Luxury Women's Deal
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Our automated scanner flagged this genuine discount with maximum savings and verified price history.
          </p>
        </div>

        {/* Featured Deal Card Container */}
        <div className="bg-neutral-950/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: High-Res Image Showcase */}
            <div className="lg:col-span-5 relative group">
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-neutral-800 shadow-2xl border border-white/10">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80";
                  }}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="bg-neutral-950/90 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-white/20">
                    {product.brandName}
                  </span>
                  <span className="bg-rose-600 text-white font-black text-sm px-3 py-1 rounded-lg shadow-xl">
                    -{product.discountPct}% OFF
                  </span>
                </div>

                {/* Verified Lowest Price Floating Tag */}
                <div className="absolute bottom-4 left-4 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Lowest Price in 30 Days</span>
                </div>
              </div>
            </div>

            {/* Right Column: In-Depth Product Specs & Price Action */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-3 text-xs text-rose-400 font-bold uppercase tracking-wider mb-2">
                  <span>{product.brandName} Official Store</span>
                  <span>•</span>
                  <span>{product.pieceCount || "Stitched Suit"}</span>
                  <span>•</span>
                  <span>{product.fabric || "Premium Women's Fabric"}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
                  {product.title}
                </h3>
              </div>

              {/* Price Callout Banner */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <div className="text-xs text-neutral-400 mb-0.5">Sale Price:</div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                      Rs. {product.salePrice.toLocaleString()}
                    </span>
                    <span className="text-base text-neutral-400 line-through font-mono">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-400 mb-0.5">Your Savings:</div>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg font-bold text-sm">
                    <TrendingDown className="w-4 h-4" />
                    <span>Save Rs. {savings.toLocaleString()} ({product.discountPct}%)</span>
                  </div>
                </div>
              </div>

              {/* Key Features Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>100% Original Brand Guaranteed</span>
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
                  <span>Automated Stock Monitoring</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href={`/go/${product.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm py-4 px-6 rounded-xl transition-all shadow-xl hover:shadow-rose-600/30"
                >
                  <span>Shop on {product.brandName} Official Store</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={() => onOpenHistory(product)}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 hover:text-white font-semibold text-xs py-4 px-5 rounded-xl transition-all"
                >
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span>View Price History</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
