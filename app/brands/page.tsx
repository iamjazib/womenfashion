"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { BRANDS } from "@/data/brands";
import { INITIAL_PRODUCTS } from "@/data/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle2,
} from "lucide-react";

export default function BrandsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const brandProfiles: Record<
    string,
    { headline: string; image: string; tag: string; description: string }
  > = {
    baroque: {
      headline: "Luxury Swiss Lawn & Festive Formals",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=400&fit=crop&q=80",
      tag: "Up to 40% OFF",
      description: "Renowned for opulent unstitched chiffon, organza, and festive embroidery with fine threadwork.",
    },
    asimjofa: {
      headline: "Festive Embroidered Silk & Wedding Wear",
      image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=600&h=400&fit=crop&q=80",
      tag: "Flat 50% OFF",
      description: "Statement eastern luxury couture featuring zari, sequins, and royal raw silk masterpieces.",
    },
    gulahmed: {
      headline: "Iconic 3-Piece Printed Lawn & Jacquard",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop&q=80",
      tag: "Up to 38% OFF",
      description: "Pakistan's pioneer textile heritage, crafting durable summer lawn, yarn-dyed suits, and co-ords.",
    },
    limelight: {
      headline: "Ready-to-Wear Kurtis & Embroidered Pret",
      image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&h=400&fit=crop&q=80",
      tag: "Up to 40% OFF",
      description: "High-street fashion with fast-moving daily pret, trendy silhouettes, and budget-friendly co-ords.",
    },
    sanasafinaz: {
      headline: "Mahay Lawn & Stitched Silk Ensembles",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=400&fit=crop&q=80",
      tag: "Up to 40% OFF",
      description: "Trendsetting contemporary prints and elegant monochrome silks favored by modern Pakistani women.",
    },
    "j.": {
      headline: "Timeless Traditional Eastern Wear & Dupattas",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&h=400&fit=crop&q=80",
      tag: "Up to 35% OFF",
      description: "Modest and culturally rooted stitched kurtis, printed lawns, and classic woven jacquards.",
    },
    alkaram: {
      headline: "Heritage Lawn & Stitched Daily Co-ords",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop&q=80",
      tag: "Up to 30% OFF",
      description: "Softest cotton lawn, vibrant digital patterns, and high-quality dyed cambric separates.",
    },
    zellbury: {
      headline: "Value Fashion, Casual Kurtis & Daily Lawn",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop&q=80",
      tag: "Up to 35% OFF",
      description: "Unbeatable budget pricing for smart casual women's shirts, western tops, and 2-piece suits.",
    },
  };

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return BRANDS;
    const q = searchQuery.toLowerCase();
    return BRANDS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        brandProfiles[b.id]?.headline.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-100/60 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Header totalDeals={INITIAL_PRODUCTS.length} />

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white py-14 border-b border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            Verified Brand Partners Directory
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white mb-3">
            Pakistani Women's Fashion Brands
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto mb-8">
            Browse dedicated sale trackers for every major Pakistani brand. Monitor real-time markdowns, compare collections, and shop directly from verified official stores.
          </p>

          {/* Search Brand Input */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter brand (Gul Ahmed, Baroque, Asim Jofa...)"
              className="w-full pl-11 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 text-white placeholder-neutral-400 rounded-full border border-white/20 focus:border-white focus:outline-hidden text-sm transition-all"
            />
          </div>
        </div>
      </section>

      {/* Brand Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-serif font-black text-neutral-900">
            All Brand Sale Trackers ({filteredBrands.length})
          </h2>
          <span className="text-xs text-neutral-500">
            Exclusively Women's Clothing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBrands.map((brand) => {
            const profile = brandProfiles[brand.id];
            const brandProductCount = INITIAL_PRODUCTS.filter((p) => p.brandId === brand.id).length;

            return (
              <div
                key={brand.id}
                className="group bg-white rounded-2xl border border-neutral-200 hover:border-neutral-900 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl"
              >
                <div>
                  {/* Brand Image Header */}
                  <Link
                    href={`/brand/${brand.slug || brand.id}`}
                    className="relative h-44 block overflow-hidden bg-neutral-100"
                  >
                    <img
                      src={profile?.image}
                      alt={brand.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Top Tag */}
                    <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                      {profile?.tag || "Active Sales"}
                    </span>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Storefront</span>
                      </div>
                      <h3 className="text-xl font-serif font-black leading-tight">
                        {brand.name}
                      </h3>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-rose-600 mb-1">
                      {profile?.headline}
                    </p>
                    <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                      {profile?.description}
                    </p>

                    <div className="bg-neutral-50 rounded-xl p-3 flex items-center justify-between text-xs mb-2">
                      <span className="text-neutral-500">Live Deals:</span>
                      <strong className="text-neutral-900 font-mono">
                        {brandProductCount} products
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 space-y-2">
                  <Link
                    href={`/brand/${brand.slug || brand.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-950 group-hover:bg-rose-600 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-2xs"
                  >
                    <span>View {brand.name} Sales</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href={brand.saleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 font-medium py-1"
                  >
                    <span>Official {brand.name} Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
