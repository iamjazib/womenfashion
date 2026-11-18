import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogBySlug, getAllBlogs } from "@/lib/blogRegistry";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Tag,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found • Women Fashion",
      description: "The requested fashion article could not be found.",
    };
  }

  const title = blog.seo?.metaTitle || `${blog.title} • Women Fashion Radar`;
  const description = blog.seo?.metaDescription || blog.excerpt;
  const ogImage = blog.seo?.ogImage || blog.coverImage;
  const canonical = blog.seo?.canonical || `https://womenfashion2.vercel.app/blog/${blog.slug}`;

  return {
    title,
    description,
    keywords: blog.seo?.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Women Fashion Radar",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.publishedAt,
      authors: [blog.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Simple helper to parse and render Markdown content into luxury typography HTML
function renderMarkdownContent(content: string) {
  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = (key: number) => {
    if (inList && listItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="space-y-2.5 my-5 pl-2">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-neutral-800 text-base leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(index);
      return;
    }

    // Heading 2
    if (trimmed.startsWith("## ")) {
      flushList(index);
      renderedElements.push(
        <h2
          key={`h2-${index}`}
          className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-10 mb-4 pb-2 border-b border-neutral-100 flex items-center gap-2"
        >
          <span>{trimmed.replace(/^##\s+/, "")}</span>
        </h2>
      );
      return;
    }

    // Heading 3
    if (trimmed.startsWith("### ")) {
      flushList(index);
      renderedElements.push(
        <h3
          key={`h3-${index}`}
          className="text-lg sm:text-xl font-bold text-neutral-900 mt-7 mb-3 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{trimmed.replace(/^###\s+/, "")}</span>
        </h3>
      );
      return;
    }

    // Divider
    if (trimmed === "---" || trimmed === "***") {
      flushList(index);
      renderedElements.push(
        <hr key={`hr-${index}`} className="my-8 border-neutral-200" />
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      flushList(index);
      renderedElements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50/80 to-amber-50/60 border-l-4 border-rose-600 text-neutral-800 italic text-sm sm:text-base leading-relaxed"
        >
          {trimmed.replace(/^>\s+/, "")}
        </blockquote>
      );
      return;
    }

    // Bullet List Item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }

    // Numbered item (e.g. 1. , 2. )
    if (/^\d+\.\s+/.test(trimmed)) {
      flushList(index);
      renderedElements.push(
        <div key={`num-${index}`} className="flex items-start gap-3 my-3 text-neutral-800 text-base leading-relaxed">
          <span className="bg-rose-100 text-rose-700 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            {trimmed.match(/^\d+/)?.[0]}
          </span>
          <div>{trimmed.replace(/^\d+\.\s+/, "")}</div>
        </div>
      );
      return;
    }

    // Standard Paragraph
    flushList(index);
    renderedElements.push(
      <p key={`p-${index}`} className="text-neutral-700 text-base sm:text-lg leading-relaxed my-4">
        {trimmed}
      </p>
    );
  });

  flushList(lines.length);
  return renderedElements;
}

export default async function SingleBlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const allBlogs = getAllBlogs();
  const relatedBlogs = allBlogs
    .filter((b) => b.id !== blog.id)
    .slice(0, 3);

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // JSON-LD Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: [blog.coverImage],
    datePublished: blog.publishedAt,
    dateModified: blog.publishedAt,
    author: {
      "@type": "Person",
      name: blog.author.name,
      jobTitle: blog.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Women Fashion Radar",
      logo: {
        "@type": "ImageObject",
        url: "https://womenfashion2.vercel.app/logos/gul-ahmed.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://womenfashion2.vercel.app/blog/${blog.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-neutral-900 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main className="flex-1 pb-16">
        {/* Breadcrumbs & Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
          <nav className="flex items-center gap-2 text-xs text-neutral-500 font-medium mb-4">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-rose-600 transition-colors">
              Fashion Blog
            </Link>
            <span>/</span>
            <span className="text-neutral-900 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {blog.category}
            </span>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-rose-600 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header Container */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Metadata Pill Row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs mb-4">
            <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
              {blog.category}
            </span>
            <span className="flex items-center gap-1.5 text-neutral-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1.5 text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span>{blog.readTimeMinutes} min read</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-neutral-950 tracking-tight leading-[1.15] mb-6">
            {blog.title}
          </h1>

          {/* Subtitle / Excerpt */}
          <p className="text-base sm:text-xl text-neutral-600 leading-relaxed font-normal mb-8 border-l-2 border-rose-500 pl-4 sm:pl-5">
            {blog.excerpt}
          </p>

          {/* Author Card & Social Share */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-neutral-200 mb-8">
            <div className="flex items-center gap-3">
              {blog.author.avatar ? (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-100 shadow-2xs"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="font-bold text-sm text-neutral-900">{blog.author.name}</div>
                <div className="text-xs text-neutral-500">{blog.author.role || "Fashion Editor"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  blog.title + " " + (blog.seo?.canonical || "")
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5"
              >
                <span>Share WhatsApp</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  blog.title
                )}&url=${encodeURIComponent(blog.seo?.canonical || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 transition-colors flex items-center gap-1.5"
              >
                <span>Share X</span>
              </a>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl mb-10 border border-neutral-200 bg-neutral-100">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-[280px] sm:h-[420px] md:h-[480px] object-cover"
            />
          </div>

          {/* Blog Editorial Body */}
          <div className="prose prose-neutral max-w-none text-neutral-800 text-base sm:text-lg leading-relaxed space-y-2">
            {renderMarkdownContent(blog.content)}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-neutral-200">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-rose-500" />
                <span>Related Topics:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-neutral-100 text-neutral-700 text-xs font-medium px-3 py-1 rounded-full border border-neutral-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* In-Article Live Radar Callout */}
          <div className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-rose-950 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/80 border border-rose-500/30 px-3 py-1 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Pakistan Women's Fashion Live Radar</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Track Verified Clearance Deals Across All 10 Top Brands
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300">
                  Gul Ahmed, Baroque, Asim Jofa, Nishat Linen, Sapphire, and Limelight are scanned every 60 minutes for true price drops.
                </p>
              </div>
              <Link
                href="/"
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all hover:scale-102 shrink-0 flex items-center gap-2"
              >
                <span>Explore Live Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 mt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                  More Fashion Guides & Insights
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Hand-crafted advice for buying designer unstitched lawn and luxury pret.
                </p>
              </div>
              <Link
                href="/blog"
                className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((b) => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col"
                >
                  <div className="h-44 overflow-hidden bg-neutral-100 relative">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      {b.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-neutral-400 mb-1 flex items-center gap-2">
                        <span>{new Date(b.publishedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{b.readTimeMinutes} min read</span>
                      </div>
                      <h3 className="font-bold text-neutral-900 text-sm sm:text-base leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
                        {b.title}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                        {b.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs font-bold text-rose-600">
                      <span>Read Article</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
