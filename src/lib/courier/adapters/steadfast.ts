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

function getConfig() {
  return {
    apiKey: process.env.STEADFAST_API_KEY,
    secretKey: process.env.STEADFAST_SECRET_KEY,
    baseUrl:
      process.env.STEADFAST_BASE_URL ||
      "https://portal.packzy.com/api/v1",
  };
}

function headers(apiKey: string, secretKey: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Api-Key": apiKey,
    "Secret-Key": secretKey,
  };
}

async function getAccountBalance(baseUrl: string, apiKey: string, secretKey: string) {
  const result = await fetchJson(`${baseUrl}/get_balance`, {
    headers: headers(apiKey, secretKey),
  });

  if (!result.ok) {
    return null;
  }

  return Number(result.data.current_balance ?? 0);
}

export const steadfastAdapter: CourierAdapter = {
  id: "steadfast",
  name: "Steadfast",

  isConfigured() {
    const { apiKey, secretKey } = getConfig();
    return Boolean(apiKey && secretKey);
  },

  async sendOrder(order, orderId) {
    const { apiKey, secretKey, baseUrl } = getConfig();

    if (!apiKey || !secretKey) {
      return failResult(
        "Steadfast API credentials missing. Set STEADFAST_API_KEY and STEADFAST_SECRET_KEY in .env"
      );
    }

    const balance = await getAccountBalance(baseUrl, apiKey, secretKey);
    if (balance !== null && balance < 0) {
      return failResult(
        `Steadfast account balance is negative (${balance} BDT). Pay the due amount at portal.packzy.com, then send the order again.`
      );
    }

    const invoice = buildInvoice(orderId);
    const payload = {
      invoice,
      recipient_name: order.fullName,
      recipient_phone: order.phone,
      recipient_address: buildFullAddress(order),
      cod_amount: order.total,
      delivery_type: 0,
      total_lot: 1,
      note: `${order.packageName} — VigoMax`,
      item_description: order.packageName,
    };

    const result = await fetchJson(`${baseUrl}/create_order`, {
      method: "POST",
      headers: headers(apiKey, secretKey),
      body: JSON.stringify(payload),
    });

    const consignment = (result.data.consignment ?? {}) as Record<string, unknown>;
    const trackingCode = String(consignment.tracking_code ?? "");
    const consignmentId = String(consignment.consignment_id ?? "");
    const consignmentStatus = String(consignment.status ?? "in_review");
    const trackingLink = String(consignment.tracking_link ?? "");
    const apiStatus = Number(result.data.status ?? result.status);

    if (!result.ok || apiStatus !== 200 || !trackingCode) {
      return failResult(
        String(result.data.message ?? result.text ?? "Steadfast order creation failed")
      );
    }

    return {
      success: true,
      message:
        consignmentStatus === "in_review"
          ? "Order submitted to Steadfast. It is in review now — approve it from portal.packzy.com to start delivery."
          : String(result.data.message ?? "Order sent to Steadfast successfully"),
      trackingId: trackingCode,
      consignmentId,
      invoice,
      courierStatus: consignmentStatus,
      courierStatusLabel: formatCourierStatus(consignmentStatus),
      trackingUrl:
        trackingLink ||
        `https://steadfast.com.bd/tracking?tracking_code=${encodeURIComponent(trackingCode)}`,
      raw: result.data,
    } satisfies CourierSendResult;
  },

  async trackShipment({ trackingId, consignmentId, invoice }) {
    const { apiKey, secretKey, baseUrl } = getConfig();

    if (!apiKey || !secretKey) {
      return failTrackResult("Steadfast API credentials missing");
    }

    let endpoint = `${baseUrl}/status_by_trackingcode/${encodeURIComponent(trackingId)}`;

    if (consignmentId) {
      endpoint = `${baseUrl}/status_by_cid/${encodeURIComponent(consignmentId)}`;
    } else if (invoice) {
      endpoint = `${baseUrl}/status_by_invoice/${encodeURIComponent(invoice)}`;
    }

    const result = await fetchJson(endpoint, {
      headers: headers(apiKey, secretKey),
    });

    const deliveryStatus = String(
      result.data.delivery_status ?? result.data.status ?? ""
    );

    if (!result.ok || !deliveryStatus) {
      return failTrackResult(
        String(result.data.message ?? result.text ?? "Unable to track Steadfast shipment")
      );
    }

    return successTrackResult(deliveryStatus, "Steadfast tracking updated", {
      raw: result.data,
    });
  },

  async getPhoneHistory(phone) {
    const { apiKey, secretKey, baseUrl } = getConfig();

    if (!apiKey || !secretKey) {
      return {
        success: false,
        message: "Steadfast API credentials missing",
        total: 0,
        delivered: 0,
        cancelled: 0,
        successRate: 0,
      };
    }

    const result = await fetchJson(
      `${baseUrl}/fraud_check/${encodeURIComponent(phone)}`,
      { headers: headers(apiKey, secretKey) }
    );

    const total = Number(result.data.total_parcels ?? 0);
    const delivered = Number(result.data.total_delivered ?? 0);
    const cancelled = Number(result.data.total_cancelled ?? 0);
    const successRate =
      total > 0 ? Math.round((delivered / total) * 100) : 0;

    if (!result.ok) {
      return {
        success: false,
        message: String(result.data.message ?? result.text ?? "Steadfast history unavailable"),
        total,
        delivered,
        cancelled,
        successRate,
        raw: result.data,
      };
    }

    return {
      success: true,
      message: "Steadfast courier history loaded",
      total,
      delivered,
      cancelled,
      successRate,
      raw: result.data,
    };
  },
};

export async function getSteadfastAccountInfo() {
  const { apiKey, secretKey, baseUrl } = getConfig();

  if (!apiKey || !secretKey) {
    return {
      balance: null as number | null,
      warning: "Steadfast API credentials missing",
    };
  }

  const balance = await getAccountBalance(baseUrl, apiKey, secretKey);

  if (balance === null) {
    return {
      balance: null,
      warning: "Unable to fetch Steadfast balance",
    };
  }

  if (balance < 0) {
    return {
      balance,
      warning: `Steadfast balance is negative (${balance} BDT). Pay due amount at portal.packzy.com before sending new orders.`,
    };
  }

  return { balance, warning: null };
}
