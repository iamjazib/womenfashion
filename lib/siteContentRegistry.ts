import fs from "fs";
import path from "path";
import os from "os";
import { SiteContent } from "@/types";
import { DEFAULT_SITE_CONTENT } from "@/data/defaultSiteContent";

const LOCAL_CONTENT_FILE = path.join(process.cwd(), "data", "site-content.json");
const TMP_CONTENT_FILE = path.join(os.tmpdir(), "site-content.json");

let memoryContent: SiteContent | null = null;

function deepMerge(target: any, source: any): any {
  const output = { ...target };
  if (source && typeof source === "object") {
    Object.keys(source).forEach((key) => {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        output[key] = deepMerge(target[key] || {}, source[key]);
      } else if (source[key] !== undefined) {
        output[key] = source[key];
      }
    });
  }
  return output;
}

export function getSiteContent(): SiteContent {
  if (memoryContent !== null) {
    return memoryContent;
  }

  // 1. Check /tmp serverless mirror
  try {
    if (fs.existsSync(TMP_CONTENT_FILE)) {
      const content = fs.readFileSync(TMP_CONTENT_FILE, "utf8");
      const parsed = JSON.parse(content || "{}");
      if (parsed && typeof parsed === "object") {
        const merged = deepMerge(DEFAULT_SITE_CONTENT, parsed) as SiteContent;
        memoryContent = merged;
        return merged;
      }
    }
  } catch {}

  // 2. Check local data/site-content.json
  try {
    if (fs.existsSync(LOCAL_CONTENT_FILE)) {
      const content = fs.readFileSync(LOCAL_CONTENT_FILE, "utf8");
      const parsed = JSON.parse(content || "{}");
      if (parsed && typeof parsed === "object") {
        const merged = deepMerge(DEFAULT_SITE_CONTENT, parsed) as SiteContent;
        memoryContent = merged;
        return merged;
      }
    }
  } catch {}

  // 3. Fallback
  memoryContent = { ...DEFAULT_SITE_CONTENT };
  return memoryContent;
}

export function updateSiteContent(updates: Partial<SiteContent>): {
  success: boolean;
  content: SiteContent;
  error?: string;
} {
  try {
    const current = getSiteContent();
    const merged = deepMerge(current, updates);
    memoryContent = merged;

    // 1. Write to tmp (writable in Vercel lambdas)
    try {
      fs.writeFileSync(TMP_CONTENT_FILE, JSON.stringify(merged, null, 2), "utf8");
    } catch {}

    // 2. Write to local file if writable
    try {
      const dir = path.dirname(LOCAL_CONTENT_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(LOCAL_CONTENT_FILE, JSON.stringify(merged, null, 2), "utf8");
    } catch {}

    return { success: true, content: merged };
  } catch (err: any) {
    return {
      success: false,
      content: getSiteContent(),
      error: err?.message || "Failed to update website content.",
    };
  }
}

export function resetSiteContent(): { success: boolean; content: SiteContent } {
  memoryContent = { ...DEFAULT_SITE_CONTENT };

  try {
    fs.writeFileSync(TMP_CONTENT_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), "utf8");
  } catch {}

  try {
    fs.writeFileSync(LOCAL_CONTENT_FILE, JSON.stringify(DEFAULT_SITE_CONTENT, null, 2), "utf8");
  } catch {}

  return { success: true, content: DEFAULT_SITE_CONTENT };
}
