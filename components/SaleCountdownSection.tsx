"use client";

import React from "react";
import { useSaleCountdown } from "@/hooks/useSaleCountdown";
import {
  Clock,
  Calendar,
  Flame,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Timer,
} from "lucide-react";

export const SaleCountdownSection: React.FC = () => {
  const { days, hours, minutes, seconds, isExpired, formattedEndDate, mounted } =
    useSaleCountdown();

  const handleScrollToDeals = () => {
    const el = document.getElementById("catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // 30 days total in milliseconds
  const totalDuration = 30 * 24 * 60 * 60 * 1000;
  const remainingMs =
    days * 24 * 60 * 60 * 1000 +
    hours * 60 * 60 * 1000 +
    minutes * 60 * 1000 +
    seconds * 1000;
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round(((totalDuration - remainingMs) / totalDuration) * 100))
  );

  return (
    <section className="relative bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white py-14 border-y border-neutral-800 overflow-hidden">
      {/* Ambient Glow Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 shadow-xs">
            <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>30-Day Seasonal Clearance Sale Ender</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight text-white mb-3">
            Official Brand Sale Countdown
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl mx-auto">
            Pakistan's biggest 30-day fashion clearance is underway. Once the countdown timer ends, all verified flat 50% clearances and unstitched lawn discounts will revert to regular prices.
          </p>
        </div>

        {/* Counter Display Cards */}
        <div className="max-w-4xl mx-auto bg-neutral-900/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* Top Urgency Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-white/10 mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-300">
              <Timer className="w-4 h-4 text-rose-400" />
              <span>Time Remaining in 30-Day Cycle:</span>
            </div>

            {/* Mentioned Date for Sale End */}
            <div className="inline-flex items-center gap-2 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>
                Sale Ends On: <strong className="text-white">{formattedEndDate}</strong>
              </span>
            </div>
          </div>

          {/* Big Digital Countdown Clock */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-6 text-center max-w-2xl mx-auto mb-8">
            {/* Days Box */}
            <div className="relative group bg-neutral-950/90 rounded-2xl border border-white/10 p-3 sm:p-6 shadow-inner flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white group-hover:text-rose-400 transition-colors">
                {mounted ? String(days).padStart(2, "0") : "30"}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
                Days
              </div>
            </div>

            {/* Hours Box */}
            <div className="relative group bg-neutral-950/90 rounded-2xl border border-white/10 p-3 sm:p-6 shadow-inner flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white group-hover:text-rose-400 transition-colors">
                {mounted ? String(hours).padStart(2, "0") : "00"}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
                Hours
              </div>
            </div>

            {/* Minutes Box */}
            <div className="relative group bg-neutral-950/90 rounded-2xl border border-white/10 p-3 sm:p-6 shadow-inner flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white group-hover:text-rose-400 transition-colors">
                {mounted ? String(minutes).padStart(2, "0") : "00"}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
                Mins
              </div>
            </div>

            {/* Seconds Box */}
            <div className="relative group bg-neutral-950/90 rounded-2xl border border-rose-500/40 p-3 sm:p-6 shadow-inner flex flex-col items-center justify-center bg-gradient-to-b from-rose-950/30 to-neutral-950/90">
              <div className="text-2xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-rose-400">
                {mounted ? String(seconds).padStart(2, "0") : "00"}
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-rose-300 mt-1">
                Secs
              </div>
            </div>
          </div>

          {/* 30-Day Sale Progress Bar */}
          <div className="space-y-2 mb-8">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
              <span>Day 1 of 30-Day Clearance</span>
              <span>
                Official Cutoff: <strong className="text-white">{formattedEndDate}</strong>
              </span>
            </div>
            <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-rose-600 via-amber-400 to-rose-600 rounded-full transition-all duration-1000"
                style={{ width: `${mounted ? Math.max(5, 100 - progressPercent) : 100}%` }}
              ></div>
            </div>
          </div>

          {/* Mentioned Sale End Banner Box */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Sale Officially Closes On: {formattedEndDate}
                </h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Verified across Gul Ahmed, Baroque, Asim Jofa, Limelight, Sana Safinaz, Junaid Jamshed, Alkaram Studio, and Zellbury.
                </p>
              </div>
            </div>

            <button
              onClick={handleScrollToDeals}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <span>Shop Expiring Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
