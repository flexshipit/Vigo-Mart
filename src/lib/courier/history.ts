import { getCourierAdapter, isValidCourierId } from "@/lib/couriers";
import type { CourierPhoneHistoryResult } from "@/types/courier";
import type { Order } from "@/types/order";

export type CourierApiHistories = {
  pathao: CourierPhoneHistoryResult;
  steadfast: CourierPhoneHistoryResult;
};

export type LiveCourierStatus = {
  success: boolean;
  status?: string;
  statusLabel?: string;
  message?: string;
};

export async function fetchCourierApiHistories(
  phone: string
): Promise<CourierApiHistories> {
  const [pathao, steadfast] = await Promise.all([
    getCourierAdapter("pathao").getPhoneHistory(phone),
    getCourierAdapter("steadfast").getPhoneHistory(phone),
  ]);

  return { pathao, steadfast };
}

export async function fetchLiveCourierStatuses(
  orders: Order[]
): Promise<Record<string, LiveCourierStatus>> {
  const statuses: Record<string, LiveCourierStatus> = {};

  await Promise.all(
    orders
      .filter((order) => order.courierShipment?.trackingId && order.courierId)
      .map(async (order) => {
        const orderId = order._id?.toString();
        if (!orderId || !order.courierId || !isValidCourierId(order.courierId)) {
          return;
        }

        const shipment = order.courierShipment!;

        try {
          const adapter = getCourierAdapter(order.courierId);
          const result = await adapter.trackShipment({
            trackingId: shipment.trackingId,
            consignmentId: shipment.consignmentId,
            invoice: shipment.invoice,
          });

          statuses[orderId] = {
            success: result.success,
            status: result.status,
            statusLabel: result.statusLabel,
            message: result.message,
          };
        } catch (error) {
          statuses[orderId] = {
            success: false,
            message:
              error instanceof Error
                ? error.message
                : "Failed to refresh courier status",
          };
        }
      })
  );

  return statuses;
}
