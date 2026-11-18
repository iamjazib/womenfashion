"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPost } from "@/types";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Clock,
  Sparkles,
  Search,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Tag,
  User,
  Globe,
  Layers,
  Heading2,
  Heading3,
  Quote,
  List,
  Flame,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const COVER_PRESETS = [
  {
    label: "Designer Lawn (Vibrant)",
    url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=700&fit=crop&q=80",
  },
  {
    label: "Luxury Pret & Chiffon",
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=700&fit=crop&q=80",
  },
  {
    label: "Fashion Shopping Rack",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=700&fit=crop&q=80",
  },
  {
    label: "Pastel Couture Fabric",
    url: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=1200&h=700&fit=crop&q=80",
  },
];

const DEFAULT_CONTENT_TEMPLATE = `## Introduction to the Collection

Every season in Pakistan brings an exciting wave of new designs, lawn fabric prints, and festive embellishments. Whether you are shopping for unstitched 3-piece suits or ready-to-wear kurtas, making an informed choice ensures you get the highest value for your budget.

---

### Key Fabric & Styling Highlights

- **Fabric Purity**: Lightweight, breathable lawn weave perfect for warm weather.
- **Embroidery Detailing**: Precision threadwork, laser-cut borders, and delicate dupattas.
- **Color Palette**: Fresh seasonal pastels paired with vibrant festive contrasts.

> **Shopping Pro Tip**: Always cross-reference the original retail price on our live sale radar before checking out to ensure the discount is authentic.

---

### Final Verdict & Recommendation

For everyday elegance, opt for printed lawn suits with chiffon dupattas. If attending an evening dinner or wedding event, luxury embroidered organza and raw silk collections offer unmatched sophistication.`;

