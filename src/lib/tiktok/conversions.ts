import {
  hashTikTokExternalId,
  hashTikTokPhone,
} from "@/lib/tiktok/hashUserData";

type ContentLine = {
  contentId: string;
  contentName: string;
  quantity: number;
  price: number;
};

type TrackPurchaseInput = {
  eventId: string;
  orderId: string;
  phone: string;
  contents: ContentLine[];
  total: number;
  ip?: string;
  userAgent?: string;
  ttp?: string;
  ttclid?: string;
  eventSourceUrl?: string;
};

function getTikTokConfig() {
  return {
    pixelId:
      process.env.TIKTOK_PIXEL_ID || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    accessToken: process.env.TIKTOK_ACCESS_TOKEN,
  };
}

export async function trackTikTokPurchase(input: TrackPurchaseInput) {
  const { pixelId, accessToken } = getTikTokConfig();

  if (!pixelId || !accessToken) {
    return {
      success: false as const,
      message: "TikTok Events API is not configured",
    };
  }

  const user: Record<string, string> = {};
  const hashedPhone = hashTikTokPhone(input.phone);
  const hashedExternalId = hashTikTokExternalId(input.orderId);

  if (hashedPhone) user.phone = hashedPhone;
  if (hashedExternalId) user.external_id = hashedExternalId;
  if (input.ip && input.ip !== "unknown") user.ip = input.ip;
  if (input.userAgent) user.user_agent = input.userAgent;
  if (input.ttp) user.ttp = input.ttp;
  if (input.ttclid) user.ttclid = input.ttclid;

  const payload = {
    event_source: "web",
    event_source_id: pixelId,
    data: [
      {
        event: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        user,
        page: {
          url: input.eventSourceUrl,
        },
        properties: {
          currency: "BDT",
          value: input.total,
          contents: input.contents.map((item) => ({
            content_id: item.contentId,
            content_type: "product",
            content_name: item.contentName,
            quantity: item.quantity,
            price: item.price,
          })),
          content_type: "product",
          order_id: input.orderId,
        },
      },
    ],
  };

  try {
    const response = await fetch(
      "https://business-api.tiktok.com/open_api/v1.3/event/track/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Token": accessToken,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const result = (await response.json()) as {
      code?: number;
      message?: string;
      request_id?: string;
    };

    if (!response.ok || (typeof result.code === "number" && result.code !== 0)) {
      return {
        success: false as const,
        message: result.message || "TikTok Events API request failed",
      };
    }

    return {
      success: true as const,
      message: "TikTok Purchase event sent",
      requestId: result.request_id,
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "TikTok Events API request failed",
    };
  }
}
