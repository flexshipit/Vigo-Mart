import type { ObjectId } from "mongodb";
import type { CourierShipment } from "@/types/courier";

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Order = {
  _id?: ObjectId;
  packageId: string;
  packageName: string;
  packets: number;
  fullName: string;
  district: string;
  address: string;
  phone: string;
  ip: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: OrderStatus;
  courierId?: string;
  courierName?: string;
  courierShipment?: CourierShipment;
  createdAt: Date;
  confirmedAt?: Date;
  statusUpdatedAt?: Date;
  smsSent?: boolean;
  smsSentAt?: Date;
  metaEventId?: string;
  riderNote?: string;
};

export type UpdateOrderPayload = {
  status?: OrderStatus;
  courierId?: string | null;
  riderNote?: string | null;
};

export type CreateOrderPayload = {
  packageId: string;
  quantity: number;
  fullName: string;
  district: string;
  address: string;
  phone: string;
  eventId?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
};
