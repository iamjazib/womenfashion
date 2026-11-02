"use client";

import React from "react";
import Link from "next/link";
import { Brand } from "@/types";
import { Sparkles, ArrowRight, ExternalLink } from "lucide-react";

interface FeaturedBrandsSectionProps {
  brands: Brand[];
  selectedBrand: string;
  onSelectBrand: (brandId: string) => void;
}

export const FeaturedBrandsSection: React.FC<FeaturedBrandsSectionProps> = ({
  brands,
  selectedBrand,
  onSelectBrand,
}) => {
  const brandProfiles: Record<
    string,
    { headline: string; image: string; tag: string }
  > = {
    baroque: {
      headline: "Luxury Swiss Lawn & Festive Formals",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=400&fit=crop&q=80",
      tag: "Up to 40% OFF",
    },
    asimjofa: {
      headline: "Festive Embroidered Silk & Wedding Wear",
      image: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=600&h=400&fit=crop&q=80",
      tag: "Flat 50% OFF",
    },
    gulahmed: {
      headline: "Iconic 3-Piece Printed Lawn & Jacquard",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop&q=80",
      tag: "Up to 38% OFF",
    },
    limelight: {
      headline: "Ready-to-Wear Kurtis & Embroidered Pret",
      image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&h=400&fit=crop&q=80",
      tag: "Up to 40% OFF",
    },
    sanasafinaz: {
      headline: "Mahay Lawn & Stitched Silk Ensembles",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=400&fit=crop&q=80",
      tag: "Up to 40% OFF",
    },
    alkaram: {
      headline: "Heritage Lawn & Stitched Daily Co-ords",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop&q=80",
      tag: "Up to 30% OFF",
    },
  };

  const featuredList = brands.filter((b) => brandProfiles[b.id]);

  return (
    <section className="py-12 bg-neutral-50/70 border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-neutral-800 bg-neutral-200/70 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              Designer Spotlight
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 tracking-tight">
              Featured Pakistani Women's Brands
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Dedicated storefronts and live sale trackers for Pakistan's most revered women's couture houses.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/brands"
              className="text-xs font-bold text-neutral-900 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <span>View All Brands Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredList.map((brand) => {
            const profile = brandProfiles[brand.id];
            const brandSlug = brand.slug || brand.id;

            return (
              <div
                key={brand.id}
                className="group relative overflow-hidden rounded-2xl border border-neutral-200 hover:border-neutral-900 bg-white text-neutral-900 transition-all duration-300 p-5 flex flex-col justify-between shadow-2xs hover:shadow-xl"
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                      {profile?.tag || "Active Sale"}
                    </span>
                    <span className="text-xs font-semibold text-neutral-400">
                      {brand.totalDeals} live sales
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-black tracking-tight mb-1 group-hover:text-rose-600 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-xs line-clamp-1 mb-4 text-neutral-500">
                    {profile?.headline}
                  </p>
                </div>

                {/* Visual Image Preview */}
                <Link
                  href={`/brand/${brandSlug}`}
                  className="relative h-32 rounded-xl overflow-hidden bg-neutral-100 mb-4 block"
                >
                  <img
                    src={profile?.image}
                    alt={brand.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-2.5 left-3 text-white text-xs font-bold flex items-center gap-1">
                    <span>Explore {brand.name} Storefront</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>

                {/* Footer Action Links */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-bold">
                  <Link
                    href={`/brand/${brandSlug}`}
                    className="text-neutral-900 group-hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <span>View Brand Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => {
                      onSelectBrand(brand.id);
                      const el = document.getElementById("catalog-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-neutral-500 hover:text-neutral-900 text-[11px] underline"
                  >
                    Filter in Catalog
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
