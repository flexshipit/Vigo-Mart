import { DELIVERY_CHARGE } from "@/lib/products";

type OrderPricingInput = {
  subtotal?: number;
  deliveryCharge?: number;
  total: number;
};

export function resolveOrderPricing(order: OrderPricingInput) {
  const hasDelivery =
    typeof order.deliveryCharge === "number" && order.deliveryCharge >= 0;
  const hasSubtotal = typeof order.subtotal === "number" && order.subtotal >= 0;

  if (hasSubtotal && hasDelivery) {
    return {
      subtotal: order.subtotal!,
      deliveryCharge: order.deliveryCharge!,
      total: order.total,
    };
  }

  if (hasSubtotal) {
    const deliveryCharge = Math.max(0, order.total - order.subtotal!);
    return {
      subtotal: order.subtotal!,
      deliveryCharge,
      total: order.total,
    };
  }

  if (hasDelivery) {
    const subtotal = Math.max(0, order.total - order.deliveryCharge!);
    return {
      subtotal,
      deliveryCharge: order.deliveryCharge!,
      total: order.total,
    };
  }

  const deliveryCharge = order.total > DELIVERY_CHARGE ? DELIVERY_CHARGE : 0;
  const subtotal = Math.max(0, order.total - deliveryCharge);

  return {
    subtotal,
    deliveryCharge,
    total: order.total,
  };
}
