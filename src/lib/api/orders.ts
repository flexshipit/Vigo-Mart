import type { CreateOrderPayload } from "@/types/order";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  orderId?: string;
  alreadySent?: boolean;
  skipped?: boolean;
};

export type OrderSummary = {
  orderId: string;
  fullName: string;
  items: Array<{
    packageId: string;
    packageName: string;
    quantity: number;
    lineTotal: number;
  }>;
  packageName: string;
  quantity: number;
  total: number;
  phone: string;
  status: string;
  smsSent: boolean;
  smsEnabled: boolean;
  createdAt: string;
};

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  return res.json() as Promise<ApiResponse<T>>;
}

export async function createOrder(
  payload: CreateOrderPayload
): Promise<{ orderId: string; message: string }> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseResponse(res);

  if (!res.ok || !data.success || !data.orderId) {
    throw new Error(data.message || "অর্ডার তৈরি হয়নি");
  }

  return {
    orderId: data.orderId,
    message: data.message || "অর্ডার সফলভাবে গ্রহণ করা হয়েছে",
  };
}

export async function fetchOrderSummary(orderId: string): Promise<OrderSummary> {
  const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
  const data = await parseResponse<OrderSummary>(res);

  if (!res.ok || !data.success || !data.data) {
    throw new Error(data.message || "অর্ডার পাওয়া যায়নি");
  }

  return data.data;
}

export async function sendOrderSms(
  orderId: string
): Promise<{ message: string; alreadySent: boolean; skipped: boolean }> {
  const res = await fetch(`/api/orders/${orderId}/sms`, {
    method: "POST",
  });

  const data = await parseResponse(res);

  if (!res.ok || !data.success) {
    throw new Error(data.message || "SMS পাঠানো যায়নি");
  }

  return {
    message: data.message || "আপনার ফোনে confirmation SMS পাঠানো হয়েছে।",
    alreadySent: Boolean(data.alreadySent),
    skipped: Boolean(data.skipped),
  };
}
