import type { Collection } from "mongodb";
import type { Order } from "@/types/order";

export const ORDER_COOLDOWN_HOURS = 168;
export const ORDER_COOLDOWN_MS = ORDER_COOLDOWN_HOURS * 60 * 60 * 1000;

export const ORDER_COOLDOWN_MESSAGE =
  "আপনি 7 দিন (168 ঘণ্টা)-এর মধ্যে আবার অর্ডার করতে পারবেন না।";

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "unknown";
}

export async function findRecentOrderByPhoneOrIp(
  orders: Collection<Order>,
  phone: string,
  ip: string,
  since: Date
) {
  const matchConditions: Array<{ phone: string } | { ip: string }> = [{ phone }];

  if (ip !== "unknown") {
    matchConditions.push({ ip });
  }

  return orders.findOne({
    $or: matchConditions,
    createdAt: { $gte: since },
  });
}
