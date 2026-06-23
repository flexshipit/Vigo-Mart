import type { Filter } from "mongodb";
import { isOrderStatus } from "@/lib/orderStatus";
import type { Order } from "@/types/order";

export function buildOrderSearchFilter(query: string): Filter<Order> {
  if (!query) return {};

  const regex = { $regex: query, $options: "i" };

  return {
    $or: [
      { fullName: regex },
      { phone: regex },
      { packageName: regex },
      { district: regex },
      { address: regex },
      { courierName: regex },
      { "courierShipment.trackingId": regex },
      { "courierShipment.consignmentId": regex },
      { "courierShipment.invoice": regex },
    ],
  };
}

export function buildAdminOrdersFilter(input: {
  q?: string;
  status?: string;
  from?: Date;
  to?: Date;
}): Filter<Order> {
  const parts: Filter<Order>[] = [];

  const searchFilter = buildOrderSearchFilter(input.q?.trim() ?? "");
  if (Object.keys(searchFilter).length > 0) {
    parts.push(searchFilter);
  }

  if (input.status && input.status !== "all" && isOrderStatus(input.status)) {
    parts.push({ status: input.status });
  }

  if (input.from || input.to) {
    const createdAt: { $gte?: Date; $lte?: Date } = {};
    if (input.from) createdAt.$gte = input.from;
    if (input.to) createdAt.$lte = input.to;
    parts.push({ createdAt });
  }

  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0];
  return { $and: parts };
}
