export type CourierId = "steadfast" | "pathao";

export type CourierProvider = {
  id: CourierId;
  name: string;
  description: string;
};

export type CourierSendResult = {
  success: boolean;
  message: string;
  trackingId?: string;
  consignmentId?: string;
  invoice?: string;
  trackingUrl?: string;
  courierStatus?: string;
  courierStatusLabel?: string;
  raw?: unknown;
};

export type CourierTrackResult = {
  success: boolean;
  message: string;
  status: string;
  statusLabel: string;
  trackingUrl?: string;
  raw?: unknown;
};

export type CourierPhoneHistoryResult = {
  success: boolean;
  message: string;
  total: number;
  delivered: number;
  cancelled: number;
  successRate: number;
  customerRating?: string;
  riskLevel?: string;
  raw?: unknown;
};

export type CourierShipment = {
  courierId: CourierId;
  trackingId: string;
  consignmentId?: string;
  invoice?: string;
  status: string;
  statusLabel: string;
  sentAt: Date;
  lastTrackedAt?: Date;
  trackingUrl?: string;
};

export const COURIER_PROVIDERS: CourierProvider[] = [
  {
    id: "steadfast",
    name: "Steadfast",
    description: "Steadfast Courier API integration",
  },
  {
    id: "pathao",
    name: "Pathao",
    description: "Pathao Courier merchant API",
  },
];
