import type { Order } from "@/types/order";
import type {
  CourierSendResult,
  CourierShipment,
  CourierTrackResult,
} from "@/types/courier";
import { formatCourierStatus } from "@/lib/courier/statusLabels";

type FetchJsonResult = {
  ok: boolean;
  status: number;
  data: Record<string, unknown>;
  text: string;
};

export async function fetchJson(
  url: string,
  options: RequestInit = {}
): Promise<FetchJsonResult> {
  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
    });

    const text = await response.text();
    let data: Record<string, unknown> = {};

    try {
      data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
    } catch {
      data = { message: text };
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      text,
    };
  } catch (error) {
    const cause =
      error instanceof Error && error.cause instanceof Error
        ? error.cause.message
        : error instanceof Error
          ? error.message
          : "Network request failed";

    return {
      ok: false,
      status: 0,
      data: { message: cause },
      text: cause,
    };
  }
}

export function buildFullAddress(order: Order) {
  return `${order.address}, ${order.district}`.trim();
}

export function buildInvoice(orderId: string) {
  return `EZ-${orderId.slice(-8).toUpperCase()}`;
}

export function getCourierOrderId(
  shipment?: Pick<CourierShipment, "consignmentId" | "invoice" | "trackingId"> | null
) {
  if (!shipment) return null;
  return shipment.consignmentId || shipment.invoice || shipment.trackingId || null;
}

export function successTrackResult(
  status: string,
  message = "Tracking updated",
  extra?: Partial<CourierTrackResult>
): CourierTrackResult {
  return {
    success: true,
    message,
    status,
    statusLabel: formatCourierStatus(status),
    ...extra,
  };
}

export function failResult(message: string): CourierSendResult {
  return { success: false, message };
}

export function failTrackResult(message: string): CourierTrackResult {
  return {
    success: false,
    message,
    status: "unknown",
    statusLabel: "Unknown",
  };
}
