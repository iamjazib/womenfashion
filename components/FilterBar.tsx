"use client";

import React from "react";
import { SlidersHorizontal, ArrowUpDown, ShieldCheck, Check } from "lucide-react";

interface FilterBarProps {
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
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
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
  totalFiltered,
}) => {
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
    { label: "1 Piece / Kurti", value: "1 Piece" },
  ];

  return (
    <div className="bg-neutral-50 border-b border-neutral-200/80 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left Side: Discount Filters & Piece Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Discount Tier Buttons */}
          <div className="flex items-center bg-white p-0.5 rounded-lg border border-neutral-200 shadow-2xs">
            {discountTiers.map((tier) => (
              <button
                key={tier.value}
                onClick={() => setMinDiscount(tier.value)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                  minDiscount === tier.value
                    ? "bg-rose-600 text-white shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

          {/* Piece Count Filter */}
          <div className="flex items-center bg-white p-0.5 rounded-lg border border-neutral-200 shadow-2xs">
            {pieceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPieceFilter(opt.value)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                  pieceFilter === opt.value
                    ? "bg-neutral-900 text-white shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Fake-Sale Filter / Lowest Ever Toggle */}
          <button
            onClick={() => setOnlyLowestEver(!onlyLowestEver)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              onlyLowestEver
                ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${onlyLowestEver ? "text-emerald-600" : "text-neutral-400"}`} />
            <span>Verified Lowest Price</span>
            {onlyLowestEver && <Check className="w-3 h-3 text-emerald-600 ml-0.5" />}
          </button>
        </div>

        {/* Right Side: Results count & Sort dropdown */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <span className="text-xs text-neutral-500 font-medium">
            Showing <strong className="text-neutral-900">{totalFiltered}</strong> live sale items
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white text-xs font-semibold text-neutral-800 border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-neutral-900 shadow-2xs"
            >
              <option value="discount-desc">Biggest Discount %</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
