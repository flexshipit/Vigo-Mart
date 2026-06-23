import type { Order } from "@/types/order";
import type {
  CourierId,
  CourierPhoneHistoryResult,
  CourierSendResult,
  CourierTrackResult,
} from "@/types/courier";
import { pathaoAdapter } from "@/lib/courier/adapters/pathao";
import { steadfastAdapter } from "@/lib/courier/adapters/steadfast";

export type CourierAdapter = {
  id: CourierId;
  name: string;
  isConfigured: () => boolean;
  sendOrder: (order: Order, orderId: string) => Promise<CourierSendResult>;
  trackShipment: (input: {
    trackingId: string;
    consignmentId?: string;
    invoice?: string;
  }) => Promise<CourierTrackResult>;
  getPhoneHistory: (phone: string) => Promise<CourierPhoneHistoryResult>;
};

const adapters: Record<CourierId, CourierAdapter> = {
  steadfast: steadfastAdapter,
  pathao: pathaoAdapter,
};

export function getCourierAdapter(id: CourierId): CourierAdapter {
  return adapters[id];
}

export function listCourierProviders() {
  return Object.values(adapters).map((adapter) => ({
    id: adapter.id,
    name: adapter.name,
    configured: adapter.isConfigured(),
  }));
}

export function isValidCourierId(id: string): id is CourierId {
  return id in adapters;
}

export function getCourierById(id: string) {
  if (!isValidCourierId(id)) return undefined;
  return adapters[id];
}

// Backward-compatible export for existing imports
export const STATIC_COURIERS = listCourierProviders().map((item) => ({
  id: item.id,
  name: item.name,
  configured: item.configured,
}));
