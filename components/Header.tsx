"use client";

import React from "react";
import Link from "next/link";
import { Search, Heart, ShieldCheck, ArrowLeftRight, Sparkles } from "lucide-react";
import { useCompare } from "@/context/CompareContext";

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  savedCount?: number;
  selectedCategory?: string;
  setSelectedCategory?: (cat: string) => void;
  totalDeals?: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery = "",
  setSearchQuery,
  savedCount = 0,
  selectedCategory = "all",
  setSelectedCategory,
  totalDeals = 235,
}) => {
  const { compareItems } = useCompare();

  const categories = [
    { id: "all", label: "All Sales" },
    { id: "unstitched", label: "Unstitched Lawn" },
    { id: "pret", label: "Ready to Wear (Pret)" },
    { id: "festive", label: "Festive & Luxury" },
    { id: "western", label: "Co-ords & Kurtis" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-neutral-950 text-white text-xs py-1.5 px-4 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-medium text-neutral-200">
              Women Fashion Live Radar:{" "}
              <span className="text-rose-400 font-semibold">{totalDeals}</span> active discounts tracked across Pakistani women's brands
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-neutral-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Price Drop Protection
            </span>
            <span>•</span>
            <span className="text-neutral-400">Updated every 3 hours</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo - Rebranded to Women Fashion */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif tracking-wider text-xl sm:text-2xl font-black text-neutral-950 uppercase">
                WOMEN <span className="text-rose-600">FASHION</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded">
                DEALS
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 -mt-0.5 font-medium">
              Pakistani Women's Clothing Tracker
            </span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg relative hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery?.(e.target.value)}
              placeholder="Search lawn, 3-piece, chiffon, pret, Gul Ahmed, Baroque..."
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white text-sm rounded-full border border-neutral-200 focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs"
            />
            {searchQuery && setSearchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 bg-neutral-200/60 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Navigation & Action Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Brands Directory Link */}
          <Link
            href="/brands"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-rose-600 transition-colors px-3 py-2 rounded-lg border border-neutral-200 hover:border-neutral-900"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Brands</span>
          </Link>

          {/* Compare Link */}
          <Link
            href="/compare"
            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors px-3 py-2 rounded-lg border ${
              compareItems.length > 0
                ? "bg-rose-50 text-rose-600 border-rose-300 shadow-xs"
                : "text-neutral-700 hover:text-rose-600 border-neutral-200 hover:border-neutral-900"
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Compare</span>
            {compareItems.length > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {compareItems.length}
              </span>
            )}
          </Link>

          {/* Wishlist Button */}
          <button
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-rose-600 transition-colors px-2.5 py-2 rounded-lg border border-neutral-200 hover:border-rose-200"
            title="Saved Items"
          >
            <Heart
              className={`w-4 h-4 ${
                savedCount > 0 ? "fill-rose-500 text-rose-500" : "text-neutral-500"
              }`}
            />
            <span className="hidden md:inline">Saved</span>
            {savedCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Centered) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-2.5 overflow-x-auto no-scrollbar border-t border-neutral-100 py-2 text-xs">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                if (setSelectedCategory) {
                  setSelectedCategory(cat.id);
                  const el = document.getElementById("catalog-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = `/#catalog-section`;
                }
              }}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-medium transition-all ${
                isActive
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
