"use client";

import React, { useState, useMemo, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRANDS } from "@/data/brands";
import { INITIAL_PRODUCTS } from "@/data/products";
import { Product, Brand } from "@/types";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { PriceHistoryModal } from "@/components/PriceHistoryModal";
import { Footer } from "@/components/Footer";
import {
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Search,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export default function BrandPage({ params }: BrandPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug.toLowerCase();

  // Find matching brand by slug or by id
  const brand: Brand | undefined = BRANDS.find(
    (b) =>
      b.slug.toLowerCase() === slug ||
      b.id.toLowerCase() === slug ||
      b.id.toLowerCase() === slug.replace(/-/g, "") ||
      b.slug.replace(/-/g, "") === slug.replace(/-/g, "")
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [pieceFilter, setPieceFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"discount-desc" | "price-asc" | "price-desc" | "newest">("discount-desc");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // If brand is not found in catalog
  if (!brand) {
    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-serif font-black text-neutral-900 mb-3">
            Brand Not Found
          </h1>
          <p className="text-neutral-500 text-sm mb-8">
            We couldn't locate the brand "{slug}". Browse our verified Pakistani brand partners below.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BRANDS.map((b) => (
              <Link
                key={b.id}
                href={`/brand/${b.slug}`}
                className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-neutral-900 transition-all font-bold text-sm text-neutral-900"
              >
                {b.name}
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-neutral-950 text-white text-xs font-bold px-6 py-3 rounded-full"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Brand products
  const brandProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => p.brandId === brand.id);
  }, [brand.id]);

  // Brand statistics
  const stats = useMemo(() => {
    if (brandProducts.length === 0) {
      return { maxDiscount: 0, minPrice: 0, avgDiscount: 0 };
    }
    const maxDiscount = Math.max(...brandProducts.map((p) => p.discountPct));
    const minPrice = Math.min(...brandProducts.map((p) => p.salePrice));
    const avgDiscount = Math.round(
      brandProducts.reduce((acc, p) => acc + p.discountPct, 0) / brandProducts.length
    );
    return { maxDiscount, minPrice, avgDiscount };
  }, [brandProducts]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return brandProducts
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchFabric = p.fabric?.toLowerCase().includes(q);
          const matchPiece = p.pieceCount?.toLowerCase().includes(q);
          if (!matchTitle && !matchFabric && !matchPiece) return false;
        }

        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        if (pieceFilter !== "all" && p.pieceCount !== pieceFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "discount-desc") return b.discountPct - a.discountPct;
        if (sortBy === "price-asc") return a.salePrice - b.salePrice;
        if (sortBy === "price-desc") return b.salePrice - a.salePrice;
        if (sortBy === "newest") {
          return new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime();
        }
        return 0;
      });
  }, [brandProducts, searchQuery, selectedCategory, pieceFilter, sortBy]);

  // Available categories for this brand
  const availableCategories = useMemo(() => {
    const cats = new Set(brandProducts.map((p) => p.category));
    return Array.from(cats);
  }, [brandProducts]);

  // Other brands for quick jumping
  const otherBrands = BRANDS.filter((b) => b.id !== brand.id);

  return (
    <div className="min-h-screen bg-neutral-100/60 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Header
        totalDeals={INITIAL_PRODUCTS.length}
        savedCount={savedIds.length}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-neutral-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <Link href="/brands" className="hover:text-neutral-900 transition-colors">
            Brands
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-bold text-neutral-900">{brand.name}</span>
        </div>
      </div>

      {/* Brand Hero Banner */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white relative overflow-hidden border-b border-neutral-800 py-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Left: Brand Identity */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-rose-300 border border-white/15 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Official Storefront Deals</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white mb-2">
                {brand.name} Sales & Discounts
              </h1>

              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                Live price drop aggregator for genuine {brand.name} women's collections in Pakistan.
                Tracking unstitched lawn, luxury festive formals, and ready-to-wear kurtis with zero fake discounts.
              </p>

              {/* Direct Official Storefront Outbound Link */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={brand.saleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg transition-all"
                >
                  <span>Visit {brand.name} Official Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-neutral-200 hover:text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Compare with Other Brands</span>
                </Link>
              </div>
            </div>

            {/* Right: Live Deal Statistics Card */}
            <div className="bg-neutral-950/80 backdrop-blur-md rounded-2xl border border-white/10 p-5 sm:p-6 w-full md:w-80 shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
                {brand.name} Radar Snapshot
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-neutral-300">Active Deals:</span>
                  <span className="text-base font-black font-mono text-white">
                    {brandProducts.length} items
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-neutral-300">Max Discount:</span>
                  <span className="text-base font-black font-mono text-rose-400">
                    Up to {stats.maxDiscount}% OFF
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs text-neutral-300">Starting Price:</span>
                  <span className="text-base font-black font-mono text-emerald-400">
                    Rs. {stats.minPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300">Avg. Markdown:</span>
                  <span className="text-xs font-bold text-neutral-300">
                    {stats.avgDiscount}% off original retail
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Specific Filter & Search Bar */}
      <div className="sticky top-28 z-30 bg-white border-b border-neutral-200 shadow-2xs py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              All {brand.name} ({brandProducts.length})
            </button>
            {availableCategories.map((cat) => {
              const count = brandProducts.filter((p) => p.category === cat).length;
              const isActive = selectedCategory === cat;
              const catLabels: Record<string, string> = {
                unstitched: "Unstitched",
                pret: "Pret",
                festive: "Festive",
                western: "Co-ords",
              };
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {catLabels[cat] || cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Inside Brand & Sorting */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${brand.name}...`}
                className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 text-xs rounded-lg border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-50 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 focus:outline-hidden text-neutral-700"
            >
              <option value="discount-desc">Highest Discount</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Product Catalog Grid */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex-1">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-neutral-500">
            Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> verified{" "}
            {brand.name} sale items
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSaved={savedIds.includes(product.id)}
                onToggleSave={toggleSave}
                onOpenHistory={setModalProduct}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <SearchX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              No matching {brand.name} sales found
            </h3>
            <p className="text-xs text-neutral-500 mb-5">
              Try selecting a different category or clearing your search keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Cross-Brand Navigation Carousel */}
        <div className="mt-16 pt-10 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-serif font-black text-neutral-900">
                Explore More Pakistani Women's Brands
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Compare discounts and clearances across other top fashion houses.
              </p>
            </div>
            <Link
              href="/brands"
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>All Brands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {otherBrands.map((b) => (
              <Link
                key={b.id}
                href={`/brand/${b.slug}`}
                className="group bg-white p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 text-center transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 group-hover:text-rose-600 transition-colors">
                    {b.name}
                  </h4>
                  <span className="text-[10px] text-neutral-400">
                    {b.totalDeals} active sales
                  </span>
                </div>
                <div className="mt-2 text-[10px] font-bold text-rose-600 bg-rose-50 rounded py-0.5">
                  View Sales →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Price History Modal */}
      <PriceHistoryModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
      />

      <Footer />
    </div>
  );
}
