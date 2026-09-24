import type { Document } from "mongodb";

export type SmsSendResult = {
  success: boolean;
  skipped?: boolean;
  alreadySent?: boolean;
  providerStatus?: number;
  providerMessageId?: number | string;
  phone?: string;
  error?: string;
  message?: string;
};

export type OrderSmsNotificationType =
  | "order_received"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type SmsLogEntry = {
  orderId: string;
  notificationType: OrderSmsNotificationType;
  phone: string;
  message: string;
  providerMessageId?: number | string;
  providerStatus?: number;
  success: boolean;
  error?: string;
  createdAt: Date;
} & Document;
