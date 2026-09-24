import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { getCourierAdapter, isValidCourierId } from "@/lib/couriers";
import { mapCourierStatusToOrderStatus } from "@/lib/courier/statusLabels";
import { queueOrderStatusSms } from "@/lib/sms/orderNotifications";
import type { CourierShipment } from "@/types/courier";
import type { Order } from "@/types/order";

export async function sendOrderToCourier(orderId: string) {
  if (!ObjectId.isValid(orderId)) {
    return { success: false as const, message: "Invalid order id" };
  }

  const orders = await dbConnect<Order>("orders");
  const objectId = new ObjectId(orderId);
  const order = await orders.findOne({ _id: objectId });

  if (!order) {
    return { success: false as const, message: "Order not found" };
  }

  if (!order.courierId || !isValidCourierId(order.courierId)) {
    return {
      success: false as const,
      message: "Please assign Steadfast or Pathao before sending",
    };
  }

  if (order.courierShipment?.trackingId) {
    return {
      success: false as const,
      message: "Order already sent to courier",
    };
  }

  const adapter = getCourierAdapter(order.courierId);

  if (!adapter.isConfigured()) {
    return {
      success: false as const,
      message: `${adapter.name} API is not configured. Add credentials to .env`,
    };
  }

  const result = await adapter.sendOrder(order, orderId);

  if (!result.success || !result.trackingId) {
    return {
      success: false as const,
      message: result.message,
    };
  }

  const shipment: CourierShipment = {
    courierId: order.courierId,
    trackingId: result.trackingId,
    consignmentId: result.consignmentId,
    invoice: result.invoice,
    status: result.courierStatus ?? "pending",
    statusLabel: result.courierStatusLabel ?? "Pending",
    sentAt: new Date(),
    lastTrackedAt: new Date(),
    trackingUrl: result.trackingUrl,
  };

  const previousStatus = order.status;
  const mappedStatus = mapCourierStatusToOrderStatus(shipment.status);
  const nextStatus = mappedStatus ?? "shipped";

  await orders.updateOne(
    { _id: objectId },
    {
      $set: {
        courierShipment: shipment,
        courierName: adapter.name,
        status: nextStatus,
        statusUpdatedAt: new Date(),
      },
    }
  );

  queueOrderStatusSms({
    orderId,
    phone: order.phone,
    previousStatus,
    nextStatus,
  });

  return {
    success: true as const,
    message: result.message,
    data: shipment,
  };
}

export async function trackCourierShipment(orderId: string) {
  if (!ObjectId.isValid(orderId)) {
    return { success: false as const, message: "Invalid order id" };
  }

  const orders = await dbConnect<Order>("orders");
  const objectId = new ObjectId(orderId);
  const order = await orders.findOne({ _id: objectId });

  if (!order) {
    return { success: false as const, message: "Order not found" };
  }

  if (!order.courierShipment || !order.courierId) {
    return {
      success: false as const,
      message: "Order has not been sent to courier yet",
    };
  }

  if (!isValidCourierId(order.courierId)) {
    return { success: false as const, message: "Invalid courier on order" };
  }

  const adapter = getCourierAdapter(order.courierId);

  if (!adapter.isConfigured()) {
    return {
      success: false as const,
      message: `${adapter.name} API is not configured`,
    };
  }

  const trackResult = await adapter.trackShipment({
    trackingId: order.courierShipment.trackingId,
    consignmentId: order.courierShipment.consignmentId,
    invoice: order.courierShipment.invoice,
  });

  if (!trackResult.success) {
    return {
      success: false as const,
      message: trackResult.message,
    };
  }

  const updatedShipment: CourierShipment = {
    ...order.courierShipment,
    status: trackResult.status,
    statusLabel: trackResult.statusLabel,
    lastTrackedAt: new Date(),
    trackingUrl: trackResult.trackingUrl ?? order.courierShipment.trackingUrl,
  };

  const previousStatus = order.status;
  const mappedStatus = mapCourierStatusToOrderStatus(trackResult.status);
  const updateFields: Partial<Order> = {
    courierShipment: updatedShipment,
    statusUpdatedAt: new Date(),
  };

  if (mappedStatus) {
    updateFields.status = mappedStatus;
  }

  await orders.updateOne({ _id: objectId }, { $set: updateFields });

  if (mappedStatus) {
    queueOrderStatusSms({
      orderId,
      phone: order.phone,
      previousStatus,
      nextStatus: mappedStatus,
    });
  }

  return {
    success: true as const,
    message: trackResult.message,
    data: updatedShipment,
  };
}
