"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { INITIAL_PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { useCompare } from "@/context/CompareContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  ArrowLeftRight,
  ArrowRight,
  Sparkles,
  X,
  Plus,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  Trash2,
  Search,
  Check,
  ChevronRight,
} from "lucide-react";

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare, addToCompare, maxCompare } =
    useCompare();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // Search results for adding a new product
  const searchResults = useMemo(() => {
    if (!productSearch.trim()) {
      return INITIAL_PRODUCTS.filter(
        (p) => !compareItems.some((c) => c.id === p.id)
      ).slice(0, 8);
    }
    const q = productSearch.toLowerCase();
    return INITIAL_PRODUCTS.filter(
      (p) =>
        !compareItems.some((c) => c.id === p.id) &&
        (p.title.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.fabric?.toLowerCase().includes(q))
    ).slice(0, 12);
  }, [productSearch, compareItems]);

  // Comparison presets
  const presets = [
    {
      title: "3-Piece Printed Lawn Clearance",
      desc: "Gul Ahmed vs Alkaram vs Sana Safinaz",
      tag: "Summer Lawn",
      ids: [
        INITIAL_PRODUCTS.find((p) => p.brandId === "gulahmed" && p.category === "unstitched")?.id,
        INITIAL_PRODUCTS.find((p) => p.brandId === "alkaram" && p.category === "unstitched")?.id,
        INITIAL_PRODUCTS.find((p) => p.brandId === "sanasafinaz" && p.category === "unstitched")?.id,
      ].filter(Boolean) as string[],
    },
    {
      title: "Luxury Festive Formals Face-off",
      desc: "Baroque vs Asim Jofa Embroidered",
      tag: "Festive & Wedding",
      ids: [
        INITIAL_PRODUCTS.find((p) => p.brandId === "baroque" && p.category === "festive")?.id,
        INITIAL_PRODUCTS.find((p) => p.brandId === "asimjofa" && p.category === "festive")?.id,
      ].filter(Boolean) as string[],
    },
    {
      title: "Daily Pret & Ready-to-Wear",
      desc: "Limelight vs Zellbury vs J.",
      tag: "Under Rs. 4,000",
      ids: [
        INITIAL_PRODUCTS.find((p) => p.brandId === "limelight" && p.category === "pret")?.id,
        INITIAL_PRODUCTS.find((p) => p.brandId === "zellbury")?.id,
        INITIAL_PRODUCTS.find((p) => p.brandId === "j.")?.id,
      ].filter(Boolean) as string[],
    },
  ];

  const loadPreset = (ids: string[]) => {
    clearCompare();
    const matched = INITIAL_PRODUCTS.filter((p) => ids.includes(p.id));
    matched.forEach((p) => addToCompare(p));
  };

  // Find lowest price and highest discount for highlighting
  const lowestPriceId = useMemo(() => {
    if (compareItems.length < 2) return null;
    return [...compareItems].sort((a, b) => a.salePrice - b.salePrice)[0]?.id;
  }, [compareItems]);

  const highestDiscountId = useMemo(() => {
    if (compareItems.length < 2) return null;
    return [...compareItems].sort((a, b) => b.discountPct - a.discountPct)[0]?.id;
  }, [compareItems]);

  return (
    <div className="min-h-screen bg-neutral-100/60 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Header totalDeals={INITIAL_PRODUCTS.length} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-neutral-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-bold text-neutral-900">Compare Dresses</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white py-12 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                <ArrowLeftRight className="w-3.5 h-3.5 text-rose-400" />
                <span>Side-by-Side Fashion Comparison</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white mb-2">
                Compare Pakistani Women's Dresses & Prices
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
                Evaluate sale prices, fabric quality, verified discounts, and genuine savings side-by-side across Pakistan's top designer brands.
              </p>
            </div>

            {compareItems.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  disabled={compareItems.length >= maxCompare}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Dress ({compareItems.length}/{maxCompare})</span>
                </button>

                <button
                  onClick={clearCompare}
                  className="inline-flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl transition-all"
                  title="Clear all compared items"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 flex-1">
        {compareItems.length === 0 ? (
          /* Empty State with Presets */
          <div className="space-y-12">
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <ArrowLeftRight className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-black text-neutral-900 mb-2">
                No Dresses in Comparison Yet
              </h2>
              <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
                Click the <strong>Compare</strong> button on any product card on the homepage, or choose one of our curated designer showdown presets below:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-neutral-950 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-rose-600 transition-colors shadow-sm"
                >
                  <span>Browse All Live Sales</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Pick from 235 Products</span>
                </button>
              </div>
            </div>

            {/* Curated Presets Showcase */}
            <div>
              <div className="text-center max-w-xl mx-auto mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  Quick Start
                </span>
                <h3 className="text-xl font-serif font-black text-neutral-900 mt-2">
                  Popular Comparison Showdowns
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  1-click comparison between Pakistan's most sought-after women's collections.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {presets.map((preset, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:border-neutral-900 hover:shadow-lg transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        {preset.tag}
                      </span>
                      <h4 className="text-base font-serif font-black text-neutral-900 mt-2 mb-1">
                        {preset.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mb-6">
                        {preset.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => loadPreset(preset.ids)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-neutral-950 hover:bg-rose-600 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
                    >
                      <span>Load This Comparison</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Comparison Table */
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[700px]">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50/70">
                    <th className="p-4 sm:p-6 w-48 text-xs font-bold text-neutral-400 uppercase tracking-wider align-top">
                      Feature \ Dress
                    </th>
                    {compareItems.map((item) => (
                      <th
                        key={item.id}
                        className="p-4 sm:p-6 w-64 align-top relative border-l border-neutral-200"
                      >
                        {/* Remove item button */}
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-100 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Image */}
                        <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-neutral-100 mb-3 shadow-2xs">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop&q=80";
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                            {item.brandName}
                          </div>
                          <div className="absolute top-2 right-2 bg-rose-600 text-white text-xs font-black px-2 py-0.5 rounded shadow-sm">
                            -{item.discountPct}%
                          </div>
                        </div>

                        {/* Best Deal Highlights */}
                        {item.id === lowestPriceId && (
                          <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            Lowest Price in Set
                          </div>
                        )}
                        {item.id === highestDiscountId && (
                          <div className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                            <TrendingDown className="w-3 h-3 text-rose-600" />
                            Biggest Discount %
                          </div>
                        )}

                        <Link
                          href={`/brand/${item.brandId}`}
                          className="text-[11px] font-bold text-neutral-400 hover:text-rose-600 uppercase tracking-wider block"
                        >
                          {item.brandName} Official
                        </Link>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 mt-0.5 leading-snug">
                          {item.title}
                        </h4>
                      </th>
                    ))}

                    {/* Column slot to add another item */}
                    {compareItems.length < maxCompare && (
                      <th className="p-6 w-60 align-middle text-center border-l border-neutral-200 bg-neutral-50/40">
                        <button
                          onClick={() => setIsSearchOpen(true)}
                          className="w-full h-full min-h-[220px] rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-900 flex flex-col items-center justify-center gap-2 p-4 text-neutral-500 hover:text-neutral-900 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-full bg-neutral-200 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center transition-colors">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold">
                            Add Another Dress
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Up to {maxCompare} dresses
                          </span>
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                  {/* Row: Live Sale Price */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-neutral-500 bg-neutral-50/50">
                      Live Sale Price
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className={`p-4 sm:p-5 border-l border-neutral-200 ${
                          item.id === lowestPriceId ? "bg-emerald-50/40" : ""
                        }`}
                      >
                        <span className="text-lg sm:text-xl font-black font-mono text-neutral-950">
                          Rs. {item.salePrice.toLocaleString()}
                        </span>
                      </td>
                    ))}
                    {compareItems.length < maxCompare && (
                      <td className="border-l border-neutral-200"></td>
                    )}
                  </tr>

                  {/* Row: Original Price */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-neutral-500 bg-neutral-50/50">
                      Original Retail
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 sm:p-5 border-l border-neutral-200 text-neutral-400 line-through font-mono text-sm"
                      >
                        Rs. {item.originalPrice.toLocaleString()}
                      </td>
                    ))}
                    {compareItems.length < maxCompare && (
                      <td className="border-l border-neutral-200"></td>
                    )}
                  </tr>

                  {/* Row: Verified Discount */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-neutral-500 bg-neutral-50/50">
                      Verified Discount
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className={`p-4 sm:p-5 border-l border-neutral-200 ${
                          item.id === highestDiscountId ? "bg-rose-50/40" : ""
                        }`}
                      >
                        <span className="inline-block bg-rose-600 text-white font-black px-2 py-0.5 rounded text-xs">
                          {item.discountPct}% OFF
                        </span>
                      </td>
                    ))}
                    {compareItems.length < maxCompare && (
                      <td className="border-l border-neutral-200"></td>
                    )}
                  </tr>

                  {/* Row: Total Money Saved */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-neutral-500 bg-neutral-50/50">
                      Your Savings
                    </td>
                    {compareItems.map((item) => {
                      const savings = item.originalPrice - item.salePrice;
                      return (
                        <td
                          key={item.id}
                          className="p-4 sm:p-5 border-l border-neutral-200 font-bold text-emerald-700 font-mono"
                        >
                          Save Rs. {savings.toLocaleString()}
                        </td>
                      );
                    })}
                    {compareItems.length < maxCompare && (
                      <td className="border-l border-neutral-200"></td>
                    )}
                  </tr>

                  {/* Row: Category */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-neutral-500 bg-neutral-50/50">
                      Category
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 sm:p-5 border-l border-neutral-200 font-semibold uppercase tracking-wider text-xs text-neutral-900"
                      >
                        {item.category === "unstitched" && "Unstitched Lawn"}
                        {item.category === "festive" && "Festive & Luxury"}
                        {item.category === "pret" && "Ready-to-Wear (Pret)"}
                        {item.category === "western" && "Co-ords & Kurtis"}
                        {!["unstitched", "festive", "pret", "western"].includes(item.category) && item.category}
                      </td>
                    ))}
                    {compareItems.length < maxCompare && (
                      <td className="border-l border-neutral-200"></td>
                    )}
                  </tr>

                  {/* Row: Piece Count */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-neutral-500 bg-neutral-50/50">
                      Piece Count
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 sm:p-5 border-l border-neutral-200 font-medium"
                      >
                        {item.pieceCount || "Stitched Suit"}
                      </td>
                    ))}
                    {compareItems.length < maxCompare && (
                      <td className="border-l border-neutral-200"></td>
                    )}
                  </tr>

                  {/* Row: Fabric Details */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-neutral-500 bg-neutral-50/50">
                      Fabric Material
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 sm:p-5 border-l border-neutral-200 font-medium text-neutral-800"
                      >
                        {item.fabric || "Premium Women's Fabric"}
                      </td>
                    ))}
                    {compareItems.length < maxCompare && (
                      <td className="border-l border-neutral-200"></td>
                    )}
                  </tr>

                  {/* Row: Price Drop Protection */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-neutral-500 bg-neutral-50/50">
                      30-Day Lowest
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 sm:p-5 border-l border-neutral-200"
                      >
                        {item.isLowestPrice ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Yes, Lowest Ever
                          </span>
                        ) : (
                          <span className="text-neutral-400">Regular Sale</span>
                        )}
                      </td>
                    ))}
                    {compareItems.length < maxCompare && (
                      <td className="border-l border-neutral-200"></td>
                    )}
                  </tr>

                  {/* Row: Outbound Direct Link */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-neutral-500 bg-neutral-50/50">
                      Official Store Link
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={item.id}
                        className="p-4 sm:p-5 border-l border-neutral-200"
                      >
                        <a
                          href={`/go/${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-neutral-950 hover:bg-rose-600 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition-colors"
                        >
                          <span>Shop on {item.brandName}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    ))}
                    {compareItems.length < maxCompare && (
                      <td className="border-l border-neutral-200"></td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Product Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-neutral-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-lg font-serif font-black text-neutral-900">
                Add Dress to Comparison ({compareItems.length}/{maxCompare})
              </h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative my-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by brand, dress title, fabric (e.g. Baroque lawn)..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:border-neutral-900"
                autoFocus
              />
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-100">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="pt-2 flex items-center justify-between gap-3 p-2 hover:bg-neutral-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-12 h-14 object-cover object-top rounded-lg bg-neutral-100 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                        {product.brandName} • -{product.discountPct}% OFF
                      </span>
                      <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                        {product.title}
                      </h4>
                      <div className="text-xs font-mono font-bold text-neutral-950">
                        Rs. {product.salePrice.toLocaleString()}{" "}
                        <span className="text-neutral-400 line-through text-[11px] font-normal">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCompare(product);
                      if (compareItems.length + 1 >= maxCompare) {
                        setIsSearchOpen(false);
                      }
                    }}
                    className="shrink-0 inline-flex items-center gap-1 bg-neutral-950 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100 text-center">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
