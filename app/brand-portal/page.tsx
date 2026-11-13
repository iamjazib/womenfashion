"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BRANDS } from "@/data/brands";
import { INITIAL_PRODUCTS } from "@/data/products";
import { BrandRegistration } from "@/types";
import {
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Flame,
  Globe,
  Tag,
  Clock,
  Layers,
  Send,
  Loader2,
  AlertCircle,
  HelpCircle,
  Award,
  Check,
  XCircle,
} from "lucide-react";

export default function BrandPortalPage() {
  const [activeTab, setActiveTab] = useState<"register" | "dashboard" | "guidelines">("register");

  // Form State
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [saleUrl, setSaleUrl] = useState("");
  const [platform, setPlatform] = useState<"shopify" | "woocommerce" | "magento" | "custom" | "other">("shopify");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["unstitched", "pret"]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [priceGuarantee, setPriceGuarantee] = useState(false);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBrand, setSubmittedBrand] = useState<BrandRegistration | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Registered Brands from API
  const [registeredList, setRegisteredList] = useState<BrandRegistration[]>([]);
  const [isLoadingRegistered, setIsLoadingRegistered] = useState(false);

  const fetchRegistrations = async () => {
    setIsLoadingRegistered(true);
    try {
      const res = await fetch("/api/brands/register");
      const data = await res.json();
      if (data.success && Array.isArray(data.registrations)) {
        setRegisteredList(data.registrations);
      }
    } catch (err) {
      console.warn("Could not load brand registrations:", err);
    } finally {
      setIsLoadingRegistered(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!priceGuarantee) {
      setErrorMessage("Please accept the Genuine Price Reductions & Women's Fashion Guarantee.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/brands/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          website,
          saleUrl,
          platform,
          categories: selectedCategories,
          contactName,
          contactEmail,
          contactPhone,
          logoUrl,
          description,
          priceGuaranteeAccepted: priceGuarantee,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmittedBrand(data.registration);
        fetchRegistrations();
      } else {
        setErrorMessage(data.error || "Failed to submit brand registration.");
      }
    } catch (err: any) {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBrandName("");
    setWebsite("");
    setSaleUrl("");
    setPlatform("shopify");
    setSelectedCategories(["unstitched", "pret"]);
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setLogoUrl("");
    setDescription("");
    setPriceGuarantee(false);
    setSubmittedBrand(null);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Header totalDeals={INITIAL_PRODUCTS.length} />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-neutral-950 via-[#1a0712] to-neutral-950 text-white py-14 sm:py-16 border-b border-rose-950/40 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 shadow-xs">
            <Building2 className="w-4 h-4 text-rose-400" />
            <span>Brand Partner Portal & Radar Registration</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-white mb-4 leading-tight">
            Register Your Brand on Pakistan's <br className="hidden sm:inline" />
            Women's Fashion Sale Radar
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Are you a verified Pakistani clothing brand, designer label, or boutique? Get your genuine clearance sales, lawn launches, and pret markdowns displayed directly to thousands of high-intent women shoppers.
          </p>

          {/* Key Value Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl font-black text-white font-mono">{BRANDS.length}</div>
              <div className="text-[11px] text-neutral-400 font-medium">Verified Brand Partners</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl font-black text-rose-400 font-mono">{INITIAL_PRODUCTS.length}+</div>
              <div className="text-[11px] text-neutral-400 font-medium">Live Deals Tracked</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl font-black text-emerald-400 font-mono">100%</div>
              <div className="text-[11px] text-neutral-400 font-medium">Direct Store Checkout</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl font-black text-amber-300 font-mono">Rs. 0</div>
              <div className="text-[11px] text-neutral-400 font-medium">Listing or Setup Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <div className="bg-white border-b border-neutral-200 sticky top-14 sm:top-[74px] z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-2 sm:gap-4 py-2.5">
          <button
            onClick={() => setActiveTab("register")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "register"
                ? "bg-neutral-950 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Send className="w-4 h-4 text-rose-400" />
            <span>Register New Brand</span>
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-neutral-950 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Brand Radar Dashboard</span>
            {registeredList.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {registeredList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("guidelines")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "guidelines"
                ? "bg-neutral-950 text-white shadow-xs"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>Partner Criteria</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 flex-1">
        {/* ========================================================= */}
        {/* TAB 1: REGISTRATION FORM                                   */}
        {/* ========================================================= */}
        {activeTab === "register" && (
          <div>
            {!submittedBrand ? (
              <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-xl">
                <div className="max-w-2xl mx-auto mb-8 text-center">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-serif font-black text-neutral-900">
                    Submit Brand Partnership Application
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed">
                    Once submitted, our curation team will review your storefront URLs and configure live deal tracking across your active clearance collections.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Section 1: Brand Info */}
                  <div className="border-b border-neutral-100 pb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-rose-600" />
                      <span>1. Brand & Storefront Details</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Brand Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder="e.g. Charizma, Maria.B, Cross Stitch"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Official Store Website URL <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://www.yourbrand.pk"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Sale / Clearance Collection URL <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={saleUrl}
                          onChange={(e) => setSaleUrl(e.target.value)}
                          placeholder="https://www.yourbrand.pk/collections/sale"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          E-Commerce Engine
                        </label>
                        <select
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value as any)}
                          style={{ color: "#09090b", backgroundColor: "#ffffff" }}
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs font-medium"
                        >
                          <option value="shopify" style={{ color: "#09090b", backgroundColor: "#ffffff" }}>Shopify (Auto-feed sync)</option>
                          <option value="custom" style={{ color: "#09090b", backgroundColor: "#ffffff" }}>Custom / Demandware / Salesforce</option>
                          <option value="woocommerce" style={{ color: "#09090b", backgroundColor: "#ffffff" }}>WooCommerce</option>
                          <option value="magento" style={{ color: "#09090b", backgroundColor: "#ffffff" }}>Magento / Adobe Commerce</option>
                          <option value="other" style={{ color: "#09090b", backgroundColor: "#ffffff" }}>Other Platform</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Categories */}
                  <div className="border-b border-neutral-100 pb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      <span>2. Women's Fashion Categories Offered</span>
                    </h3>
                    <p className="text-xs text-neutral-500 mb-4">
                      Select all apparel collections your brand manufactures (exclusively female):
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "unstitched", label: "Unstitched Lawn (2pc/3pc)" },
                        { id: "pret", label: "Ready to Wear Pret" },
                        { id: "festive", label: "Festive, Chiffon & Luxury" },
                        { id: "western", label: "Co-ords, Kurtis & Bottoms" },
                        { id: "winter", label: "Shawls, Khaddar & Coats" },
                      ].map((cat) => {
                        const checked = selectedCategories.includes(cat.id);
                        return (
                          <label
                            key={cat.id}
                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                              checked
                                ? "bg-rose-50 border-rose-300 text-rose-900 font-semibold"
                                : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCategoryToggle(cat.id)}
                              className="accent-rose-600 w-4 h-4 rounded cursor-pointer"
                            />
                            <span>{cat.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: Contact & Verification */}
                  <div className="border-b border-neutral-100 pb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      <span>3. Official Representative Contact</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Representative Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Official Business Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="partnerships@yourbrand.pk"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Phone / WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+92 300 1234567"
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Brand Logo Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://yourbrand.pk/logo.png"
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs font-medium"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        Brand Story / Notes for Curation Team
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell us about your brand heritage, bestselling lawn fabrics, or upcoming seasonal sale timeline..."
                        className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all shadow-2xs font-medium"
                      ></textarea>
                    </div>
                  </div>

                  {/* Section 4: Pledge Checkbox */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 sm:p-5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={priceGuarantee}
                        onChange={(e) => setPriceGuarantee(e.target.checked)}
                        className="accent-rose-600 w-5 h-5 rounded mt-0.5 cursor-pointer shrink-0"
                      />
                      <div className="text-xs text-neutral-700 leading-relaxed">
                        <strong className="text-neutral-900 block font-bold mb-0.5">
                          Genuine Discount & Women's Fashion Guarantee
                        </strong>
                        I confirm that the submitted brand offers genuine women's fashion items with authentic price reductions, and that all customer clicks will lead directly to legitimate product purchase pages on our official domain.
                      </div>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 text-center sm:text-right">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-rose-600/20 transition-all hover:scale-105 disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Brand for Radar Listing</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Confirmation Card */
              <div className="bg-white rounded-3xl border border-emerald-300 p-8 sm:p-12 shadow-2xl text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-mono font-bold mb-3">
                  ID: {submittedBrand.id}
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 mb-2">
                  Application Submitted for {submittedBrand.brandName}!
                </h2>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-lg mx-auto mb-6">
                  Thank you, <strong>{submittedBrand.contactName}</strong>. Your brand registration has been received and logged in our system. A notification has been recorded for <strong className="text-neutral-900">{submittedBrand.contactEmail}</strong>.
                </p>

                <div className="bg-neutral-50 rounded-2xl p-4 sm:p-6 border border-neutral-200 text-left text-xs space-y-2.5 max-w-md mx-auto mb-8">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Brand Name:</span>
                    <strong className="text-neutral-900">{submittedBrand.brandName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Official Website:</span>
                    <a
                      href={submittedBrand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 underline font-medium truncate max-w-[200px]"
                    >
                      {submittedBrand.website}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Initial Status:</span>
                    <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      Under Curation Review
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Next Step:</span>
                    <span className="text-neutral-700 font-medium">Automatic Storefront Scan</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm"
                  >
                    View in Radar Dashboard
                  </button>
                  <button
                    onClick={resetForm}
                    className="w-full sm:w-auto bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs px-6 py-3 rounded-xl transition-all"
                  >
                    Register Another Brand
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BRAND RADAR DASHBOARD                               */}
        {/* ========================================================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span>Total Monitored Brands</span>
                  <Award className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-3xl font-black text-neutral-950 font-mono">
                  {BRANDS.length + registeredList.length}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  {BRANDS.length} verified live • {registeredList.length} in review pipeline
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span>Tracked Active Sales Deals</span>
                  <Flame className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black text-neutral-950 font-mono">
                  {INITIAL_PRODUCTS.length}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  100% verified women's items with zero fake discounts
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                  <span>Customer Referral Traffic</span>
                  <Globe className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-black text-emerald-600 font-mono">Direct</div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Zero commission middleman; customers check out on brand site
                </p>
              </div>
            </div>

            {/* Newly Registered Brand Applications Table */}
            {registeredList.length > 0 && (
              <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-neutral-900">
                      Recently Registered Brands ({registeredList.length})
                    </h3>
                  </div>
                  <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-2 py-0.5 rounded-full">
                    Awaiting Curation Integration
                  </span>
                </div>

                <div className="divide-y divide-neutral-100">
                  {registeredList.map((reg) => (
                    <div
                      key={reg.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center font-serif font-black text-base text-neutral-800 shrink-0">
                          {reg.brandName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-neutral-900">{reg.brandName}</h4>
                            <span className="text-[10px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">
                              {reg.platform}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Contact: {reg.contactName} ({reg.contactEmail})
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                            <a
                              href={reg.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-rose-600 hover:underline flex items-center gap-0.5"
                            >
                              <span>Official Site</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <span>•</span>
                            <a
                              href={reg.saleUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neutral-600 hover:underline flex items-center gap-0.5"
                            >
                              <span>Sale Page</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-center">
                        {reg.status === "approved" && (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Approved & Verified</span>
                          </span>
                        )}
                        {reg.status === "live" && (
                          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                            <span>Live on Radar</span>
                          </span>
                        )}
                        {reg.status === "rejected" && (
                          <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Application Declined</span>
                          </span>
                        )}
                        {(!reg.status || reg.status === "pending_review") && (
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            <span>Pending Curation Review</span>
                          </span>
                        )}
                        {(reg.status === "approved" || reg.status === "live") && (
                          <Link
                            href={`/brand/${reg.slug}`}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 ml-1"
                          >
                            <span>View Storefront</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Verified Partner Brands */}
            <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Live Verified Brand Partners ({BRANDS.length})
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Currently monitored live every few hours with automated price-drop verification.
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>All Active</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
                <div className="divide-y divide-neutral-100">
                  {BRANDS.slice(0, 5).map((brand) => {
                    const count = INITIAL_PRODUCTS.filter((p) => p.brandId === brand.id).length;
                    return (
                      <div key={brand.id} className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-neutral-900">{brand.name}</h4>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <span className="text-xs text-neutral-500 font-mono">
                              {count} verified sales active
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/brand/${brand.slug || brand.id}`}
                          className="text-xs font-semibold text-neutral-800 hover:text-rose-600 flex items-center gap-1"
                        >
                          <span>Deals</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>

                <div className="divide-y divide-neutral-100">
                  {BRANDS.slice(5).map((brand) => {
                    const count = INITIAL_PRODUCTS.filter((p) => p.brandId === brand.id).length;
                    return (
                      <div key={brand.id} className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-neutral-900">{brand.name}</h4>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                            <span className="text-xs text-neutral-500 font-mono">
                              {count} verified sales active
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/brand/${brand.slug || brand.id}`}
                          className="text-xs font-semibold text-neutral-800 hover:text-rose-600 flex items-center gap-1"
                        >
                          <span>Deals</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PARTNER GUIDELINES & CRITERIA                      */}
        {/* ========================================================= */}
        {activeTab === "guidelines" && (
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-xl space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <span>Radar Listing Standards</span>
              </div>
              <h2 className="text-2xl font-serif font-black text-neutral-900 mb-2">
                Brand Partner Quality & Listing Criteria
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-2xl">
                Women Fashion Deals operates on strict transparency. To protect our community of buyers, every brand listed on our radar must comply with three core rules:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h3 className="text-sm font-bold text-neutral-900 mb-1.5">
                  100% Exclusively Women's Fashion
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Only women's eastern and western apparel is indexed (unstitched lawn suits, ready-to-wear kurtis, formal formals, and co-ords). Men's or kids' wear is strictly filtered out.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h3 className="text-sm font-bold text-neutral-900 mb-1.5">
                  Zero Artificial Markup Policy
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Discount percentages must represent genuine markdown from standard retail prices. We monitor 30-day historical pricing to ensure fake markups are rejected.
                </p>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h3 className="text-sm font-bold text-neutral-900 mb-1.5">
                  Direct Storefront Redirection
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Every product card on our portal directs shoppers straight to your single product page (/products/[product-handle]). We never intercept orders or customer payment data.
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Ready to put your sales on the map?</h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Fill out the 2-minute registration form to connect your collection feed.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("register")}
                className="bg-neutral-950 hover:bg-rose-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Register Your Brand Now
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
