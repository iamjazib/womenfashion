import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getAllBlogs } from "@/lib/blogRegistry";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Search,
  Flame,
  Tag,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pakistani Fashion Blog & Lawn Sale Guides • Women Fashion",
  description: "Expert guides on buying authentic Pakistani designer lawn, comparing luxury chiffon collections (Baroque, Asim Jofa, Gul Ahmed, Sapphire), and spotting genuine sale discounts.",
  keywords: "pakistani fashion blog, designer lawn guide, baroque vs asim jofa, lawn sale advice, authentic discount tracker",
  alternates: {
    canonical: "https://womenfashion2.vercel.app/blog",
  },
  openGraph: {
    title: "Pakistani Fashion Blog & Lawn Sale Guides • Women Fashion",
    description: "Expert guides on buying authentic Pakistani designer lawn, luxury pret reviews, and sale tips.",
    url: "https://womenfashion2.vercel.app/blog",
    siteName: "Women Fashion Radar",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const blogs = getAllBlogs();
  const featuredBlog = blogs.find((b) => b.featured) || blogs[0];
  const regularBlogs = blogs.filter((b) => b.id !== featuredBlog?.id);

  const categories = [
    "All Guides",
    "Lawn & Fabric Guide",
    "Brand Comparisons",
    "Shopping Tips",
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-neutral-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pb-16">
        {/* Editorial Hero Header */}
        <section className="bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white py-14 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(225,29,72,0.18),transparent_50%)]" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>WOMEN FASHION EDITORIAL</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
              Designer Lawn Guides, Fabric Analysis & Genuine Sale Advice
            </h1>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
              Curated by fashion specialists tracking Pakistan's top couture houses: Gul Ahmed, Baroque, Asim Jofa, Nishat Linen, Sapphire, and Limelight.
            </p>
          </div>
        </section>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
          {/* Spotlight / Featured Blog Card */}
          {featuredBlog && (
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-rose-600 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Editor's Spotlight</span>
              </div>

              <Link
                href={`/blog/${featuredBlog.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="lg:col-span-7 h-64 sm:h-80 lg:h-full overflow-hidden bg-neutral-100 relative min-h-[260px]">
                  <img
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {featuredBlog.category}
                  </span>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span>{new Date(featuredBlog.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-rose-600 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredBlog.readTimeMinutes} min read
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 group-hover:text-rose-600 transition-colors leading-tight">
                      {featuredBlog.title}
                    </h2>

                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3">
                      {featuredBlog.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={featuredBlog.author.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80"}
                        alt={featuredBlog.author.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-200"
                      />
                      <span className="text-xs font-bold text-neutral-800">
                        {featuredBlog.author.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Regular Articles Section */}
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-neutral-200 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                Latest Articles ({blogs.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {regularBlogs.map((b) => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="group bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
                >
                  <div className="h-52 overflow-hidden bg-neutral-100 relative">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-neutral-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                      {b.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-2">
                        <span>{new Date(b.publishedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-neutral-600 font-medium">{b.readTimeMinutes} min read</span>
                      </div>

                      <h3 className="font-bold text-neutral-900 text-base sm:text-lg leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
                        {b.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {b.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs text-neutral-500 font-medium">
                        By {b.author.name}
                      </span>
                      <span className="text-xs font-bold text-rose-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
