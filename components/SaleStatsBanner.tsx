"use client";

import React from "react";
import { Sparkles, TrendingDown, Percent, Clock } from "lucide-react";

interface SaleStatsBannerProps {
  totalDeals: number;
  highestDiscount: number;
}

export const SaleStatsBanner: React.FC<SaleStatsBannerProps> = ({
  totalDeals,
  highestDiscount,
}) => {
  return (
    <div className="bg-gradient-to-r from-rose-950 via-neutral-900 to-neutral-950 text-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Pakistan's #1 Real-Time Fashion Sale Aggregator
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white">
            Never Miss a Pakistani Lawn & Pret Sale Again.
          </h1>
          <p className="text-sm text-neutral-300 mt-1 max-w-xl">
            We scan top designer brands every few hours, verify authentic price drops, and compile all live deals into one instant search engine.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
            <div className="flex items-center justify-center text-rose-400 mb-1">
              <Percent className="w-4 h-4" />
            </div>
            <div className="text-xl font-black font-mono text-white">
              Up to {highestDiscount}%
            </div>
            <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
              Max Discount
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
            <div className="flex items-center justify-center text-emerald-400 mb-1">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div className="text-xl font-black font-mono text-white">
              {totalDeals}+
            </div>
            <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
              Live Sales
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-center">
            <div className="flex items-center justify-center text-amber-400 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xl font-black font-mono text-white">
              3 hrs
            </div>
            <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
              Scan Cycle
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