export const AdminBlogManager: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Editor Mode
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [contentTab, setContentTab] = useState<"write" | "preview">("write");

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Lawn & Fabric Guide");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState(DEFAULT_CONTENT_TEMPLATE);
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [tags, setTags] = useState("Lawn Sale, Designer Pret, Pakistan Fashion");
  const [authorName, setAuthorName] = useState("Ayesha Malik");
  const [authorRole, setAuthorRole] = useState("Lead Fashion & Fabric Editor");
  const [authorAvatar, setAuthorAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80");
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [featured, setFeatured] = useState(false);

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [canonical, setCanonical] = useState("");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/blogs", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.blogs)) {
        let loaded = data.blogs;

        // Apply local storage overrides if available (serverless resiliency)
        try {
          const overrides: Record<string, Partial<BlogPost>> = JSON.parse(
            localStorage.getItem("admin_blogs_overrides") || "{}"
          );
          const deletedIds: string[] = JSON.parse(
            localStorage.getItem("admin_blogs_deleted_ids") || "[]"
          );

          loaded = loaded
            .filter((b: BlogPost) => !deletedIds.includes(b.id))
            .map((b: BlogPost) => (overrides[b.id] ? { ...b, ...overrides[b.id] } : b));
        } catch {}

        setBlogs(loaded);
      }
    } catch (err) {
      console.warn("Could not load blogs from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate slug when title changes (if not editing an existing slug)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingBlogId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
      setCanonical(`https://womenfashion2.vercel.app/blog/${generatedSlug}`);
      if (!metaTitle) {
        setMetaTitle(`${val} • Women Fashion`);
      }
    }
  };

  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    if (!metaDescription) {
      setMetaDescription(val);
    }
  };

  const resetForm = () => {
    setEditingBlogId(null);
    setTitle("");
    setSlug("");
    setCategory("Lawn & Fabric Guide");
    setExcerpt("");
    setContent(DEFAULT_CONTENT_TEMPLATE);
    setCoverImage(COVER_PRESETS[0].url);
    setTags("Lawn Sale, Designer Pret, Pakistan Fashion");
    setAuthorName("Ayesha Malik");
    setAuthorRole("Lead Fashion & Fabric Editor");
    setAuthorAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80");
    setReadTimeMinutes(5);
    setStatus("published");
    setFeatured(false);
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("pakistani lawn sale, designer lawn discounts, gul ahmed sale, baroque pret");
    setOgImage("");
    setCanonical("");
    setContentTab("write");
    setFeedback(null);
  };

  const selectBlogForEdit = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setCategory(blog.category);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCoverImage(blog.coverImage);
    setTags(Array.isArray(blog.tags) ? blog.tags.join(", ") : "");
    setAuthorName(blog.author.name);
    setAuthorRole(blog.author.role || "");
    setAuthorAvatar(blog.author.avatar || "");
    setReadTimeMinutes(blog.readTimeMinutes || 5);
    setStatus(blog.status);
    setFeatured(Boolean(blog.featured));
    setMetaTitle(blog.seo?.metaTitle || "");
    setMetaDescription(blog.seo?.metaDescription || "");
    setMetaKeywords(blog.seo?.keywords || "");
    setOgImage(blog.seo?.ogImage || "");
    setCanonical(blog.seo?.canonical || "");
    setContentTab("write");
    setFeedback(null);

    // Scroll to editor smoothly
    const el = document.getElementById("blog-editor-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFeedback({ type: "error", message: "Please provide a blog title." });
      return;
    }

    setIsSaving(true);
    setFeedback(null);

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: (slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      category,
      excerpt: excerpt.trim(),
      content,
      coverImage: coverImage.trim() || COVER_PRESETS[0].url,
      tags: tagArray,
      author: {
        name: authorName.trim() || "Editorial Team",
        role: authorRole.trim() || "Fashion Editor",
        avatar: authorAvatar.trim(),
      },
      readTimeMinutes: Number(readTimeMinutes) || 5,
      status,
      featured,
      seo: {
        metaTitle: metaTitle.trim() || `${title} • Women Fashion`,
        metaDescription: metaDescription.trim() || excerpt.trim() || title.trim(),
        keywords: metaKeywords.trim() || "pakistani lawn sale, designer clothing discounts",
        ogImage: ogImage.trim() || coverImage.trim(),
        canonical: canonical.trim() || `https://womenfashion2.vercel.app/blog/${slug}`,
      },
    };

    try {
      const url = "/api/admin/blogs";
      const method = editingBlogId ? "PUT" : "POST";
      const body = editingBlogId ? { id: editingBlogId, ...payload } : payload;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success && data.blog) {
        setFeedback({
          type: "success",
          message: editingBlogId
            ? `Blog "${data.blog.title}" updated successfully!`
            : `Blog "${data.blog.title}" published successfully!`,
        });

        // Update local state
        setBlogs((prev) => {
          if (editingBlogId) {
            return prev.map((b) => (b.id === editingBlogId ? data.blog : b));
          } else {
            return [data.blog, ...prev];
          }
        });

        // Update localStorage overrides for persistent serverless mirroring
        try {
          const overrides: Record<string, any> = JSON.parse(
            localStorage.getItem("admin_blogs_overrides") || "{}"
          );
          overrides[data.blog.id] = data.blog;
          localStorage.setItem("admin_blogs_overrides", JSON.stringify(overrides));
        } catch {}

        if (!editingBlogId) {
          resetForm();
        }
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to save blog post." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: "Network error saving blog post." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlog = async (id: string, blogTitle: string) => {
    setDeletingId(null);
    setFeedback(null);

    // Optimistic removal
    setBlogs((prev) => prev.filter((b) => b.id !== id));

    // Save to deleted list in localStorage
    try {
      const deletedIds: string[] = JSON.parse(
        localStorage.getItem("admin_blogs_deleted_ids") || "[]"
      );
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem("admin_blogs_deleted_ids", JSON.stringify(deletedIds));
      }
      const overrides = JSON.parse(localStorage.getItem("admin_blogs_overrides") || "{}");
      delete overrides[id];
      localStorage.setItem("admin_blogs_overrides", JSON.stringify(overrides));
    } catch {}

    if (editingBlogId === id) {
      resetForm();
    }

    try {
      const res = await fetch(`/api/admin/blogs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: "success", message: `Blog "${blogTitle}" deleted successfully.` });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to delete blog." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error deleting blog post." });
    }
  };

  const handleToggleStatus = async (blog: BlogPost) => {
    const newStatus = blog.status === "published" ? "draft" : "published";

    // Optimistic update
    setBlogs((prev) =>
      prev.map((b) => (b.id === blog.id ? { ...b, status: newStatus } : b))
    );

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: blog.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          message: `"${blog.title}" is now ${newStatus}.`,
        });
      }
    } catch {}
  };

  // Quick insertion helpers for Markdown content
  const insertSnippet = (snippet: string) => {
    setContent((prev) => `${prev}\n\n${snippet}`);
  };

  // Filtered blogs
  const filteredBlogs = blogs.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Top Banner / Actions Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Fashion Blog & Editorial Manager
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Publish complete articles, guide shoppers on authentic lawn fabrics, and fine-tune dedicated Google SEO meta details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2 rounded-xl transition-all"
          >
            <span>View Live Blog</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </Link>

          <button
            onClick={() => {
              resetForm();
              const el = document.getElementById("blog-editor-form");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
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

      {/* ======================================================== */}
      {/* SECTION 1: BLOG POSTS REPOSITORY & TABLE                 */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-neutral-900">
              Published & Draft Articles ({filteredBlogs.length})
            </h3>
            <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-bold">
              {blogs.filter((b) => b.status === "published").length} Live
            </span>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:bg-white focus:border-neutral-900 focus:outline-hidden"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-medium focus:bg-white focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>

            <button
              onClick={loadBlogs}
              title="Refresh Articles"
              className="p-2 text-neutral-500 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Blogs List */}
        {filteredBlogs.length > 0 ? (
          <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden">
            {filteredBlogs.map((b) => {
              const isSelectedForEdit = editingBlogId === b.id;
              const isLive = b.status === "published";

              return (
                <div
                  key={b.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                    isSelectedForEdit
                      ? "bg-purple-50/50 border-l-4 border-l-purple-600"
                      : "hover:bg-neutral-50/60"
                  }`}
                >
                  {/* Left: Thumbnail & Content Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-20 h-16 sm:w-24 sm:h-16 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                          {b.category}
                        </span>
                        {isLive ? (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Published
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                        {b.featured && (
                          <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" /> Featured
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug line-clamp-1">
                        {b.title}
                      </h4>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                        <span>By {b.author.name}</span>
                        <span>•</span>
                        <span>{new Date(b.publishedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{b.readTimeMinutes} min read</span>
                        <span>•</span>
                        <code className="text-[10px] text-purple-700 font-mono">/blog/{b.slug}</code>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <Link
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      className="p-2 text-neutral-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg border border-neutral-200 transition-colors"
                      title="View Live Blog Post"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleToggleStatus(b)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isLive
                          ? "bg-white hover:bg-amber-50 text-neutral-700 hover:text-amber-700 border-neutral-200"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                      }`}
                      title={isLive ? "Set to Draft" : "Publish to Live Website"}
                    >
                      {isLive ? "Unpublish" : "Publish Live"}
                    </button>

                    <button
                      onClick={() => selectBlogForEdit(b)}
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Inline Delete Confirm */}
                    {deletingId === b.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 border border-rose-300 p-1 rounded-lg">
                        <span className="text-[11px] font-bold text-rose-700 px-1">Delete?</span>
                        <button
                          onClick={() => handleDeleteBlog(b.id, b.title)}
                          className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-[11px] font-bold px-2 py-0.5 rounded cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(b.id)}
                        title="Delete blog post"
                        className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-neutral-400 border border-dashed border-neutral-200 rounded-2xl">
            No blog posts found matching your filter. Use the editor below to write a new blog post!
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: BLOG POST COMPOSER & SEO EDITOR               */}
      {/* ======================================================== */}
      <div id="blog-editor-form" className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-5 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                {editingBlogId ? "Editing Article Mode" : "New Article Composer"}
              </span>
              {editingBlogId && (
                <span className="text-xs text-neutral-400 font-mono">ID: {editingBlogId}</span>
              )}
            </div>
            <h3 className="text-xl font-black text-neutral-900 mt-1">
              {editingBlogId ? `Update: "${title || "Untitled"}"` : "Create & Upload New Fashion Blog"}
            </h3>
          </div>

          {editingBlogId && (
            <button
              onClick={resetForm}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              Cancel Edit & Create New
            </button>
          )}
        </div>

        <form onSubmit={handleSaveBlog} className="space-y-8">
          {/* Group 1: Core Article Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>1. Basic Article Information</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. The Complete Guide to Buying Authentic Lawn on Sale"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  URL Slug (Auto-generated) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-mono pl-1 hidden sm:inline">/blog/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setCanonical(`https://womenfashion2.vercel.app/blog/${e.target.value}`);
                    }}
                    placeholder="e.g. guide-to-buying-authentic-lawn"
                    className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-sm font-mono text-purple-800 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden"
                >
                  <option value="Lawn & Fabric Guide">Lawn & Fabric Guide</option>
                  <option value="Brand Comparisons">Brand Comparisons</option>
                  <option value="Shopping Tips">Shopping Tips</option>
                  <option value="Trends & Styling">Trends & Styling</option>
                  <option value="Clearance Alerts">Clearance Alerts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden"
                >
                  <option value="published">Published (Live for Visitors)</option>
                  <option value="draft">Draft (Private Save)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Estimated Read Time (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={readTimeMinutes}
                  onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                Short Excerpt / Teaser Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                placeholder="2-3 sentences summarizing the article for cards, social shares, and Google snippets..."
                className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-700">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                />
                <span>Feature this article on the blog header spotlight</span>
              </label>
            </div>
          </div>

          {/* Group 2: Author & Cover Image */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-600" />
              <span>2. Author & Cover Image</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Ayesha Malik"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Author Role
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Fabric & Couture Specialist"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Author Avatar URL (Optional)
                </label>
                <input
                  type="url"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                Cover Image URL <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => {
                    setCoverImage(e.target.value);
                    if (!ogImage) setOgImage(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs sm:text-sm font-mono text-neutral-800 focus:bg-white focus:outline-hidden"
                />
                {coverImage && (
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-20 h-11 rounded-lg object-cover border border-neutral-200 shadow-2xs"
                  />
                )}
              </div>

              {/* 1-Click Image Presets */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[11px] text-neutral-400 font-medium">1-Click Presets:</span>
                {COVER_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCoverImage(p.url);
                      if (!ogImage) setOgImage(p.url);
                    }}
                    className="text-[10px] font-semibold bg-neutral-100 hover:bg-purple-50 hover:text-purple-700 border border-neutral-200 px-2 py-0.5 rounded-md transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Group 3: Complete Blog Content (Markdown & Live Preview) */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>3. Complete Blog Body Content (Markdown Supported)</span>
              </h4>

              {/* Tabs: Write vs Preview */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setContentTab("write")}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    contentTab === "write"
                      ? "bg-white text-neutral-900 shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  Write Content
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab("preview")}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    contentTab === "preview"
                      ? "bg-white text-neutral-900 shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Live Preview</span>
                </button>
              </div>
            </div>

            {/* Formatting Snippets Toolbar */}
            {contentTab === "write" && (
              <div className="flex flex-wrap items-center gap-2 p-2 bg-neutral-50 border border-neutral-200 rounded-xl">
                <span className="text-[11px] text-neutral-400 font-semibold px-1">Insert Helper:</span>
                <button
                  type="button"
                  onClick={() => insertSnippet("## Section Heading Title Here\n\nWrite your section explanation here.")}
                  className="text-[11px] font-bold bg-white hover:bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-md transition-colors"
                >
                  + H2 Heading
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("### Subheading Point\n\nDetailed breakdown of this point.")}
                  className="text-[11px] font-bold bg-white hover:bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-md transition-colors"
                >
                  + H3 Subheading
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("- Point 1: Fabric count details\n- Point 2: Stitched vs unstitched\n- Point 3: Sale timeline")}
                  className="text-[11px] font-bold bg-white hover:bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-md transition-colors"
                >
                  + Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("> **Editorial Note**: Always verify lawn meterage before purchase to ensure ample fabric for modern long-shirt tailoring.")}
                  className="text-[11px] font-bold bg-white hover:bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-md transition-colors"
                >
                  + Quote Callout
                </button>
                <button
                  type="button"
                  onClick={() => insertSnippet("1. Step One: Check the brand's verified sale tab.\n2. Step Two: Cross-reference historical clearance prices.\n3. Step Three: Complete direct brand checkout.")}
                  className="text-[11px] font-bold bg-white hover:bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-md transition-colors"
                >
                  + Numbered Steps
                </button>
              </div>
            )}

            {/* Content Write vs Preview Viewports */}
            {contentTab === "write" ? (
              <textarea
                rows={16}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your complete blog story in clean Markdown..."
                className="w-full p-4 bg-neutral-50/60 border border-neutral-200 rounded-2xl font-mono text-xs sm:text-sm text-neutral-800 leading-relaxed focus:bg-white focus:border-neutral-900 focus:outline-hidden transition-all"
              />
            ) : (
              <div className="p-6 sm:p-8 bg-neutral-50/50 border border-neutral-200 rounded-2xl min-h-[380px] prose prose-neutral max-w-none text-neutral-800">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">
                  Preview Mode ({category})
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">{title || "Your Blog Title"}</h1>
                <p className="text-neutral-500 italic mb-6 border-l-2 border-purple-500 pl-3">{excerpt || "Excerpt preview will appear here..."}</p>
                <div className="space-y-4 whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed">
                  {content}
                </div>
              </div>
            )}
          </div>

          {/* Group 4: Dedicated Google Search Engine Meta Details */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                <span>4. Dedicated SEO Meta Details (Google Search & Social Cards)</span>
              </h4>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                SEO Optimized
              </span>
            </div>

            {/* Live Google Search Preview Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Google Search Result Preview
              </div>
              <div className="text-xs text-neutral-600 font-mono truncate">
                https://womenfashion2.vercel.app &rsaquo; blog &rsaquo; {slug || "your-blog-slug"}
              </div>
              <div className="text-base sm:text-lg text-blue-700 font-medium hover:underline cursor-pointer line-clamp-1">
                {metaTitle || `${title || "Article Title"} • Women Fashion`}
              </div>
              <div className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                {metaDescription || excerpt || "Your meta description snippet will appear here on Google searches..."}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-neutral-800">
                    Meta Title (Google Title)
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {metaTitle.length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. Buying Designer Lawn on Sale in Pakistan (2026 Guide)"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Meta Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="e.g. lawn sale, pakistani designer lawn, gul ahmed, baroque, asim jofa"
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-900 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-800">
                  Meta Description (Google Snippet)
                </label>
                <span className="text-[10px] font-mono text-neutral-400">
                  {metaDescription.length}/160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Write an enticing summary for Google searchers (recommended: 140-160 characters)..."
                className="w-full px-3.5 py-2 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  OpenGraph Social Image URL
                </label>
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-800 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={canonical}
                  onChange={(e) => setCanonical(e.target.value)}
                  placeholder="https://womenfashion2.vercel.app/blog/..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-800 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-400">
              * Articles are automatically published to <code className="font-mono text-purple-700">/blog/{slug || "slug"}</code> upon saving.
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {editingBlogId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                >
                  Discard Changes
                </button>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Article...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingBlogId ? "Update Article" : "Publish Blog Post"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
