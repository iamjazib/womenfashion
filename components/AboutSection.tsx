import React from "react";
import { ShieldCheck, Zap, Heart, Search, CheckCircle2 } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Story / Brand Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200">
              <img
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&q=80"
                alt="Women Fashion Story"
                className="w-full h-auto object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md mb-2 inline-block">
                  Our Mission
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black tracking-tight leading-tight">
                  Democratizing Pakistani Women's Fashion Sales
                </h3>
                <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                  Eliminating the frustration of opening 20 brand tabs so every shopper finds authentic luxury lawn and prêt at the lowest genuine price.
                </p>
              </div>
            </div>

            {/* Floating Trust Card */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-white rounded-2xl p-4 shadow-xl border border-neutral-100 max-w-xs">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-neutral-900">Anti-Fake Sale Guarantee</div>
                <div className="text-neutral-500 text-[11px]">30-day historical price verification on every deal</div>
              </div>
            </div>
          </div>

          {/* Right Column: About Details & Value Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                About Women Fashion
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-neutral-900 tracking-tight leading-tight">
                Pakistan's Dedicated Smart Radar for Women's Clothing Discounts
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mt-3">
                Shopping for Pakistani designer lawn, luxury formals, and everyday prêt shouldn't feel like a chore. Every season, top brands launch flash sales, end-of-season clearances, and special discounts. But finding them usually means scrolling endlessly through Instagram or constantly refreshing 20 different brand websites.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed mt-2">
                <strong className="text-neutral-900">Women Fashion</strong> solves this by aggregating real-time discounts from Pakistan's most respected fashion houses—including <strong className="text-neutral-900">Gul Ahmed, Baroque, Asim Jofa, Limelight, Sana Safinaz, Junaid Jamshed, and Zellbury</strong>—into one clean, searchable catalog.
              </p>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                  <Search className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-neutral-900 text-xs sm:text-sm mb-1">
                  100% Women's Focus
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Strictly curated women's apparel: unstitched 3pc/2pc lawn, embroidered pret kurtas, and luxury festive wear.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-neutral-900 text-xs sm:text-sm mb-1">
                  Anti-Fake Markups
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  We record every item's price history over time to expose and filter out artificially inflated "fake discounts."
                </p>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-neutral-900 text-xs sm:text-sm mb-1">
                  Direct Brand Purchasing
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  No middleman markups or counterfeit stock. Clicking any deal takes you directly to the brand's official store.
                </p>
              </div>
            </div>

            {/* Quick Stats Strip */}
            <div className="pt-4 border-t border-neutral-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-neutral-950">8+</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Designer Labels</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-neutral-950">230+</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Live Sales Tracked</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black font-mono text-neutral-950">3 Hrs</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Scan Frequency</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
