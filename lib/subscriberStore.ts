import fs from "fs";
import path from "path";

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  source: string;
  status: "active" | "unsubscribed";
}

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");

// In-memory fallback if filesystem write is restricted in ephemeral serverless environments
let memorySubscribers: Subscriber[] = [];

/**
 * Retrieve all registered newsletter subscribers
 */
export function getSubscribers(): Subscriber[] {
  try {
    if (fs.existsSync(SUBSCRIBERS_FILE)) {
      const content = fs.readFileSync(SUBSCRIBERS_FILE, "utf8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed)) {
        memorySubscribers = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Could not read subscribers from disk, using memory store:", error);
  }
  return memorySubscribers;
}

/**
 * Validate email format with RFC 5322 regex
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email.trim());
}

/**
 * Add a new subscriber to the local project store
 */
export function addSubscriber(
  rawEmail: string,
  source: string = "homepage_cta"
): { success: boolean; subscriber: Subscriber; isNew: boolean; error?: string } {
  const email = rawEmail.trim().toLowerCase();

  if (!isValidEmail(email)) {
    return {
      success: false,
      subscriber: {} as Subscriber,
      isNew: false,
      error: "Please enter a valid email address.",
    };
  }

  const currentList = getSubscribers();
  const existing = currentList.find((s) => s.email.toLowerCase() === email);

  if (existing) {
    return {
      success: true,
      subscriber: existing,
      isNew: false,
    };
  }

  const newSubscriber: Subscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email,
    subscribedAt: new Date().toISOString(),
    source,
    status: "active",
  };

  const updatedList = [newSubscriber, ...currentList];
  memorySubscribers = updatedList;

  try {
    const dir = path.dirname(SUBSCRIBERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(updatedList, null, 2), "utf8");
  } catch (error) {
    console.warn("Could not write subscribers to disk, persisted in memory:", error);
  }

  return {
    success: true,
    subscriber: newSubscriber,
    isNew: true,
  };
}
