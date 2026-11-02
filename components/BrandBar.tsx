"use client";

import React from "react";
import { Brand } from "@/types";

interface BrandBarProps {
  brands: Brand[];
  selectedBrand: string;
  onSelectBrand: (brandId: string) => void;
}

export const BrandBar: React.FC<BrandBarProps> = ({
  brands,
  selectedBrand,
  onSelectBrand,
}) => {
  return (
    <div className="py-4 border-b border-neutral-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Top Pakistani Brands on Sale
          </h2>
          <button
            onClick={() => onSelectBrand("all")}
            className="text-xs text-rose-600 font-semibold hover:underline"
          >
            Clear Brand Filter
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {/* All Brands button */}
          <button
            onClick={() => onSelectBrand("all")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-all ${
              selectedBrand === "all"
                ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
          >
            <span>All Brands</span>
          </button>

          {/* Individual Brands */}
          {brands.map((brand) => {
            const isSelected = selectedBrand === brand.id;
            return (
              <button
                key={brand.id}
                onClick={() => onSelectBrand(brand.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-neutral-900 border-neutral-900 text-white shadow-xs"
                    : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <span className="font-semibold">{brand.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-neutral-700 text-neutral-100"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {brand.totalDeals}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
