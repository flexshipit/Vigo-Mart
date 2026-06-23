import { getAdminToken } from "@/lib/auth/adminAuth";
import type { OrderDatePreset } from "@/lib/admin/orderDateRange";
import type { CourierPhoneHistoryResult, CourierShipment } from "@/types/courier";
import type { OrderStatus, UpdateOrderPayload } from "@/types/order";

async function adminFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export type AdminCourierProvider = {
  id: string;
  name: string;
  configured: boolean;
  balance?: number | null;
  balanceWarning?: string | null;
};

export type AdminOrder = {
  _id: string;
  packageId: string;
  packageName: string;
  packets: number;
  fullName: string;
  district: string;
  address: string;
  phone: string;
  ip?: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  courierId?: string;
  courierName?: string;
  courierShipment?: CourierShipment & {
    sentAt: string;
    lastTrackedAt?: string;
  };
  createdAt: string;
  confirmedAt?: string;
  statusUpdatedAt?: string;
};

export type AdminOrdersParams = {
  page?: number;
  limit?: number;
  q?: string;
  status?: "all" | OrderStatus;
  datePreset?: OrderDatePreset;
  from?: string;
  to?: string;
  enabled?: boolean;
};

export type AdminOrdersPagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export async function fetchAdminOrders(params: AdminOrdersParams = {}) {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 1));
  search.set("limit", String(params.limit ?? 10));
  if (params.q?.trim()) search.set("q", params.q.trim());
  if (params.status && params.status !== "all") {
    search.set("status", params.status);
  }
  if (params.datePreset) search.set("datePreset", params.datePreset);
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);

  const data = await adminFetch<{
    data: {
      orders: AdminOrder[];
      stats: { totalOrders: number; totalRevenue: number };
      pagination: AdminOrdersPagination;
    };
  }>(`/api/admin/orders?${search.toString()}`);

  return data.data;
}

export async function fetchAdminCouriers() {
  const data = await adminFetch<{ data: AdminCourierProvider[] }>(
    "/api/admin/couriers"
  );
  return data.data;
}

export async function updateAdminOrder(
  orderId: string,
  payload: UpdateOrderPayload
) {
  const data = await adminFetch<{ message: string; data: AdminOrder }>(
    `/api/admin/orders/${orderId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

  return data;
}

export async function sendOrderToCourier(orderId: string) {
  const data = await adminFetch<{
    message: string;
    data: AdminOrder["courierShipment"];
  }>(`/api/admin/orders/${orderId}/courier/send`, {
    method: "POST",
  });

  return data;
}

export async function trackCourierOrder(orderId: string) {
  const data = await adminFetch<{
    message: string;
    data: AdminOrder["courierShipment"];
  }>(`/api/admin/orders/${orderId}/courier/track`);

  return data;
}

export type LiveCourierStatus = {
  success: boolean;
  status?: string;
  statusLabel?: string;
  message?: string;
};

export type CourierHistoryOrder = AdminOrder & {
  liveCourierStatus?: LiveCourierStatus;
};

export type CourierHistoryResult = {
  phone: string;
  customerName: string | null;
  totalOrders: number;
  courierShipments: number;
  courierApis: {
    pathao: CourierPhoneHistoryResult;
    steadfast: CourierPhoneHistoryResult;
  };
  orders: CourierHistoryOrder[];
};

export async function fetchCourierHistory(phone: string) {
  const search = new URLSearchParams({ phone });
  const data = await adminFetch<{ data: CourierHistoryResult }>(
    `/api/admin/courier-history?${search.toString()}`
  );
  return data.data;
}

export async function loginAdmin(username: string, password: string) {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Login failed");
  }

  return data as { token: string; username: string };
}

export async function verifyAdminSession() {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch("/api/admin/login", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error("Session expired");
  }

  return true;
}
