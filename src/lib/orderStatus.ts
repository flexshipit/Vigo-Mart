import type { OrderStatus } from "@/types/order";

export const ORDER_STATUSES: OrderStatus[] = [
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_STYLES: Record<
  OrderStatus,
  { bg: string; text: string; ring: string }
> = {
  confirmed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-600/10",
  },
  processing: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-600/10",
  },
  shipped: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-600/10",
  },
  out_for_delivery: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-600/10",
  },
  delivered: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    ring: "ring-teal-600/10",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-600/10",
  },
};

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}
