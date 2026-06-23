import type { Order } from "@/types/order";

export function serializeOrder(order: Order) {
  return {
    ...order,
    _id: order._id?.toString(),
    createdAt: order.createdAt?.toISOString?.() ?? order.createdAt,
    confirmedAt: order.confirmedAt?.toISOString?.() ?? order.confirmedAt,
    statusUpdatedAt:
      order.statusUpdatedAt?.toISOString?.() ?? order.statusUpdatedAt,
    smsSentAt: order.smsSentAt?.toISOString?.() ?? order.smsSentAt,
    courierShipment: order.courierShipment
      ? {
          ...order.courierShipment,
          sentAt:
            order.courierShipment.sentAt?.toISOString?.() ??
            order.courierShipment.sentAt,
          lastTrackedAt: order.courierShipment.lastTrackedAt
            ? order.courierShipment.lastTrackedAt?.toISOString?.() ??
              order.courierShipment.lastTrackedAt
            : undefined,
        }
      : undefined,
  };
}
