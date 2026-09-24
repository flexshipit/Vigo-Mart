import type { OrderSmsNotificationType } from "@/types/sms";
import type { OrderStatus } from "@/types/order";

export function formatShortOrderId(orderId: string): string {
  return orderId.slice(-6).toUpperCase();
}

export function getOrderSmsMessage(
  type: OrderSmsNotificationType,
  orderId: string
): string {
  const id = formatShortOrderId(orderId);

  switch (type) {
    case "order_received":
      return `Thank you for your order #${id}. We have received your order and it is waiting for confirmation.`;
    case "confirmed":
      return `Your order #${id} has been confirmed and will be processed shortly. Thank you for shopping with us.`;
    case "processing":
      return `Your order #${id} is now being processed. We will notify you when it is ready for delivery.`;
    case "shipped":
      return `Your order #${id} has been shipped and is on its way to you.`;
    case "out_for_delivery":
      return `Your order #${id} is out for delivery. Please keep your phone available for the delivery.`;
    case "delivered":
      return `Your order #${id} has been delivered successfully. Thank you for shopping with us!`;
    case "cancelled":
      return `Your order #${id} has been cancelled. Please contact us if you have any questions.`;
    default:
      return `Update on your order #${id}.`;
  }
}

export function notificationTypeForStatus(
  status: OrderStatus
): OrderSmsNotificationType {
  return status;
}
