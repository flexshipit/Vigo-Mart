import {
  hashMetaExternalId,
  hashMetaName,
  hashMetaPhone,
} from "@/lib/meta/hashUserData";

type TrackPurchaseInput = {
  eventId: string;
  orderId: string;
  fullName: string;
  phone: string;
  contentIds: string[];
  contentName: string;
  total: number;
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
};

function getMetaConfig() {
  return {
    pixelId: process.env.META_PIXEL_ID,
    accessToken: process.env.META_CAPI_ACCESS_TOKEN,
    testEventCode: process.env.META_CAPI_TEST_EVENT_CODE,
    apiVersion: process.env.META_CAPI_API_VERSION || "v21.0",
  };
}

export async function trackMetaPurchase(input: TrackPurchaseInput) {
  const { pixelId, accessToken, testEventCode, apiVersion } = getMetaConfig();

  if (!pixelId || !accessToken) {
    return { success: false as const, message: "Meta CAPI is not configured" };
  }

  const userData: Record<string, string | string[]> = {};

  const hashedPhone = hashMetaPhone(input.phone);
  const hashedName = hashMetaName(input.fullName);
  const hashedExternalId = hashMetaExternalId(input.orderId);

  if (hashedPhone) userData.ph = [hashedPhone];
  if (hashedName) userData.fn = [hashedName];
  if (hashedExternalId) userData.external_id = [hashedExternalId];
  if (input.ip && input.ip !== "unknown") userData.client_ip_address = input.ip;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: input.eventSourceUrl,
        user_data: userData,
        custom_data: {
          currency: "BDT",
          value: input.total,
          content_type: "product",
          content_ids: input.contentIds,
          content_name: input.contentName,
          order_id: input.orderId,
        },
      },
    ],
    access_token: accessToken,
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const result = (await response.json()) as {
      events_received?: number;
      error?: { message?: string };
    };

    if (!response.ok) {
      return {
        success: false as const,
        message: result.error?.message || "Meta CAPI request failed",
      };
    }

    return {
      success: true as const,
      message: "Meta Purchase event sent",
      eventsReceived: result.events_received ?? 0,
    };
  } catch (error) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Meta CAPI request failed",
    };
  }
}
