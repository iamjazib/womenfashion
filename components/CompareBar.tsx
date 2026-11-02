"use client";

import React from "react";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { ArrowLeftRight, X, Trash2 } from "lucide-react";

export const CompareBar: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare, maxCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-neutral-950/95 text-white backdrop-blur-md rounded-2xl border border-white/20 p-3 sm:p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Left Info & Items */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          <div className="hidden sm:flex flex-col shrink-0">
            <span className="text-xs font-bold flex items-center gap-1.5 text-rose-400">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Compare
            </span>
            <span className="text-[10px] text-neutral-400">
              {compareItems.length}/{maxCompare} dresses
            </span>
          </div>

          {/* Product Thumbnails */}
          <div className="flex items-center gap-2 shrink-0">
            {compareItems.map((item) => (
              <div
                key={item.id}
                className="relative group w-11 h-13 sm:w-12 sm:h-15 rounded-lg overflow-hidden bg-neutral-800 border border-white/20 shrink-0"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80";
                  }}
                />
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-0.5 shadow-md transition-colors"
                  title="Remove from compare"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] font-bold text-center truncate px-0.5 text-neutral-200">
                  {item.brandName.split(" ")[0]}
                </div>
              </div>
            ))}

            {/* Empty slots placeholders */}
            {Array.from({ length: maxCompare - compareItems.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="w-11 h-13 sm:w-12 sm:h-15 rounded-lg border border-dashed border-neutral-700 flex items-center justify-center text-[10px] text-neutral-500 shrink-0"
              >
                +
              </div>
            ))}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Clear all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Compare Now ({compareItems.length})</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
