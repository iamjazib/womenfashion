"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteContent } from "@/types";
import { DEFAULT_SITE_CONTENT } from "@/data/defaultSiteContent";

interface SiteContentContextType {
  content: SiteContent;
  isLoading: boolean;
  updateContent: (newContent: Partial<SiteContent>) => Promise<{ success: boolean; error?: string }>;
  resetContent: () => Promise<boolean>;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Immediately apply any locally cached overrides to prevent layout shifts
    try {
      const cached = localStorage.getItem("admin_site_content_overrides");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          setContent((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {}

    // 2. Fetch live config from server API
    fetchRemoteContent();
  }, []);

  const fetchRemoteContent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/site-content", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.content) {
        setContent(data.content);
        try {
          localStorage.setItem("admin_site_content_overrides", JSON.stringify(data.content));
        } catch {}
      }
    } catch (err) {
      console.warn("Could not load remote site content:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (newContent: Partial<SiteContent>): Promise<{ success: boolean; error?: string }> => {
    // Optimistic UI update
    const merged = { ...content, ...newContent };
    setContent(merged);

    try {
      localStorage.setItem("admin_site_content_overrides", JSON.stringify(merged));
    } catch {}

    try {
      const res = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
      });
      const data = await res.json();
      if (data.success && data.content) {
        setContent(data.content);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to update content." };
      }
    } catch (err: any) {
      return { success: false, error: "Network error updating site content." };
    }
  };

  const resetContent = async (): Promise<boolean> => {
    setContent(DEFAULT_SITE_CONTENT);
    try {
      localStorage.removeItem("admin_site_content_overrides");
    } catch {}

    try {
      const res = await fetch("/api/admin/site-content", { method: "DELETE" });
      const data = await res.json();
      return Boolean(data.success);
    } catch {
      return false;
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        isLoading,
        updateContent,
        resetContent,
        refreshContent: fetchRemoteContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextType => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    return {
      content: DEFAULT_SITE_CONTENT,
      isLoading: false,
      updateContent: async () => ({ success: false, error: "Context not mounted" }),
      resetContent: async () => false,
      refreshContent: async () => {},
    };
  }
  return ctx;
};
