"use client";

import React from "react";
import { ArrowRight, Layers, Sparkles } from "lucide-react";

interface CategoryGridSectionProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectPiece: (piece: string) => void;
  onSelectPriceCap: (price: number) => void;
}

export const CategoryGridSection: React.FC<CategoryGridSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectPiece,
  onSelectPriceCap,
}) => {
  const categories = [
    {
      id: "unstitched",
      title: "Unstitched Lawn & Cotton",
      subtitle: "3-Piece & 2-Piece suits from Gul Ahmed, Alkaram & Sana Safinaz",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=700&fit=crop&q=80",
      badge: "Most Popular",
      action: () => onSelectCategory("unstitched"),
    },
    {
      id: "pret",
      title: "Ready-to-Wear (Pret)",
      subtitle: "Stitched kurtas, shirts & daily co-ords from Limelight & J.",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop&q=80",
      badge: "Fast Selling",
      action: () => onSelectCategory("pret"),
    },
    {
      id: "festive",
      title: "Festive & Luxury Formals",
      subtitle: "Chiffon, Silk & Embroidered Wedding collections from Asim Jofa & Baroque",
      image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=600&h=700&fit=crop&q=80",
      badge: "Up to 50% OFF",
      action: () => onSelectCategory("festive"),
    },
    {
      id: "budget-coords",
      title: "Under Rs. 3,500 Deals",
      subtitle: "Budget-friendly stitched 2-piece and casual kurtis from all top labels",
      image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&h=700&fit=crop&q=80",
      badge: "Best Value",
      action: () => {
        onSelectCategory("all");
        onSelectPriceCap(3500);
      },
    },
  ];

  const handleCategoryClick = (catAction: () => void) => {
    catAction();
    const el = document.getElementById("catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
              <Layers className="w-3.5 h-3.5 text-neutral-700" />
              All-Brand Collections
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 tracking-tight">
              Shop by Category Across All Brands
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Compare prices side-by-side: from unstitched lawn to luxury wedding formals.
            </p>
          </div>
        </div>

        {/* Categories 4-Column Visual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.action)}
                className={`group cursor-pointer relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border ${
                  isSelected ? "border-rose-600 ring-2 ring-rose-500" : "border-neutral-200"
                }`}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                    {cat.badge}
                  </span>
                </div>

                {/* Bottom Card Content */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-serif font-black tracking-tight mb-1 group-hover:text-rose-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed mb-3">
                    {cat.subtitle}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 group-hover:text-white transition-colors">
                    <span>Explore Sales</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
