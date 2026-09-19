import type { AdminOrder } from "@/lib/api/admin";
import { getOrderItemsLabel } from "@/lib/orderItems";

export function formatAdminPackageLabel(order: AdminOrder): string {
  return getOrderItemsLabel(order);
}
