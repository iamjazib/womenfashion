"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { Heart, ExternalLink, TrendingDown, Sparkles, ArrowLeftRight, Check } from "lucide-react";
import { useCompare } from "@/context/CompareContext";

interface ProductCardProps {
  product: Product;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenHistory: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSaved,
  onToggleSave,
  onOpenHistory,
}) => {
  const { isInCompare, toggleCompare } = useCompare();
  const compared = isInCompare(product.id);
  const savings = product.originalPrice - product.salePrice;

  return (
    <div className="group relative bg-white rounded-xl border border-neutral-200/90 overflow-hidden flex flex-col hover:shadow-xl hover:border-neutral-300 transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-neutral-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80";
          }}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 pointer-events-none">
          <div className="flex flex-col gap-1 pointer-events-auto">
            {/* Brand Badge with link to brand page */}
            <Link
              href={`/brand/${product.brandId}`}
              className="bg-neutral-900/90 hover:bg-neutral-800 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-xs transition-colors"
              title={`View all ${product.brandName} sales`}
            >
              {product.brandName}
            </Link>
            {/* Lowest Price Ever Badge */}
            {product.isLowestPrice && (
              <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[9px] font-bold tracking-tight px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
                Lowest Price
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Discount Badge */}
            <span className="bg-rose-600 text-white text-xs font-black px-2 py-1 rounded shadow-md">
              -{product.discountPct}%
            </span>
          </div>
        </div>

        {/* Action Icons Floating on Image (Wishlist & Compare) */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
          {/* Compare Button */}
          <button
            onClick={() => toggleCompare(product)}
            className={`p-2 rounded-full backdrop-blur-xs shadow-md transition-all ${
              compared
                ? "bg-rose-600 text-white"
                : "bg-white/90 text-neutral-700 hover:text-rose-600 hover:bg-white"
            }`}
            title={compared ? "Remove from comparison" : "Add to comparison"}
          >
            {compared ? (
              <Check className="w-4 h-4" />
            ) : (
              <ArrowLeftRight className="w-4 h-4" />
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onToggleSave(product.id)}
            className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-neutral-700 hover:text-rose-600 shadow-md transition-colors"
            title="Save deal"
          >
            <Heart
              className={`w-4 h-4 ${
                isSaved ? "fill-rose-600 text-rose-600" : "text-neutral-600"
              }`}
            />
          </button>
        </div>

        {/* Quick Fabric Tag */}
        {product.fabric && (
          <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium">
            {product.fabric}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Piece Count & Category */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1 font-medium">
            <span className="uppercase tracking-wider font-semibold text-neutral-600">
              {product.pieceCount || product.category}
            </span>
            <button
              onClick={() => onOpenHistory(product)}
              className="text-neutral-400 hover:text-emerald-700 flex items-center gap-1 hover:underline text-[10px] font-semibold"
            >
              <TrendingDown className="w-3 h-3 text-emerald-600" />
              Price History
            </button>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Action Area */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100">
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-neutral-950 font-mono tracking-tight">
                Rs. {product.salePrice.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-400 line-through font-mono">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
              Save Rs. {savings.toLocaleString()}
            </span>
          </div>

          {/* Direct Outbound Link through /go/[id] */}
          <a
            href={`/go/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 bg-neutral-950 hover:bg-rose-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors shadow-2xs mt-1"
          >
            <span>Shop on {product.brandName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
