import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy & Data Protection</span>
          </div>

          <h1 className="text-3xl font-serif font-black text-neutral-950">
            Privacy Policy
          </h1>

          <p className="text-xs text-neutral-500">
            Last updated: November 2026
          </p>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-neutral-700">
            <h2 className="text-base font-bold text-neutral-900 pt-2">1. Overview</h2>
            <p>
              Women Fashion Deals ("we", "our", or "us") operates as a specialized sale and price-drop radar for Pakistani women's clothing. We are committed to protecting your privacy. We do not sell, rent, or trade your personal information to third parties.
            </p>

            <h2 className="text-base font-bold text-neutral-900 pt-2">2. Information We Collect</h2>
            <p>
              <strong>Newsletter Subscriptions:</strong> When you subscribe to our VIP Sale Alerts, we collect only your email address so we can notify you of legitimate seasonal clearances and price cuts. You can unsubscribe at any time via the link in our emails or by contacting us.
            </p>
            <p>
              <strong>Brand Partner Registrations:</strong> When a brand registers via our Brand Portal, we collect business contact information (brand name, official website, representative name, business email, and phone) to verify storefront feeds.
            </p>

            <h2 className="text-base font-bold text-neutral-900 pt-2">3. Outbound Links to Brand Storefronts</h2>
            <p>
              All product cards redirect directly to the verified official websites of the respective brands (e.g. Gul Ahmed, Baroque, Asim Jofa, Nishat Linen, Sapphire). When you click a deal, your transaction and payment happen directly on the official brand website. We never store or handle your credit card or payment information.
            </p>

            <h2 className="text-base font-bold text-neutral-900 pt-2">4. Cookies and Analytics</h2>
            <p>
              We use minimal cookies for essential site performance, theme persistence, and deal comparison state.
            </p>

            <h2 className="text-base font-bold text-neutral-900 pt-2">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out via our Brand Partner Portal or email <span className="font-semibold text-neutral-900">privacy@womenfashion.vercel.app</span>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
