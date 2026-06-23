import type { CourierId } from "@/types/courier";

export const COURIER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending Pickup",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  unknown: "Unknown",
  // Steadfast
  pending_delivery: "Pending Delivery",
  in_review: "In Review (Approve in Steadfast Panel)",
  delivered_approval_pending: "Delivered (Pending Approval)",
  partial_delivered: "Partially Delivered",
  cancelled_by_merchant: "Cancelled by Merchant",
  // Pathao
  Pickup_Request: "Pickup Requested",
  Pickup: "Picked Up",
  In_Transit: "In Transit",
  Delivered: "Delivered",
  Returned: "Returned",
};

export function formatCourierStatus(status: string): string {
  if (COURIER_STATUS_LABELS[status]) {
    return COURIER_STATUS_LABELS[status];
  }

  return status
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function mapCourierStatusToOrderStatus(
  courierStatus: string
): "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled" | null {
  const normalized = courierStatus.toLowerCase();

  if (
    normalized.includes("deliver") &&
    !normalized.includes("pending") &&
    !normalized.includes("out")
  ) {
    return "delivered";
  }

  if (normalized.includes("out_for") || normalized.includes("dropoff")) {
    return "out_for_delivery";
  }

  if (
    normalized.includes("transit") ||
    normalized.includes("pickup") ||
    normalized.includes("picked") ||
    normalized.includes("dispatch")
  ) {
    return "shipped";
  }

  if (normalized.includes("cancel") || normalized.includes("return")) {
    return "cancelled";
  }

  if (
    normalized.includes("review") ||
    normalized.includes("pending") ||
    normalized.includes("processing")
  ) {
    return "processing";
  }

  return null;
}

export function isCourierId(value: string): value is CourierId {
  return value === "steadfast" || value === "pathao";
}
