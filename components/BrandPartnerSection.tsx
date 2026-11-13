"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Globe,
  Flame,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export const BrandPartnerSection: React.FC = () => {
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleExpressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !website || !contactEmail) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/brands/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          website: website.startsWith("http") ? website : `https://${website}`,
          saleUrl: website.startsWith("http") ? website : `https://${website}`,
          platform: "shopify",
          categories: ["unstitched", "pret"],
          contactName: "Brand Representative",
          contactEmail,
          contactPhone: "+92 300 0000000",
          priceGuaranteeAccepted: true,
          description: "Submitted via Homepage Express Partner Section",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage(`Express application for "${brandName}" submitted! Our curation team will review your collection.`);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to submit request.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network connection error. Please try again.");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white relative overflow-hidden border-y border-neutral-800">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Brand Invitation Copy & Perks */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Brand Partnership Radar</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              Are You a Pakistani Fashion Brand? <br />
              <span className="text-rose-500">Put Your Sales On Our Radar.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
              Connect directly with thousands of Pakistani women actively hunting for unstitched lawn discounts, designer pret clearances, and festive formals daily.
            </p>

            {/* 3 Core Partner Advantages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
                <Globe className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-0.5">100% Direct Traffic</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Buyers click straight to your official single-product pages.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
                <Flame className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-0.5">Zero Commission</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Free listing and zero middleman fees. Keep 100% of your revenue.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
                <ShieldCheck className="w-5 h-5 text-rose-400 mb-2" />
                <h4 className="text-xs font-bold text-white mb-0.5">Verified Badge</h4>
                <p className="text-[11px] text-neutral-400 leading-normal">
                  Build buyer trust with genuine price-drop verification.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/brand-portal"
                className="inline-flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4"
              >
                <span>Learn more in our Brand Partner Portal & Listing Criteria</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Express Brand Request Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-neutral-900 shadow-2xl border border-white/20">
              <div className="mb-6">
                <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded">
                  EXPRESS APPLICATION
                </span>
                <h3 className="text-xl font-serif font-black text-neutral-950 mt-2">
                  Request Brand Listing
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Fill in your official store details to connect your clearance feed.
                </p>
              </div>

              {status === "success" ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center text-xs space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-950">Application Received!</h4>
                  <p className="text-neutral-600 leading-relaxed">{message}</p>
                  <Link
                    href="/brand-portal"
                    className="inline-block mt-2 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                  >
                    Go to Brand Portal
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleExpressSubmit} className="space-y-4">
                  {status === "error" && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                      <span>{message}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Brand Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Cross Stitch, Maria.B, Charizma"
                      style={{ color: "#09090b", backgroundColor: "#ffffff", colorScheme: "light" }}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-950 focus:outline-hidden transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Official Store Website <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.yourbrand.pk"
                      style={{ color: "#09090b", backgroundColor: "#ffffff", colorScheme: "light" }}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-950 focus:outline-hidden transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Business Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="partnerships@yourbrand.pk"
                      style={{ color: "#09090b", backgroundColor: "#ffffff", colorScheme: "light" }}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-950 focus:outline-hidden transition-all font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Brand for Verification</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-neutral-400 text-center">
                    Zero listing fee • Direct customer checkout • 100% women's clothing only
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
