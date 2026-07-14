import type { Order } from "@/types/order";
import type { CourierSendResult, CourierTrackResult } from "@/types/courier";
import {
  buildFullAddress,
  buildInvoice,
  failResult,
  failTrackResult,
  fetchJson,
  successTrackResult,
} from "@/lib/courier/utils";
import { formatCourierStatus } from "@/lib/courier/statusLabels";
import type { CourierAdapter } from "@/lib/couriers";

type TokenCache = {
  token: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

function isPlaceholder(value?: string) {
  if (!value) return true;
  return (
    value.includes("your_") ||
    value.includes("change_this") ||
    value === "your_pathao_merchant_email" ||
    value === "your_pathao_merchant_password" ||
    value === "your_store_id"
  );
}

function getConfig() {
  const sandbox = process.env.PATHAO_SANDBOX === "true";
  return {
    clientId: process.env.PATHAO_CLIENT_ID,
    clientSecret: process.env.PATHAO_CLIENT_SECRET,
    username: process.env.PATHAO_USERNAME,
    password: process.env.PATHAO_PASSWORD,
    storeId: process.env.PATHAO_STORE_ID,
    baseUrl: sandbox
      ? "https://courier-api-sandbox.pathao.com"
      : process.env.PATHAO_BASE_URL || "https://api-hermes.pathao.com",
  };
}

function cacheToken(token: string, expiresIn: number) {
  tokenCache = {
    token,
    expiresAt: Date.now() + expiresIn * 1000,
  };
  return token;
}

async function getAccessToken(): Promise<string | null> {
  const { clientId, clientSecret, username, password, baseUrl } = getConfig();

  if (!clientId || !clientSecret) {
    return null;
  }

  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.token;
  }

  const hasUserCredentials =
    !isPlaceholder(username) && !isPlaceholder(password);

  if (hasUserCredentials) {
    const result = await fetchJson(`${baseUrl}/aladdin/api/v1/issue-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password,
        grant_type: "password",
      }),
    });

    const token = String(result.data.access_token ?? "");
    const expiresIn = Number(result.data.expires_in ?? 3600);

    if (result.ok && token) {
      return cacheToken(token, expiresIn);
    }
  }

  const externalResult = await fetchJson(
    `${baseUrl}/aladdin/api/v1/external/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
      }),
    }
  );

  const token = String(externalResult.data.access_token ?? "");
  const expiresIn = Number(externalResult.data.expires_in ?? 7776000);

  if (!externalResult.ok || !token) {
    tokenCache = null;
    return null;
  }

  return cacheToken(token, expiresIn);
}

