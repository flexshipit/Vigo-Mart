import type { ObjectId } from "mongodb";
import type { CourierShipment } from "@/types/courier";

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type OrderItemInput = {
  packageId: string;
  quantity: number;
};

export type OrderItem = {
  packageId: string;
  packageName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type Order = {
  _id?: ObjectId;
  /** Multi-item line items. Absent on legacy single-SKU orders. */
  items?: OrderItem[];
  /** Denormalized: first item packageId (legacy + filters). */
  packageId: string;
  /** Denormalized joined label for search/display/SMS. */
  packageName: string;
  /** Denormalized total units across all items. */
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
  items: OrderItemInput[];
  fullName: string;
  district: string;
  address: string;
  phone: string;
  eventId?: string;
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
};
