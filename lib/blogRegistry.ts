import fs from "fs";
import path from "path";
import os from "os";
import { BlogPost } from "@/types";
import { INITIAL_BLOGS } from "@/data/blogs";

const LOCAL_BLOGS_FILE = path.join(process.cwd(), "data", "blogs.json");
const TMP_BLOGS_FILE = path.join(os.tmpdir(), "blogs-data.json");

let memoryBlogs: BlogPost[] | null = null;

function loadBlogs(): BlogPost[] {
  if (memoryBlogs !== null) {
    return memoryBlogs;
  }

  // 1. Check /tmp serverless mirror
  try {
    if (fs.existsSync(TMP_BLOGS_FILE)) {
      const content = fs.readFileSync(TMP_BLOGS_FILE, "utf8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryBlogs = parsed;
        return memoryBlogs;
      }
    }
  } catch {}

  // 2. Check local data/blogs.json if exists
  try {
    if (fs.existsSync(LOCAL_BLOGS_FILE)) {
      const content = fs.readFileSync(LOCAL_BLOGS_FILE, "utf8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryBlogs = parsed;
        return memoryBlogs;
      }
    }
  } catch {}

  // 3. Fallback to INITIAL_BLOGS
  memoryBlogs = [...INITIAL_BLOGS];
  return memoryBlogs;
}

function persistBlogs(blogs: BlogPost[]) {
  memoryBlogs = [...blogs];

  // 1. Write to tmp (writable in Vercel Lambdas)
  try {
    fs.writeFileSync(TMP_BLOGS_FILE, JSON.stringify(blogs, null, 2), "utf8");
  } catch {}

  // 2. Write to local file if writable
  try {
    const dir = path.dirname(LOCAL_BLOGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_BLOGS_FILE, JSON.stringify(blogs, null, 2), "utf8");
  } catch {}
}

export function getAllBlogs(includeDrafts: boolean = false): BlogPost[] {
  const blogs = loadBlogs();
  if (includeDrafts) {
    return blogs;
  }
  return blogs.filter((b) => b.status === "published");
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  const blogs = loadBlogs();
  const normalized = slug.toLowerCase().trim();
  return blogs.find((b) => b.slug.toLowerCase().trim() === normalized);
}

export function getBlogById(id: string): BlogPost | undefined {
  const blogs = loadBlogs();
  return blogs.find((b) => b.id === id);
}

export function createBlog(data: Partial<BlogPost>): { success: boolean; blog?: BlogPost; error?: string } {
  try {
    const title = (data.title || "").trim();
    if (!title) {
      return { success: false, error: "Blog title is required." };
    }

    const slug = (data.slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const blogs = loadBlogs();
    if (blogs.some((b) => b.slug === slug)) {
      return { success: false, error: `A blog post with slug "${slug}" already exists.` };
    }

    const newBlog: BlogPost = {
      id: `blog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug,
      title,
      excerpt: (data.excerpt || title).trim(),
      content: data.content || "## New Blog Post\n\nContent coming soon...",
      coverImage: data.coverImage || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=700&fit=crop&q=80",
      category: data.category || "Fashion & Trends",
      tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ["Women Fashion", "Pakistan Sales"],
      author: {
        name: data.author?.name || "Editorial Team",
        role: data.author?.role || "Fashion Contributor",
        avatar: data.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80",
      },
      publishedAt: data.publishedAt || new Date().toISOString(),
      readTimeMinutes: Number(data.readTimeMinutes) || 5,
      featured: Boolean(data.featured),
      status: data.status === "draft" ? "draft" : "published",
      seo: {
        metaTitle: data.seo?.metaTitle || `${title} • Women Fashion`,
        metaDescription: data.seo?.metaDescription || data.excerpt || title,
        keywords: data.seo?.keywords || "pakistani lawn sale, women fashion blogs, designer clearance",
        ogImage: data.seo?.ogImage || data.coverImage,
        canonical: data.seo?.canonical || `https://womenfashion2.vercel.app/blog/${slug}`,
      },
    };

    const updated = [newBlog, ...blogs];
    persistBlogs(updated);

    return { success: true, blog: newBlog };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to create blog post." };
  }
}

export function updateBlog(id: string, updates: Partial<BlogPost>): { success: boolean; blog?: BlogPost; error?: string } {
  try {
    const blogs = loadBlogs();
    const index = blogs.findIndex((b) => b.id === id);
    if (index === -1) {
      return { success: false, error: `Blog post with id "${id}" not found.` };
    }

    const current = blogs[index];
    const newSlug = updates.slug
      ? updates.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
      : current.slug;

    // Check slug collision
    if (newSlug !== current.slug && blogs.some((b) => b.id !== id && b.slug === newSlug)) {
      return { success: false, error: `Another blog with slug "${newSlug}" already exists.` };
    }

    const updatedBlog: BlogPost = {
      ...current,
      ...updates,
      id: current.id,
      slug: newSlug,
      title: updates.title ? updates.title.trim() : current.title,
      excerpt: updates.excerpt ? updates.excerpt.trim() : current.excerpt,
      content: updates.content !== undefined ? updates.content : current.content,
      coverImage: updates.coverImage || current.coverImage,
      category: updates.category || current.category,
      tags: updates.tags || current.tags,
      author: {
        ...current.author,
        ...(updates.author || {}),
      },
      readTimeMinutes: updates.readTimeMinutes !== undefined ? Number(updates.readTimeMinutes) : current.readTimeMinutes,
      featured: updates.featured !== undefined ? Boolean(updates.featured) : current.featured,
      status: updates.status || current.status,
      seo: {
        ...current.seo,
        ...(updates.seo || {}),
        canonical: updates.seo?.canonical || `https://womenfashion2.vercel.app/blog/${newSlug}`,
      },
    };

    blogs[index] = updatedBlog;
    persistBlogs(blogs);

    return { success: true, blog: updatedBlog };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update blog post." };
  }
}

export function deleteBlog(id: string): { success: boolean; error?: string } {
  try {
    const blogs = loadBlogs();
    const filtered = blogs.filter((b) => b.id !== id);
    if (filtered.length === blogs.length) {
      return { success: false, error: "Blog not found." };
    }

    persistBlogs(filtered);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete blog post." };
  }
}