async function authHeaders() {
  const token = await getAccessToken();
  if (!token) return null;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function resolveStoreId(baseUrl: string, headers: Record<string, string>) {
  const { storeId } = getConfig();
  if (storeId && !isPlaceholder(storeId)) {
    return storeId;
  }

  const result = await fetchJson(`${baseUrl}/aladdin/api/v1/stores`, { headers });
  const stores = (result.data.data as { data?: Array<Record<string, unknown>> })?.data;

  if (!result.ok || !Array.isArray(stores) || stores.length === 0) {
    return null;
  }

  const firstStore = stores[0];
  return String(firstStore.store_id ?? firstStore.id ?? "");
}

export const pathaoAdapter: CourierAdapter = {
  id: "pathao",
  name: "Pathao",

  isConfigured() {
    const { clientId, clientSecret } = getConfig();
    return Boolean(clientId && clientSecret);
  },

  async sendOrder(order, orderId) {
    const { baseUrl } = getConfig();
    const headers = await authHeaders();

    if (!headers) {
      return failResult(
        "Pathao API credentials missing. Set PATHAO_CLIENT_ID and PATHAO_CLIENT_SECRET in .env"
      );
    }

    const storeId = await resolveStoreId(baseUrl, headers);

    if (!storeId) {
      return failResult(
        "PATHAO_STORE_ID is required or no store found in Pathao account"
      );
    }

    const merchantOrderId = buildInvoice(orderId);
    const payload = {
      store_id: Number(storeId),
      merchant_order_id: merchantOrderId,
      recipient_name: order.fullName,
      recipient_phone: order.phone,
      recipient_address: buildFullAddress(order),
      delivery_type: 48,
      item_type: 2,
      item_quantity: 1,
      item_weight: 0.5,
      item_description: order.packageName,
      amount_to_collect: order.total,
      ...(order.riderNote ? { special_instruction: order.riderNote } : {}),
    };

    const result = await fetchJson(`${baseUrl}/aladdin/api/v1/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = (result.data.data ?? result.data) as Record<string, unknown>;
    const consignmentId = String(data.consignment_id ?? data.consignmentId ?? "");
    const orderStatus = String(data.order_status ?? data.status ?? "Pickup_Request");
    const message = String(result.data.message ?? "Order sent to Pathao");

    if (!result.ok || !consignmentId) {
      return failResult(
        String(result.data.message ?? result.text ?? "Pathao order creation failed")
      );
    }

    return {
      success: true,
      message,
      trackingId: consignmentId,
      consignmentId,
      invoice: merchantOrderId,
      courierStatus: orderStatus,
      courierStatusLabel: formatCourierStatus(orderStatus),
      trackingUrl: `https://merchant.pathao.com/tracking?consignment_id=${consignmentId}`,
      raw: result.data,
    } satisfies CourierSendResult;
  },

  async trackShipment({ consignmentId, trackingId }) {
    const { baseUrl } = getConfig();
    const headers = await authHeaders();
    const id = consignmentId || trackingId;

    if (!headers) {
      return failTrackResult("Pathao API credentials missing");
    }

    if (!id) {
      return failTrackResult("Pathao consignment ID is required for tracking");
    }

    const result = await fetchJson(
      `${baseUrl}/aladdin/api/v1/orders/${encodeURIComponent(id)}/info`,
      { headers }
    );

    const data = (result.data.data ?? result.data) as Record<string, unknown>;
    const orderStatus = String(
      data.order_status ?? data.orderStatus ?? data.status ?? ""
    );

    if (!result.ok || !orderStatus) {
      return failTrackResult(
        String(result.data.message ?? result.text ?? "Unable to track Pathao shipment")
      );
    }

    return successTrackResult(orderStatus, "Pathao tracking updated", {
      trackingUrl: `https://merchant.pathao.com/tracking?consignment_id=${id}`,
      raw: result.data,
    });
  },

  async getPhoneHistory(phone) {
    const { baseUrl } = getConfig();
    const headers = await authHeaders();

    if (!headers) {
      return {
        success: false,
        message: "Pathao API credentials missing",
        total: 0,
        delivered: 0,
        cancelled: 0,
        successRate: 0,
      };
    }

    const result = await fetchJson(`${baseUrl}/aladdin/api/v1/user/success`, {
      method: "POST",
      headers,
      body: JSON.stringify({ phone }),
    });

    const data = (result.data.data ?? result.data) as Record<string, unknown>;
    const customer = (data.customer ?? {}) as Record<string, unknown>;
    const total = Number(customer.total_delivery ?? 0);
    const delivered = Number(customer.successful_delivery ?? 0);
    const cancelled = Math.max(0, total - delivered);
    const successRate =
      total > 0 ? Math.round((delivered / total) * 100) : 0;
    const customerRating = String(data.customer_rating ?? "");

    const riskLevel = customerRating.includes("excellent")
      ? "low"
      : customerRating.includes("good")
        ? "low"
        : customerRating.includes("moderate")
          ? "medium"
          : customerRating.includes("risky")
            ? "high"
            : customerRating.includes("new")
              ? "unknown"
              : undefined;

    if (!result.ok || Number(result.data.code ?? 0) !== 200) {
      return {
        success: false,
        message: String(result.data.message ?? result.text ?? "Pathao history unavailable"),
        total,
        delivered,
        cancelled,
        successRate,
        customerRating: customerRating || undefined,
        riskLevel,
        raw: result.data,
      };
    }

    return {
      success: true,
      message: "Pathao courier history loaded",
      total,
      delivered,
      cancelled,
      successRate,
      customerRating: customerRating || undefined,
      riskLevel,
      raw: result.data,
    };
  },
};
