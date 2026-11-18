"use client";

import React, { useState, useEffect } from "react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SiteContent } from "@/types";
import { DEFAULT_SITE_CONTENT } from "@/data/defaultSiteContent";
import {
  Type,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Layers,
  Flame,
  Search,
  ShieldCheck,
  Building2,
  Info,
  Mail,
  FileText,
  Eye,
  ExternalLink,
} from "lucide-react";

export const AdminSiteContentManager: React.FC = () => {
  const { content, updateContent, resetContent } = useSiteContent();

  const [formState, setFormState] = useState<SiteContent>(content);
  const [activeSection, setActiveSection] = useState<
    "hero" | "announcement" | "catalog" | "partner" | "about" | "cta" | "footer"
  >("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setFormState(content);
  }, [content]);

  const handleChange = (
    section: keyof SiteContent,
    field: string,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const res = await updateContent(formState);
    setIsSaving(false);

    if (res.success) {
      setFeedback({
        type: "success",
        message: "Website text content saved and updated across the entire site!",
      });
    } else {
      setFeedback({
        type: "error",
        message: res.error || "Failed to update website content.",
      });
    }
  };

  const handleResetSection = (section: keyof SiteContent) => {
    setFormState((prev) => ({
      ...prev,
      [section]: { ...DEFAULT_SITE_CONTENT[section] },
    }));
    setFeedback({
      type: "success",
      message: `Reset ${String(section).toUpperCase()} section to default text. Remember to click Save.`,
    });
  };

  const handleResetAll = async () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Are you sure you want to reset all website text to factory defaults?")
    ) {
      return;
    }

    const success = await resetContent();
    if (success) {
      setFormState(DEFAULT_SITE_CONTENT);
      setFeedback({
        type: "success",
        message: "All website text restored to original factory defaults.",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Type className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Website Copy & Text Manager
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Edit headlines, subtitles, button texts, guarantees, and footer copy across all public sections of the website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-rose-600 bg-neutral-100 hover:bg-rose-50 px-3.5 py-2 rounded-xl transition-all border border-neutral-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Default</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2 rounded-xl transition-all"
          >
            <span>Preview Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </a>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Grid: Section Selector (Left) + Editor Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Section Selector Pills */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200 p-4 shadow-xs space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5 mb-1">
            Select Section to Edit
          </div>

          {[
            { id: "hero", label: "1. Hero Banner & Search Bar", icon: Sparkles, color: "text-rose-600" },
            { id: "announcement", label: "2. Top Bar & 30-Day Countdown", icon: Flame, color: "text-amber-500" },
            { id: "catalog", label: "3. Deals Catalog Header", icon: Layers, color: "text-emerald-600" },
            { id: "partner", label: "4. Brand Partner Section", icon: Building2, color: "text-purple-600" },
            { id: "about", label: "5. About Us & Guarantee", icon: Info, color: "text-blue-600" },
            { id: "cta", label: "6. VIP Alert & Newsletter", icon: Mail, color: "text-pink-600" },
            { id: "footer", label: "7. Footer Information", icon: FileText, color: "text-neutral-600" },
          ].map((sec) => {
            const active = activeSection === sec.id;
            const Icon = sec.icon;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id as any)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-neutral-950 text-white shadow-xs"
                    : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? "text-rose-400" : sec.color}`} />
                  <span>{sec.label}</span>
                </div>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
              </button>
            );
          })}
        </div>

        {/* Right Column: Editor Form for Selected Section */}
        <form onSubmit={handleSave} className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                Active Section
              </span>
              <h3 className="text-lg font-black text-neutral-900 mt-1 capitalize">
                {activeSection} Section Copy
              </h3>
            </div>

            <button
              type="button"
              onClick={() => handleResetSection(activeSection)}
              className="text-xs font-semibold text-neutral-500 hover:text-rose-600 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-neutral-50 border border-neutral-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Section</span>
            </button>
          </div>

          {/* 1. HERO SECTION */}
          {activeSection === "hero" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Pulsing Top Badge Text
                </label>
                <input
                  type="text"
                  value={formState.hero.badgeText}
                  onChange={(e) => handleChange("hero", "badgeText", e.target.value)}
                  placeholder="e.g. WOMEN FASHION RADAR • 263 Verified Discounts"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Main Headline (Line 1 - White)
                  </label>
                  <input
                    type="text"
                    value={formState.hero.titleLine1}
                    onChange={(e) => handleChange("hero", "titleLine1", e.target.value)}
                    placeholder="e.g. Pakistani Women's Fashion Sales."
                    className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-serif font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Headline Accent (Line 2 - Luxury Gradient)
                  </label>
                  <input
                    type="text"
                    value={formState.hero.titleLine2}
                    onChange={(e) => handleChange("hero", "titleLine2", e.target.value)}
                    placeholder="e.g. All Brands In One Luxury Radar."
                    className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-serif font-bold text-rose-700 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Hero Subtitle Paragraph
                </label>
                <textarea
                  rows={3}
                  value={formState.hero.subtitle}
                  onChange={(e) => handleChange("hero", "subtitle", e.target.value)}
                  placeholder="Describe the platform value proposition..."
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Search Box Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={formState.hero.searchPlaceholder}
                    onChange={(e) => handleChange("hero", "searchPlaceholder", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Search Button Label
                  </label>
                  <input
                    type="text"
                    value={formState.hero.searchButtonText}
                    onChange={(e) => handleChange("hero", "searchButtonText", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Trust Highlights (Under Search Bar)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-semibold block mb-1">Badge 1</span>
                    <input
                      type="text"
                      value={formState.hero.trustBadge1}
                      onChange={(e) => handleChange("hero", "trustBadge1", e.target.value)}
                      className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-semibold block mb-1">Badge 2</span>
                    <input
                      type="text"
                      value={formState.hero.trustBadge2}
                      onChange={(e) => handleChange("hero", "trustBadge2", e.target.value)}
                      className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 font-semibold block mb-1">Badge 3</span>
                    <input
                      type="text"
                      value={formState.hero.trustBadge3}
                      onChange={(e) => handleChange("hero", "trustBadge3", e.target.value)}
                      className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. ANNOUNCEMENT & COUNTDOWN SECTION */}
          {activeSection === "announcement" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Header Top Announcement Bar Notice
                </label>
                <input
                  type="text"
                  value={formState.announcement.topBarAlert}
                  onChange={(e) => handleChange("announcement", "topBarAlert", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Countdown Section Pill Badge
                </label>
                <input
                  type="text"
                  value={formState.announcement.countdownBadge}
                  onChange={(e) => handleChange("announcement", "countdownBadge", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Countdown Main Headline
                </label>
                <input
                  type="text"
                  value={formState.announcement.countdownTitle}
                  onChange={(e) => handleChange("announcement", "countdownTitle", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Countdown Explanatory Subtitle
                </label>
                <textarea
                  rows={3}
                  value={formState.announcement.countdownSubtitle}
                  onChange={(e) => handleChange("announcement", "countdownSubtitle", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* 3. CATALOG SECTION */}
          {activeSection === "catalog" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Catalog Section Badge Pill
                </label>
                <input
                  type="text"
                  value={formState.catalog.badge}
                  onChange={(e) => handleChange("catalog", "badge", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Catalog Main Headline
                </label>
                <input
                  type="text"
                  value={formState.catalog.title}
                  onChange={(e) => handleChange("catalog", "title", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Catalog Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formState.catalog.subtitle}
                  onChange={(e) => handleChange("catalog", "subtitle", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* 4. BRAND PARTNER SECTION */}
          {activeSection === "partner" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Partner Section Badge
                </label>
                <input
                  type="text"
                  value={formState.partner.badgeText}
                  onChange={(e) => handleChange("partner", "badgeText", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Partner Invitation Headline
                </label>
                <input
                  type="text"
                  value={formState.partner.title}
                  onChange={(e) => handleChange("partner", "title", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Partner Description
                </label>
                <textarea
                  rows={2}
                  value={formState.partner.subtitle}
                  onChange={(e) => handleChange("partner", "subtitle", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Features Callout Headline
                </label>
                <input
                  type="text"
                  value={formState.partner.featuresHeadline}
                  onChange={(e) => handleChange("partner", "featuresHeadline", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Features Detailed Description
                </label>
                <textarea
                  rows={2}
                  value={formState.partner.featuresDescription}
                  onChange={(e) => handleChange("partner", "featuresDescription", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* 5. ABOUT US & GUARANTEE */}
          {activeSection === "about" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  About Badge Pill
                </label>
                <input
                  type="text"
                  value={formState.about.badge}
                  onChange={(e) => handleChange("about", "badge", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  About Main Headline
                </label>
                <input
                  type="text"
                  value={formState.about.title}
                  onChange={(e) => handleChange("about", "title", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  About Body Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={formState.about.paragraph1}
                  onChange={(e) => handleChange("about", "paragraph1", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  About Body Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={formState.about.paragraph2}
                  onChange={(e) => handleChange("about", "paragraph2", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Consumer Guarantee Title
                </label>
                <input
                  type="text"
                  value={formState.about.guaranteeTitle}
                  onChange={(e) => handleChange("about", "guaranteeTitle", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Consumer Guarantee Description
                </label>
                <textarea
                  rows={2}
                  value={formState.about.guaranteeDescription}
                  onChange={(e) => handleChange("about", "guaranteeDescription", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* 6. VIP ALERT & NEWSLETTER */}
          {activeSection === "cta" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  VIP Section Badge
                </label>
                <input
                  type="text"
                  value={formState.cta.badge}
                  onChange={(e) => handleChange("cta", "badge", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  VIP Headline
                </label>
                <input
                  type="text"
                  value={formState.cta.title}
                  onChange={(e) => handleChange("cta", "title", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  VIP Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formState.cta.subtitle}
                  onChange={(e) => handleChange("cta", "subtitle", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    value={formState.cta.buttonText}
                    onChange={(e) => handleChange("cta", "buttonText", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Success Toast Message
                  </label>
                  <input
                    type="text"
                    value={formState.cta.successMessage}
                    onChange={(e) => handleChange("cta", "successMessage", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 7. FOOTER SECTION */}
          {activeSection === "footer" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Footer Brand Mission & Description
                </label>
                <textarea
                  rows={3}
                  value={formState.footer.aboutText}
                  onChange={(e) => handleChange("footer", "aboutText", e.target.value)}
                  className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Copyright Notice
                </label>
                <input
                  type="text"
                  value={formState.footer.copyrightText}
                  onChange={(e) => handleChange("footer", "copyrightText", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Save Action Button Bar */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-neutral-400">
              Changes apply instantly to live visitors upon saving.
            </span>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-neutral-950 to-neutral-800 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Website Text Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
