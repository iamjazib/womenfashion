"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BRANDS } from "@/data/brands";
import { INITIAL_PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedDealsSection } from "@/components/FeaturedDealsSection";
import { SingleFeaturedProduct } from "@/components/SingleFeaturedProduct";
import { FeaturedBrandsSection } from "@/components/FeaturedBrandsSection";
import { CategoryGridSection } from "@/components/CategoryGridSection";
import { BrandBar } from "@/components/BrandBar";
import { FilterBar } from "@/components/FilterBar";
import { ProductCard } from "@/components/ProductCard";
import { AboutSection } from "@/components/AboutSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { PriceHistoryModal } from "@/components/PriceHistoryModal";
import { Footer } from "@/components/Footer";
import { SearchX, ChevronDown } from "lucide-react";

const PRODUCTS_PER_PAGE = 12;

export default function Home() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minDiscount, setMinDiscount] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState<"discount-desc" | "price-asc" | "price-desc" | "newest">("discount-desc");
  const [onlyLowestEver, setOnlyLowestEver] = useState(false);
  const [pieceFilter, setPieceFilter] = useState("all");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [searchQuery, selectedBrand, selectedCategory, minDiscount, maxPrice, pieceFilter, onlyLowestEver, sortBy]);

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Top 10 diversified products for Hero Slider across ALL categories and brands
  const heroSliderProducts = useMemo(() => {
    const selected: Product[] = [];
    const seenBrands = new Set<string>();
    const categories: Array<Product["category"]> = ["unstitched", "festive", "pret", "western"];

    // 1. Pick a top deal from each category across diverse brands
    for (const cat of categories) {
      const match = products.find(
        (p) => p.category === cat && !seenBrands.has(p.brandId) && p.imageUrl && p.discountPct >= 30
      );
      if (match) {
        selected.push(match);
        seenBrands.add(match.brandId);
      }
    }

    // 2. Pick a top deal from every other remaining brand
    const remainingBrandIds = ["asimjofa", "baroque", "sanasafinaz", "alkaram", "zellbury", "limelight", "gulahmed"];
    for (const b of remainingBrandIds) {
      if (selected.length >= 10) break;
      if (!seenBrands.has(b)) {
        const match = products.find((p) => p.brandId === b && p.imageUrl);
        if (match) {
          selected.push(match);
          seenBrands.add(b);
        }
      }
    }

    // 3. Fill up to 10 with other high-value luxury designer deals
    const luxuryBrands = ["asimjofa", "baroque", "gulahmed", "limelight", "sanasafinaz"];
    for (const b of luxuryBrands) {
      if (selected.length >= 10) break;
      const match = products.find(
        (p) => p.brandId === b && !selected.some((s) => s.id === p.id) && p.imageUrl
      );
      if (match) {
        selected.push(match);
      }
    }

    return selected.slice(0, 10);
  }, [products]);

  // Single Star Featured Product Spotlight
  const starFeaturedProduct = useMemo(() => {
    return (
      products.find(
        (p) =>
          p.discountPct >= 45 &&
          p.imageUrl &&
          (p.brandId === "asimjofa" || p.brandId === "baroque" || p.brandId === "gulahmed")
      ) || products[0]
    );
  }, [products]);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brandName.toLowerCase().includes(q);
          const matchFabric = p.fabric?.toLowerCase().includes(q);
          const matchPiece = p.pieceCount?.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchFabric && !matchPiece) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrand !== "all" && p.brandId !== selectedBrand) {
          return false;
        }

        // Category filter
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        // Discount filter
        if (p.discountPct < minDiscount) {
          return false;
        }

        // Max price filter
        if (p.salePrice > maxPrice) {
          return false;
        }

        // Piece filter
        if (pieceFilter !== "all" && p.pieceCount !== pieceFilter) {
          return false;
        }

        // Lowest price ever filter
        if (onlyLowestEver && !p.isLowestPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "discount-desc") {
          return b.discountPct - a.discountPct;
        }
        if (sortBy === "price-asc") {
          return a.salePrice - b.salePrice;
        }
        if (sortBy === "price-desc") {
          return b.salePrice - a.salePrice;
        }
        if (sortBy === "newest") {
          return new Date(b.firstSeenAt).getTime() - new Date(a.firstSeenAt).getTime();
        }
        return 0;
      });
  }, [
    products,
    searchQuery,
    selectedBrand,
    selectedCategory,
    minDiscount,
    maxPrice,
    sortBy,
    onlyLowestEver,
    pieceFilter,
  ]);

  // Limited products for display
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PRODUCTS_PER_PAGE, filteredProducts.length));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedBrand("all");
    setSelectedCategory("all");
    setMinDiscount(0);
    setMaxPrice(100000);
    setPieceFilter("all");
    setOnlyLowestEver(false);
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* SabKapray Style Sticky Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        savedCount={savedIds.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        totalDeals={products.length}
      />

      {/* Hero Section with Product Slider (10s auto-slide + mouse drag & touch swipe) */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        onSelectMinDiscount={setMinDiscount}
        onSelectBrand={setSelectedBrand}
        products={heroSliderProducts}
        totalDeals={products.length}
      />

      {/* Section 1: Flash Sale Highlights (Top 4 Big Discounts) */}
      <FeaturedDealsSection
        products={products}
        onOpenHistory={setModalProduct}
        onToggleSave={toggleSave}
        savedIds={savedIds}
      />

      {/* Section 2: Single Star Featured Product Spotlight */}
      <SingleFeaturedProduct
        product={starFeaturedProduct}
        onOpenHistory={setModalProduct}
      />

      {/* Section 3: Featured Brands Showcase (Baroque, Asim Jofa, Gul Ahmed, etc.) */}
      <FeaturedBrandsSection
        brands={BRANDS}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
      />

      {/* Section 4: Shop by Category Across All Brands (Lawn, Pret, Festive, Co-ords) */}
      <CategoryGridSection
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onSelectPiece={setPieceFilter}
        onSelectPriceCap={setMaxPrice}
      />

      {/* Section 5: Live Sale Catalog (With Search & Interactive Filters) */}
      <div id="catalog-section" className="scroll-mt-20">
        {/* Brand Horizontal Carousel / Pill Bar */}
        <BrandBar
          brands={BRANDS}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
        />

        {/* Multi-Filters & Sorting Bar */}
        <FilterBar
          minDiscount={minDiscount}
          setMinDiscount={setMinDiscount}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onlyLowestEver={onlyLowestEver}
          setOnlyLowestEver={setOnlyLowestEver}
          pieceFilter={pieceFilter}
          setPieceFilter={setPieceFilter}
          totalFiltered={filteredProducts.length}
        />

        {/* Main Product Grid (Cleanly limited to 12 items initially) */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {displayedProducts.length > 0 ? (
            <div>
              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSaved={savedIds.includes(product.id)}
                    onToggleSave={toggleSave}
                    onOpenHistory={setModalProduct}
                  />
                ))}
              </div>

              {/* Load More Pagination Button */}
              {hasMore ? (
                <div className="mt-12 text-center flex flex-col items-center">
                  <p className="text-xs text-neutral-500 mb-3">
                    Showing <strong className="text-neutral-900">{displayedProducts.length}</strong> of{" "}
                    <strong className="text-neutral-900">{filteredProducts.length}</strong> live women's sales
                  </p>
                  <button
                    onClick={loadMore}
                    className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Load More Women's Deals</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-12 text-center text-xs text-neutral-400">
                  You've viewed all {filteredProducts.length} active sales matching your criteria.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                <SearchX className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">
                No matching women's sales found
              </h3>
              <p className="text-xs text-neutral-500 mb-5">
                Try relaxing your discount percentage, clearing the brand selection, or removing search filters.
              </p>
              <button
                onClick={resetFilters}
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Section 6: About Us Section */}
      <AboutSection />

      {/* Section 7: FAQ Accordion Section */}
      <FAQSection />

      {/* Section 8: Call To Action (Sale Alerts) */}
      <CTASection />

      {/* Price History & Fake Sale Modal */}
      <PriceHistoryModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
      />

      {/* Transparent Affiliate & Brand Footer */}
      <Footer />
    </div>
  );
}
