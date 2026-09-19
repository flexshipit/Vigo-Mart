import type { Collection } from "mongodb";
import type { Order } from "@/types/order";

export const ORDER_COOLDOWN_HOURS = 24;
export const ORDER_COOLDOWN_MS = ORDER_COOLDOWN_HOURS * 60 * 60 * 1000;

export const ORDER_COOLDOWN_MESSAGE =
  "আপনি অর্ডার করতে পারবেন না।";

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

export async function getCountryByIp(ip: string): Promise<string> {
  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") {
    return "BD";
  }

  // 1. Try ip-api.com (Free, no key, limit 45 req/min)
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
      signal: controller.signal
    });
    clearTimeout(id);
    if (res.ok) {
      const data = (await res.json()) as { status: string; countryCode: string };
      if (data.status === "success" && data.countryCode) {
        return data.countryCode.toUpperCase();
      }
    }
  } catch (err) {
    console.error("ip-api.com error:", err);
  }

  // 2. Try ipapi.co (Free, no key, limit 1000/day)
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`https://ipapi.co/${ip}/country/`, {
      signal: controller.signal
    });
    clearTimeout(id);
    if (res.ok) {
      const country = await res.text();
      if (country && country.trim().length === 2) {
        return country.trim().toUpperCase();
      }
    }
  } catch (err) {
    console.error("ipapi.co error:", err);
  }

  // 3. Try ipwho.is (Free, no key, limit 250 req/min)
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: controller.signal
    });
    clearTimeout(id);
    if (res.ok) {
      const data = (await res.json()) as { success: boolean; country_code: string };
      if (data.success && data.country_code) {
        return data.country_code.toUpperCase();
      }
    }
  } catch (err) {
    console.error("ipwho.is error:", err);
  }

  return "BD"; // Fallback to BD if all APIs fail to avoid false blocks
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
