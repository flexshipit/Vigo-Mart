import type { Order, OrderItem } from "@/types/order";

export function formatOrderItemLabel(item: {
  packageName: string;
  quantity: number;
}): string {
  return item.quantity > 1
    ? `${item.packageName} × ${item.quantity}`
    : item.packageName;
}

export function formatOrderItemsLabel(
  items: Array<{ packageName: string; quantity: number }>
): string {
  return items.map(formatOrderItemLabel).join(", ");
}

export function sumOrderQuantities(
  items: Array<{ quantity: number }>
): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** Prefer stored items[]; fall back to legacy single-SKU fields. */
export function getOrderItems(order: Pick<
  Order,
  "items" | "packageId" | "packageName" | "packets" | "subtotal"
>): OrderItem[] {
  if (order.items && order.items.length > 0) {
    return order.items;
  }

  return [
    {
      packageId: order.packageId,
      packageName: order.packageName,
      unitPrice:
        order.packets > 0
          ? Math.round(order.subtotal / order.packets)
          : order.subtotal,
      quantity: order.packets || 1,
      lineTotal: order.subtotal,
    },
  ];
}

export function getOrderItemsLabel(
  order: Pick<Order, "items" | "packageId" | "packageName" | "packets" | "subtotal">
): string {
  return formatOrderItemsLabel(getOrderItems(order));
}
