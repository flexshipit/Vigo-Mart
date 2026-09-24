import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import {
  isAutomasSmsConfigured,
  sendAutomasSms,
} from "@/lib/sms/automas";
import {
  getOrderSmsMessage,
  notificationTypeForStatus,
} from "@/lib/sms/templates";
import type { Order, OrderStatus } from "@/types/order";
import type {
  OrderSmsNotificationType,
  SmsLogEntry,
  SmsSendResult,
} from "@/types/sms";

async function writeSmsLog(entry: SmsLogEntry) {
  try {
    const logs = await dbConnect<SmsLogEntry>("sms_logs");
    await logs.insertOne(entry);
  } catch (error) {
    console.error("[SMS log] failed to write:", error);
  }
}

/**
 * Atomically claim a notification slot, send SMS, and record result.
 * On failure the claim is released so a retry can happen later.
 */
export async function sendOrderNotificationSms(input: {
  orderId: string;
  phone: string;
  notificationType: OrderSmsNotificationType;
}): Promise<SmsSendResult> {
  if (!isAutomasSmsConfigured()) {
    return { success: true, skipped: true, message: "SMS not configured" };
  }

  if (!ObjectId.isValid(input.orderId)) {
    return { success: false, error: "Invalid order id" };
  }

  const objectId = new ObjectId(input.orderId);
  const orders = await dbConnect<Order>("orders");
  const message = getOrderSmsMessage(input.notificationType, input.orderId);

  const claimed = await orders.findOneAndUpdate(
    {
      _id: objectId,
      smsNotifications: { $nin: [input.notificationType] },
    },
    {
      $addToSet: { smsNotifications: input.notificationType },
    },
    { returnDocument: "after" }
  );

  if (!claimed) {
    const existing = await orders.findOne({ _id: objectId });
    if (!existing) {
      return { success: false, error: "Order not found" };
    }

    return {
      success: true,
      alreadySent: true,
      message: "SMS already sent for this notification",
      phone: existing.phone,
    };
  }

  const phone = input.phone || claimed.phone;
  const result = await sendAutomasSms(phone, message);

  if (result.skipped) {
    await orders.updateOne(
      { _id: objectId },
      { $pull: { smsNotifications: input.notificationType } }
    );
    return result;
  }

  if (!result.success) {
    await orders.updateOne(
      { _id: objectId },
      { $pull: { smsNotifications: input.notificationType } }
    );

    await writeSmsLog({
      orderId: input.orderId,
      notificationType: input.notificationType,
      phone,
      message,
      providerMessageId: result.providerMessageId,
      providerStatus: result.providerStatus,
      success: false,
      error: result.error || result.message,
      createdAt: new Date(),
    });

    return result;
  }

  const setFields: Partial<Order> = {};
  if (input.notificationType === "order_received") {
    setFields.smsSent = true;
    setFields.smsSentAt = new Date();
  }

  if (Object.keys(setFields).length > 0) {
    await orders.updateOne({ _id: objectId }, { $set: setFields });
  }

  await writeSmsLog({
    orderId: input.orderId,
    notificationType: input.notificationType,
    phone: result.phone || phone,
    message,
    providerMessageId: result.providerMessageId,
    providerStatus: result.providerStatus ?? 0,
    success: true,
    createdAt: new Date(),
  });

  return {
    ...result,
    alreadySent: false,
  };
}

/** Fire-and-forget helper that never throws to callers. */
export function queueOrderNotificationSms(input: {
  orderId: string;
  phone: string;
  notificationType: OrderSmsNotificationType;
}): void {
  void sendOrderNotificationSms(input).then((result) => {
    if (!result.success && !result.skipped && !result.alreadySent) {
      console.warn(
        `[SMS] ${input.notificationType} failed for order ${input.orderId}:`,
        result.error || result.message
      );
    }
  });
}

export function queueOrderReceivedSms(orderId: string, phone: string): void {
  queueOrderNotificationSms({
    orderId,
    phone,
    notificationType: "order_received",
  });
}

export function queueOrderStatusSms(input: {
  orderId: string;
  phone: string;
  previousStatus: OrderStatus;
  nextStatus: OrderStatus;
}): void {
  if (input.previousStatus === input.nextStatus) return;

  queueOrderNotificationSms({
    orderId: input.orderId,
    phone: input.phone,
    notificationType: notificationTypeForStatus(input.nextStatus),
  });
}

export { isAutomasSmsConfigured as isOrderSmsConfigured };
