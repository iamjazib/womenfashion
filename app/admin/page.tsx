"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BRANDS } from "@/data/brands";
import { INITIAL_PRODUCTS } from "@/data/products";
import { Product, BrandRegistration } from "@/types";
import {
  ShieldCheck,
  Search,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  Globe,
  Tag,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  ExternalLink,
  Save,
  Eye,
  RefreshCw,
  Sparkles,
  Download,
  Trash2,
  XCircle,
  Check,
  Clock,
} from "lucide-react";

interface PageSeo {
  id: string;
  path: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical: string;
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const [activeTab, setActiveTab] = useState<"seo" | "products" | "brands" | "subscribers">("seo");

  // SEO State
  const [pagesSeo, setPagesSeo] = useState<PageSeo[]>([]);
  const [selectedPageId, setSelectedPageId] = useState("home");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoOgImage, setSeoOgImage] = useState("");
  const [seoCanonical, setSeoCanonical] = useState("");
  const [isSavingSeo, setIsSavingSeo] = useState(false);
  const [seoFeedback, setSeoFeedback] = useState("");

  // Products State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [productSearch, setProductSearch] = useState("");
  const [productBrandFilter, setProductBrandFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productFeedback, setProductFeedback] = useState("");

  // Brand Registrations State
  const [brandRegistrations, setBrandRegistrations] = useState<BrandRegistration[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [brandFeedback, setBrandFeedback] = useState("");
  const [updatingBrandId, setUpdatingBrandId] = useState<string | null>(null);

  // Subscribers State
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);

  // Authenticate (Default demo passcode: admin2026 or 1-click enter)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin2026" || passcode === "admin" || passcode === "") {
      setIsAuthenticated(true);
      setPasscodeError("");
      loadInitialData();
    } else {
      setPasscodeError("Invalid admin passcode. (Hint: 'admin2026')");
    }
  };

  const loadInitialData = async () => {
    // 1. Load SEO
    try {
      const res = await fetch("/api/admin/seo", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.pages)) {
        let pages = data.pages;
        try {
          const localOverrides = JSON.parse(localStorage.getItem("admin_seo_overrides") || "{}");
          pages = pages.map((p: any) => (localOverrides[p.id] ? { ...p, ...localOverrides[p.id] } : p));
        } catch {}
        setPagesSeo(pages);
        const homePage = pages.find((p: any) => p.id === "home") || pages[0];
        if (homePage) {
          selectPageForEdit(homePage);
        }
      }
    } catch (err) {
      console.warn("Could not load SEO config:", err);
    }

    // 2. Load Brand Registrations
    loadBrandRegistrations();

    // 3. Load Subscribers
    loadSubscribers();
  };

  const loadBrandRegistrations = async () => {
    setIsLoadingBrands(true);
    try {
      const res = await fetch("/api/brands/register");
      const data = await res.json();
      if (data.success && Array.isArray(data.registrations)) {
        setBrandRegistrations(data.registrations);
      }
    } catch (err) {
      console.warn("Could not load brands:", err);
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const loadSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const res = await fetch("/api/subscribers");
      const data = await res.json();
      if (data.success && Array.isArray(data.subscribers)) {
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.warn("Could not load subscribers:", err);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  const selectPageForEdit = (page: PageSeo) => {
    setSelectedPageId(page.id);
    setSeoTitle(page.title || "");
    setSeoDescription(page.description || "");
    setSeoKeywords(page.keywords || "");
    setSeoOgImage(page.ogImage || "");
    setSeoCanonical(page.canonical || "");
    setSeoFeedback("");
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSeo(true);
    setSeoFeedback("");

    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: selectedPageId,
          title: seoTitle,
          description: seoDescription,
          keywords: seoKeywords,
          ogImage: seoOgImage,
          canonical: seoCanonical,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSeoFeedback(data.message || "Meta details updated successfully!");
        setPagesSeo((prev) =>
          prev.map((p) => (p.id === selectedPageId ? { ...p, ...data.page } : p))
        );
        try {
          const currentOverrides = JSON.parse(localStorage.getItem("admin_seo_overrides") || "{}");
          currentOverrides[selectedPageId] = data.page;
          localStorage.setItem("admin_seo_overrides", JSON.stringify(currentOverrides));
        } catch {}
      } else {
        setSeoFeedback(data.error || "Failed to save meta details.");
      }
    } catch (err: any) {
      setSeoFeedback("Network error saving SEO metadata.");
    } finally {
      setIsSavingSeo(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSavingProduct(true);
    setProductFeedback("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProductFeedback(`Product "${data.product.title}" saved successfully!`);
        setProducts((prev) =>
          prev.map((p) => (p.id === data.product.id ? data.product : p))
        );
        setTimeout(() => setEditingProduct(null), 1200);
      } else {
        setProductFeedback(data.error || "Failed to update product.");
      }
    } catch (err: any) {
      setProductFeedback("Network error updating product.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleUpdateBrandStatus = async (id: string, status: string) => {
    setBrandFeedback("");
    setUpdatingBrandId(id);
    try {
      const res = await fetch("/api/admin/brands/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setBrandFeedback(data.message || `Status updated to ${status}.`);
        setBrandRegistrations((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: status as any } : b))
        );
      } else {
        setBrandFeedback(data.error || "Failed to update brand status.");
      }
    } catch (err) {
      setBrandFeedback("Network error updating brand status.");
    } finally {
      setUpdatingBrandId(null);
    }
  };

  const handleDeleteBrand = async (id: string, brandName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${brandName}" application?`)) {
      return;
    }
    setBrandFeedback("");
    setUpdatingBrandId(id);
    try {
      const res = await fetch(`/api/admin/brands/status?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBrandFeedback(`Brand "${brandName}" deleted successfully.`);
        setBrandRegistrations((prev) => prev.filter((b) => b.id !== id));
      } else {
        setBrandFeedback(data.error || "Failed to delete brand registration.");
      }
    } catch (err) {
      setBrandFeedback("Network error deleting brand registration.");
    } finally {
      setUpdatingBrandId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (productBrandFilter !== "all" && p.brandId !== productBrandFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        (p.fabric && p.fabric.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-100/70 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      <Header totalDeals={products.length} />

      {/* Admin Auth Gate */}
      {!isAuthenticated ? (
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 max-w-md w-full shadow-2xl text-center">
            <div className="w-14 h-14 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Lock className="w-7 h-7 text-rose-500" />
            </div>
            <h1 className="text-2xl font-serif font-black text-neutral-900 mb-1">
              Admin Portal Access
            </h1>
            <p className="text-xs text-neutral-500 mb-6">
              Restricted dashboard to manage page SEO metadata, product catalog attributes, and brand partner requests.
            </p>

            {passcodeError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{passcodeError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode (e.g. admin2026)..."
                className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 placeholder:text-neutral-500 focus:border-neutral-900 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-rose-600 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Unlock Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </main>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="flex-1 flex flex-col">
          {/* Top Admin Header Bar */}
          <div className="bg-neutral-950 text-white border-b border-neutral-800 py-6 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    ADMIN
                  </span>
                  <h1 className="text-2xl font-serif font-black text-white">
                    Women Fashion Central Control
                  </h1>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Live Management: Page Meta SEO, Product Catalog & Pricing, Brand Applications, and VIP Subscribers
                </p>
              </div>

              {/* Fast Stats Bar */}
              <div className="flex items-center gap-3 text-xs">
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-neutral-400">Products: </span>
                  <strong className="text-white font-mono">{products.length}</strong>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-neutral-400">Brands: </span>
                  <strong className="text-white font-mono">{BRANDS.length}</strong>
                </div>
                <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-neutral-400">Requests: </span>
                  <strong className="text-rose-400 font-mono">{brandRegistrations.length}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white border-b border-neutral-200 sticky top-14 sm:top-[74px] z-30 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-2 sm:gap-4 overflow-x-auto py-2.5">
              <button
                onClick={() => setActiveTab("seo")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "seo"
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Globe className="w-4 h-4 text-rose-500" />
                <span>Page Meta Details (SEO)</span>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "products"
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Tag className="w-4 h-4 text-emerald-500" />
                <span>Product Catalog & Meta ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("brands")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "brands"
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Brand Partner Requests</span>
                {brandRegistrations.length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {brandRegistrations.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("subscribers")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "subscribers"
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <Mail className="w-4 h-4 text-blue-500" />
                <span>VIP Subscribers ({subscribers.length})</span>
              </button>
            </div>
          </div>

          {/* Main Tab Panels */}
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex-1">
            {/* ======================================================== */}
            {/* TAB 1: PAGE META DETAILS (SEO)                           */}
            {/* ======================================================== */}
            {activeTab === "seo" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Page Selection */}
                <div className="bg-white rounded-3xl border border-neutral-200 p-5 shadow-xs h-fit">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-rose-600" />
                    <span>Select Page to Configure</span>
                  </h3>
                  <div className="space-y-2">
                    {pagesSeo.map((p) => {
                      const active = p.id === selectedPageId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => selectPageForEdit(p)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                            active
                              ? "bg-rose-50 border-rose-300 text-rose-950 font-semibold shadow-xs"
                              : "bg-neutral-50/60 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          <div className="text-xs font-bold text-neutral-900">{p.name}</div>
                          <div className="text-[11px] text-neutral-500 font-mono mt-0.5">{p.path}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: SEO Form & Google Snippet Preview */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Google SERP Snippet Preview */}
                  <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3 font-semibold uppercase tracking-wider">
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>Live Google Search Snippet Preview</span>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4">
                      <div className="text-xs text-emerald-800 font-mono truncate mb-0.5">
                        {seoCanonical || "https://womenfashion.vercel.app/"}
                      </div>
                      <div className="text-base font-semibold text-blue-800 hover:underline cursor-pointer line-clamp-1 mb-1">
                        {seoTitle || "Page Title Here"}
                      </div>
                      <div className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                        {seoDescription || "Meta description will appear here on Google and search engines."}
                      </div>
                    </div>
                  </div>

                  {/* SEO Form */}
                  <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                      <div>
                        <h2 className="text-lg font-bold text-neutral-900">
                          Edit Meta Details:{" "}
                          <span className="text-rose-600 font-mono">
                            {pagesSeo.find((p) => p.id === selectedPageId)?.name}
                          </span>
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Configure search engine titles, social sharing tags, and crawl directives.
                        </p>
                      </div>

                      <button
                        onClick={handleSaveSeo}
                        disabled={isSavingSeo}
                        className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {isSavingSeo ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>Save Meta Details</span>
                      </button>
                    </div>

                    {seoFeedback && (
                      <div
                        className={`mb-6 p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2 font-medium ${
                          seoFeedback.includes("success") || seoFeedback.includes("updated")
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                            : "bg-rose-50 border border-rose-200 text-rose-800"
                        }`}
                      >
                        {seoFeedback.includes("success") || seoFeedback.includes("updated") ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        )}
                        <span>{seoFeedback}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveSeo} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          SEO Meta Title (Title Tag)
                        </label>
                        <input
                          type="text"
                          value={seoTitle}
                          onChange={(e) => setSeoTitle(e.target.value)}
                          placeholder="Page title for search engines..."
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 focus:border-neutral-900 focus:outline-hidden"
                        />
                        <span className="text-[11px] text-neutral-500 mt-1 block">
                          Character count: {seoTitle.length} / 60 recommended
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Meta Description
                        </label>
                        <textarea
                          rows={3}
                          value={seoDescription}
                          onChange={(e) => setSeoDescription(e.target.value)}
                          placeholder="Page summary displayed in Google search results..."
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 focus:border-neutral-900 focus:outline-hidden"
                        ></textarea>
                        <span className="text-[11px] text-neutral-500 mt-1 block">
                          Character count: {seoDescription.length} / 160 recommended
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                          Target SEO Keywords (Comma Separated)
                        </label>
                        <input
                          type="text"
                          value={seoKeywords}
                          onChange={(e) => setSeoKeywords(e.target.value)}
                          placeholder="e.g. pakistani lawn, baroque sale, sapphire pret..."
                          className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 focus:border-neutral-900 focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                            Canonical URL
                          </label>
                          <input
                            type="url"
                            value={seoCanonical}
                            onChange={(e) => setSeoCanonical(e.target.value)}
                            placeholder="https://womenfashion.vercel.app/..."
                            className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 focus:border-neutral-900 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                            OpenGraph Social Image URL
                          </label>
                          <input
                            type="url"
                            value={seoOgImage}
                            onChange={(e) => setSeoOgImage(e.target.value)}
                            placeholder="https://...image.jpg"
                            className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm text-neutral-950 focus:border-neutral-900 focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: PRODUCT CATALOG & META EDITOR                     */}
            {/* ======================================================== */}
            {activeTab === "products" && (
              <div className="space-y-6">
                {/* Search & Filter Controls */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search by title, brand, or fabric..."
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-neutral-900 rounded-xl text-xs sm:text-sm text-neutral-950 focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={productBrandFilter}
                      onChange={(e) => setProductBrandFilter(e.target.value)}
                      className="px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-hidden"
                    >
                      <option value="all">All Brands ({products.length})</option>
                      {BRANDS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>

                    <span className="text-xs text-neutral-500 whitespace-nowrap">
                      Showing <strong>{filteredProducts.length}</strong> items
                    </span>
                  </div>
                </div>

                {/* Product Table */}
                <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase tracking-wider text-[11px]">
                        <tr>
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-4">Brand</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Original</th>
                          <th className="py-3 px-4">Sale Price</th>
                          <th className="py-3 px-4">Discount</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {filteredProducts.slice(0, 30).map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.imageUrl}
                                  alt={p.title}
                                  className="w-10 h-10 object-cover rounded-lg border border-neutral-200 shrink-0"
                                />
                                <div>
                                  <div className="font-semibold text-neutral-900 line-clamp-1 max-w-xs">
                                    {p.title}
                                  </div>
                                  <span className="text-[10px] text-neutral-500 font-mono">
                                    {p.pieceCount || "Apparel"} • {p.fabric || "Cotton"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-semibold text-neutral-800">{p.brandName}</td>
                            <td className="py-3 px-4 capitalize">
                              <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px]">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 line-through text-neutral-400 font-mono">
                              Rs. {p.originalPrice.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-bold text-rose-600 font-mono">
                              Rs. {p.salePrice.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded border border-rose-200">
                                {p.discountPct}% OFF
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setEditingProduct({ ...p });
                                  setProductFeedback("");
                                }}
                                className="inline-flex items-center gap-1 bg-neutral-900 hover:bg-rose-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Edit Product Modal */}
                {editingProduct && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
                    <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-5 h-5 text-rose-600" />
                          <h3 className="text-base font-bold text-neutral-900">
                            Edit Product Details & Pricing
                          </h3>
                        </div>
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      {productFeedback && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{productFeedback}</span>
                        </div>
                      )}

                      <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-700 mb-1">
                            Product Title
                          </label>
                          <input
                            type="text"
                            value={editingProduct.title}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, title: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-950 focus:border-neutral-900 focus:outline-hidden"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 mb-1">
                              Original Price (PKR)
                            </label>
                            <input
                              type="number"
                              value={editingProduct.originalPrice}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  originalPrice: Number(e.target.value),
                                })
                              }
                              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-950 focus:border-neutral-900 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 mb-1">
                              Sale Price (PKR)
                            </label>
                            <input
                              type="number"
                              value={editingProduct.salePrice}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  salePrice: Number(e.target.value),
                                })
                              }
                              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-950 focus:border-neutral-900 focus:outline-hidden"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 mb-1">
                              Category
                            </label>
                            <select
                              value={editingProduct.category}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  category: e.target.value as any,
                                })
                              }
                              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-hidden"
                            >
                              <option value="unstitched">Unstitched</option>
                              <option value="pret">Pret</option>
                              <option value="festive">Festive</option>
                              <option value="western">Western</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 mb-1">
                              Fabric
                            </label>
                            <input
                              type="text"
                              value={editingProduct.fabric || ""}
                              onChange={(e) =>
                                setEditingProduct({ ...editingProduct, fabric: e.target.value })
                              }
                              placeholder="Lawn, Silk..."
                              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-neutral-950 focus:border-neutral-900 focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 mb-1">
                              Piece Count
                            </label>
                            <select
                              value={editingProduct.pieceCount || "3 Piece"}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  pieceCount: e.target.value as any,
                                })
                              }
                              className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-hidden"
                            >
                              <option value="1 Piece">1 Piece</option>
                              <option value="2 Piece">2 Piece</option>
                              <option value="3 Piece">3 Piece</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                            <input
                              type="checkbox"
                              checked={editingProduct.isLowestPrice}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  isLowestPrice: e.target.checked,
                                })
                              }
                              className="accent-rose-600 w-4 h-4 rounded cursor-pointer"
                            />
                            <span>Mark as Lowest Price Ever</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                            <input
                              type="checkbox"
                              checked={editingProduct.onSale}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  onSale: e.target.checked,
                                })
                              }
                              className="accent-rose-600 w-4 h-4 rounded cursor-pointer"
                            />
                            <span>Active On Sale</span>
                          </label>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSavingProduct}
                            className="bg-neutral-950 hover:bg-rose-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            {isSavingProduct ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: BRAND PARTNER REQUESTS                            */}
            {/* ======================================================== */}
            {activeTab === "brands" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Incoming Brand Partner Applications ({brandRegistrations.length})
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Review submitted applications from Pakistani fashion brands and toggle radar verification status.
                    </p>
                  </div>
                  <button
                    onClick={loadBrandRegistrations}
                    className="inline-flex items-center gap-1 text-xs text-neutral-700 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>

                {brandFeedback && (
                  <div
                    className={`p-3.5 text-xs rounded-xl flex items-center gap-2.5 font-medium ${
                      brandFeedback.toLowerCase().includes("error") ||
                      brandFeedback.toLowerCase().includes("fail") ||
                      brandFeedback.toLowerCase().includes("deleted")
                        ? "bg-rose-50 border border-rose-200 text-rose-800"
                        : "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    }`}
                  >
                    {brandFeedback.toLowerCase().includes("error") ||
                    brandFeedback.toLowerCase().includes("fail") ? (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    )}
                    <span>{brandFeedback}</span>
                  </div>
                )}

                {brandRegistrations.length > 0 ? (
                  <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs divide-y divide-neutral-100">
                    {brandRegistrations.map((b) => {
                      const isUpdating = updatingBrandId === b.id;
                      const isApproved = b.status === "approved";
                      const isLive = b.status === "live";
                      const isRejected = b.status === "rejected";

                      return (
                        <div
                          key={b.id}
                          className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-bold text-neutral-900">{b.brandName}</h4>
                              <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                                {b.platform}
                              </span>

                              {/* Prominent Verification Badge */}
                              {isApproved && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs">
                                  <Check className="w-3 h-3 text-emerald-600" /> Approved & Storefront Active
                                </span>
                              )}
                              {isLive && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 shadow-2xs">
                                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" /> Live on Radar
                                </span>
                              )}
                              {isRejected && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                                  <XCircle className="w-3 h-3 text-rose-500" /> Rejected
                                </span>
                              )}
                              {!isApproved && !isLive && !isRejected && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-500" /> Pending Review
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-neutral-600">
                              Contact: <strong>{b.contactName}</strong> ({b.contactEmail} • {b.contactPhone || "No phone"})
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-rose-600 pt-0.5">
                              <a
                                href={b.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline flex items-center gap-1"
                              >
                                <span>Website</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <span>•</span>
                              <a
                                href={b.saleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-600 hover:underline flex items-center gap-1"
                              >
                                <span>Sale Collection</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>

                              {/* If approved/live, direct link to check the live brand page on the site */}
                              {(isApproved || isLive) && (
                                <>
                                  <span>•</span>
                                  <Link
                                    href={`/brand/${b.slug}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md"
                                  >
                                    <span>View on Website (/brand/{b.slug})</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Action Controls */}
                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {isUpdating ? (
                              <div className="flex items-center gap-2 text-xs text-neutral-500 font-semibold px-4 py-2 bg-neutral-100 rounded-lg">
                                <Loader2 className="w-4 h-4 animate-spin text-neutral-800" />
                                <span>Updating...</span>
                              </div>
                            ) : (
                              <>
                                {/* Approve Button */}
                                {isApproved ? (
                                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-default select-none">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Approved
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateBrandStatus(b.id, "approved")}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
                                    title="Approve and activate brand on storefront"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>
                                )}

                                {/* Set Live Button */}
                                {isLive ? (
                                  <span className="bg-blue-50 text-blue-800 border border-blue-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-default select-none">
                                    <span className="w-2 h-2 rounded-full bg-blue-600" /> Live
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateBrandStatus(b.id, "live")}
                                    className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                    title="Set brand live on radar"
                                  >
                                    Set Live
                                  </button>
                                )}

                                {/* Reject Button */}
                                {isRejected ? (
                                  <button
                                    onClick={() => handleUpdateBrandStatus(b.id, "approved")}
                                    className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Re-Approve
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateBrandStatus(b.id, "rejected")}
                                    className="bg-white hover:bg-rose-50 text-neutral-600 hover:text-rose-600 border border-neutral-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                    title="Decline this brand application"
                                  >
                                    Reject
                                  </button>
                                )}

                                {/* Delete Trash Icon */}
                                <button
                                  onClick={() => handleDeleteBrand(b.id, b.brandName)}
                                  title="Permanently remove application"
                                  className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center text-xs text-neutral-500 shadow-xs">
                    No brand registration applications currently pending. Brand requests from `/brand-portal` will appear here.
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: VIP SUBSCRIBERS                                   */}
            {/* ======================================================== */}
            {activeTab === "subscribers" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">
                      Registered VIP Sale Alert Subscribers ({subscribers.length})
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Collected securely from the homepage newsletter and sale alert widgets.
                    </p>
                  </div>

                  <a
                    href="/api/subscribers?format=csv"
                    className="inline-flex items-center gap-1.5 bg-neutral-950 hover:bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </a>
                </div>

                <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs">
                  {subscribers.length > 0 ? (
                    <div className="divide-y divide-neutral-100">
                      {subscribers.map((s, idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 font-bold flex items-center justify-center">
                              @
                            </div>
                            <div>
                              <strong className="text-neutral-900">{s.email}</strong>
                              <div className="text-[10px] text-neutral-400">
                                Subscribed: {new Date(s.subscribedAt).toLocaleDateString()} via {s.source}
                              </div>
                            </div>
                          </div>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-xs text-neutral-400">
                      No subscribers collected yet. Subscribers will appear here when visitors submit the newsletter form.
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>

          <Footer />
        </div>
      )}
    </div>
  );
}
