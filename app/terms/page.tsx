import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-100/70 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-rose-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Deals</span>
        </Link>

        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-sm space-y-6 text-neutral-800">
          <div className="flex items-center gap-2 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>Service Terms</span>
          </div>

          <h1 className="text-3xl font-serif font-black text-neutral-950">
            Terms of Service
          </h1>

          <p className="text-xs text-neutral-500">
            Last updated: November 2026
          </p>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-neutral-700">
            <h2 className="text-base font-bold text-neutral-900 pt-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Women Fashion Deals, you agree to these Terms of Service. If you do not agree with any part of these terms, please do not use the website.
            </p>

            <h2 className="text-base font-bold text-neutral-900 pt-2">2. Nature of the Service</h2>
            <p>
              Women Fashion Deals is a sale aggregator and price-tracking radar for Pakistani women's clothing. We scan public feeds and catalog listings from verified brand storefronts. We do not sell items directly and are not an intermediary retailer.
            </p>

            <h2 className="text-base font-bold text-neutral-900 pt-2">3. Pricing and Stock Availability</h2>
            <p>
              Product prices, clearance percentages, and inventory are scanned periodically. However, prices and stock levels can change rapidly on the brand's official storefront. Always check the final purchase price on the brand's official checkout page.
            </p>

            <h2 className="text-base font-bold text-neutral-900 pt-2">4. Intellectual Property</h2>
            <p>
              All brand names, trademarks, logos, and product imagery are the property of their respective owners (e.g. Gul Ahmed, Baroque, Asim Jofa, Nishat Linen, Sapphire, Limelight, Sana Safinaz, J., Alkaram Studio, Zellbury).
            </p>

            <h2 className="text-base font-bold text-neutral-900 pt-2">5. Disclaimer of Liability</h2>
            <p>
              We are not responsible for any order fulfillment, defective merchandise, shipping delays, or return disputes arising from purchases made on third-party brand websites.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
