"use client";

import React from "react";
import { Product } from "@/types";
import { X, TrendingDown, ShieldCheck, ExternalLink, Calendar } from "lucide-react";

interface PriceHistoryModalProps {
  product: Product | null;
  onClose: () => void;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
              Price History & Fake-Sale Verification
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Product Summary */}
          <div className="flex gap-3">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-16 h-20 object-cover rounded-lg border border-neutral-200"
            />
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                {product.brandName}
              </span>
              <h4 className="text-sm font-semibold text-neutral-900 line-clamp-1">
                {product.title}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-black text-rose-600">
                  Rs. {product.salePrice.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {product.discountPct}% OFF
                </span>
              </div>
            </div>
          </div>

          {/* Genuine Discount Verification Box */}
          <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950">
              <span className="font-bold">Verified Real Discount: </span>
              Our robot tracked this product over recent scans. The price was not artificially raised before this discount was applied.
            </div>
          </div>

          {/* Timeline of Recorded Prices */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Recorded Price Scan Timeline
            </h5>
            <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100 text-xs">
              {product.priceHistory.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
                    <span className="font-medium text-neutral-700">{entry.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-neutral-500 line-through text-[11px]">
                      Rs. {entry.price.toLocaleString()}
                    </span>
                    <span className="font-mono font-bold text-neutral-900">
                      Rs. {entry.salePrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            Discounts verified via automated hourly scans
          </span>
          <a
            href={`/go/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <span>Shop on {product.brandName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
