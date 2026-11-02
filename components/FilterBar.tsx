"use client";

import React from "react";
import {
  SlidersHorizontal,
  ArrowUpDown,
  ShieldCheck,
  Check,
  X,
  RotateCcw,
  Tag,
} from "lucide-react";

interface FilterBarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brandId: string) => void;
  minDiscount: number;
  setMinDiscount: (pct: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  sortBy: "discount-desc" | "price-asc" | "price-desc" | "newest";
  setSortBy: (sort: "discount-desc" | "price-asc" | "price-desc" | "newest") => void;
  onlyLowestEver: boolean;
  setOnlyLowestEver: (val: boolean) => void;
  pieceFilter: string;
  setPieceFilter: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalFiltered: number;
  totalDeals: number;
  onResetFilters: () => void;
  brandName?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  minDiscount,
  setMinDiscount,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onlyLowestEver,
  setOnlyLowestEver,
  pieceFilter,
  setPieceFilter,
  searchQuery,
  setSearchQuery,
  totalFiltered,
  totalDeals,
  onResetFilters,
  brandName,
}) => {
  const categories = [
    { id: "all", label: "All Categories" },
    { id: "unstitched", label: "Unstitched Lawn" },
    { id: "pret", label: "Ready-to-Wear (Pret)" },
    { id: "festive", label: "Festive & Luxury" },
    { id: "western", label: "Co-ords & Kurtis" },
  ];

  const discountTiers = [
    { label: "All Discounts", value: 0 },
    { label: "50%+ OFF", value: 50 },
    { label: "40%+ OFF", value: 40 },
    { label: "30%+ OFF", value: 30 },
  ];

  const pieceOptions = [
    { label: "All Pieces", value: "all" },
    { label: "3 Piece", value: "3 Piece" },
    { label: "2 Piece", value: "2 Piece" },
    { label: "1 Piece", value: "1 Piece" },
  ];

  const priceCaps = [
    { label: "Any Price", value: 100000 },
    { label: "Under Rs. 3,500", value: 3500 },
    { label: "Under Rs. 6,000", value: 6000 },
    { label: "Under Rs. 10,000", value: 10000 },
  ];

  // Active filters detection
  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    minDiscount > 0 ||
    maxPrice < 100000 ||
    pieceFilter !== "all" ||
    onlyLowestEver ||
    Boolean(searchQuery.trim());

  return (
    <div className="bg-white border-b border-neutral-200 shadow-2xs py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3.5">
        
        {/* Row 1: Category Filter Pills */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mr-1 hidden sm:inline">
              Category:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-neutral-950 text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Results count & Sort */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-neutral-500 font-medium">
              <strong className="text-neutral-900">{totalFiltered}</strong> of {totalDeals} items
            </span>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-50 text-xs font-semibold text-neutral-800 border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-neutral-900"
              >
                <option value="discount-desc">Biggest Discount %</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Secondary Filters (Discount, Pieces, Price Cap, Lowest Ever) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
          {/* Discount Tier Buttons */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            {discountTiers.map((tier) => (
              <button
                key={tier.value}
                onClick={() => setMinDiscount(tier.value)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                  minDiscount === tier.value
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

          {/* Piece Count Filter */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            {pieceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPieceFilter(opt.value)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  pieceFilter === opt.value
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Price Range Cap */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            {priceCaps.map((cap) => (
              <button
                key={cap.value}
                onClick={() => setMaxPrice(cap.value)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  maxPrice === cap.value
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {cap.label}
              </button>
            ))}
          </div>

          {/* Verified Lowest Price Toggle */}
          <button
            onClick={() => setOnlyLowestEver(!onlyLowestEver)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              onlyLowestEver
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
            }`}
          >
            <ShieldCheck
              className={`w-3.5 h-3.5 ${
                onlyLowestEver ? "text-emerald-600" : "text-neutral-400"
              }`}
            />
            <span>Verified Lowest Price</span>
            {onlyLowestEver && <Check className="w-3 h-3 text-emerald-600 ml-0.5" />}
          </button>
        </div>

        {/* Row 3: Active Filter Chips Bar (Visible when filters are active) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-neutral-400 font-medium">Applied Filters:</span>

            {/* Brand Chip */}
            {selectedBrand !== "all" && (
              <span className="inline-flex items-center gap-1 bg-neutral-900 text-white px-2.5 py-0.5 rounded-full font-semibold">
                <span>Brand: {brandName || selectedBrand}</span>
                <button
                  onClick={() => setSelectedBrand("all")}
                  className="hover:text-rose-400 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Category Chip */}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold">
                <span>
                  Category:{" "}
                  {categories.find((c) => c.id === selectedCategory)?.label ||
                    selectedCategory}
                </span>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="hover:text-rose-900 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Search Query Chip */}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold">
                <span>Keyword: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery("")}
                  className="hover:text-amber-950 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Discount Chip */}
            {minDiscount > 0 && (
              <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold">
                <span>{minDiscount}%+ OFF</span>
                <button
                  onClick={() => setMinDiscount(0)}
                  className="hover:text-rose-900 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Piece Chip */}
            {pieceFilter !== "all" && (
              <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded-full font-semibold">
                <span>{pieceFilter}</span>
                <button
                  onClick={() => setPieceFilter("all")}
                  className="hover:text-neutral-950 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Price Cap Chip */}
            {maxPrice < 100000 && (
              <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 border border-neutral-300 px-2.5 py-0.5 rounded-full font-semibold">
                <span>Max: Rs. {maxPrice.toLocaleString()}</span>
                <button
                  onClick={() => setMaxPrice(100000)}
                  className="hover:text-neutral-950 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Lowest Ever Chip */}
            {onlyLowestEver && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                <span>Lowest Price Only</span>
                <button
                  onClick={() => setOnlyLowestEver(false)}
                  className="hover:text-emerald-950 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Reset All Button */}
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-bold ml-2 underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
