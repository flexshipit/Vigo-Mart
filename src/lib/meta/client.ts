"use client";

declare global {
  interface Window {
    fbq?: (
      command: "track" | "init" | "trackCustom",
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
  }
}

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export function createMetaEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `purchase_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getMetaCookies() {
  return {
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
  };
}

export function trackBrowserPurchase(input: {
  eventId: string;
  value: number;
  currency?: string;
  contentIds: string[];
  contentName?: string;
}) {
  if (typeof window === "undefined" || !window.fbq) {
    return;
  }

  window.fbq(
    "track",
    "Purchase",
    {
      value: input.value,
      currency: input.currency ?? "BDT",
      content_ids: input.contentIds,
      content_type: "product",
      content_name: input.contentName,
    },
    { eventID: input.eventId }
  );
}
