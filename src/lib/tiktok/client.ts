"use client";

declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (
        event: string,
        params?: Record<string, unknown>,
        options?: { event_id?: string }
      ) => void;
      identify: (params: Record<string, unknown>) => void;
      instances: (pixelId: string) => {
        track: (
          event: string,
          params?: Record<string, unknown>,
          options?: { event_id?: string }
        ) => void;
      };
    };
  }
}

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export function createTikTokEventId(prefix = "tt") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getTikTokCookies() {
  const fromUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("ttclid") ?? undefined
      : undefined;

  return {
    ttp: readCookie("_ttp"),
    ttclid: fromUrl || readCookie("ttclid"),
  };
}

type ContentInput = {
  contentId: string;
  contentName: string;
  quantity: number;
  price: number;
};

function buildContentParams(contents: ContentInput[], value: number) {
  return {
    contents: contents.map((item) => ({
      content_id: item.contentId,
      content_type: "product",
      content_name: item.contentName,
      quantity: item.quantity,
      price: item.price,
    })),
    content_type: "product",
    currency: "BDT",
    value,
  };
}

function trackEvent(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string
) {
  if (typeof window === "undefined" || !window.ttq) {
    return;
  }

  if (eventId) {
    window.ttq.track(event, params, { event_id: eventId });
    return;
  }

  window.ttq.track(event, params);
}

export function trackTikTokAddToCart(input: {
  contents: ContentInput[];
  value: number;
}) {
  trackEvent("AddToCart", buildContentParams(input.contents, input.value));
}

export function trackTikTokInitiateCheckout(input: {
  eventId: string;
  contents: ContentInput[];
  value: number;
}) {
  trackEvent(
    "InitiateCheckout",
    buildContentParams(input.contents, input.value),
    input.eventId
  );
}

export function trackTikTokPurchase(input: {
  eventId: string;
  contents: ContentInput[];
  value: number;
}) {
  trackEvent(
    "Purchase",
    buildContentParams(input.contents, input.value),
    input.eventId
  );
}
