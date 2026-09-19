import { ObjectId } from "mongodb";
import {
  formatOrderItemsLabel,
  sumOrderQuantities,
} from "@/lib/orderItems";
import { getProductByPackageId, MAX_ORDER_QUANTITY, PRODUCTS } from "@/lib/products";
import type { CreateOrderPayload, OrderItem } from "@/types/order";

export function parseOrderId(orderId: string): ObjectId | null {
  if (!ObjectId.isValid(orderId)) return null;
  return new ObjectId(orderId);
}

export function validateOrderPayload(body: CreateOrderPayload) {
  const { fullName, district, address, phone } = body;

  if (!fullName || !district || !address || !phone) {
    return { ok: false as const, message: "সব আবশ্যক তথ্য পূরণ করুন" };
  }

  if (!/^01[3-9]\d{8}$/.test(phone)) {
    return { ok: false as const, message: "সঠিক 11 ডিজিটের ফোন নম্বর দিন" };
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0) {
    return { ok: false as const, message: "কমপক্ষে একটি পণ্য সিলেক্ট করুন" };
  }

  if (rawItems.length > PRODUCTS.length) {
    return { ok: false as const, message: "অর্ডারে অতিরিক্ত পণ্য আছে" };
  }

  const seen = new Set<string>();
  const items: OrderItem[] = [];

  for (const raw of rawItems) {
    const packageId = typeof raw?.packageId === "string" ? raw.packageId : "";
    const quantity = Number(raw?.quantity);

    if (!packageId) {
      return { ok: false as const, message: "প্যাকেজ পাওয়া যায়নি" };
    }

    if (seen.has(packageId)) {
      return { ok: false as const, message: "একই পণ্য একাধিকবার যোগ করা যায়নি" };
    }
    seen.add(packageId);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_ORDER_QUANTITY
    ) {
      return {
        ok: false as const,
        message: `প্রতিটি পণ্যের পরিমাণ ১ থেকে ${MAX_ORDER_QUANTITY} এর মধ্যে হতে হবে`,
      };
    }

    const product = getProductByPackageId(packageId);
    if (!product) {
      return { ok: false as const, message: "প্যাকেজ পাওয়া যায়নি" };
    }

    items.push({
      packageId: product.packageId,
      packageName: product.name,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    });
  }

  return {
    ok: true as const,
    items,
    packageLabel: formatOrderItemsLabel(items),
    totalPackets: sumOrderQuantities(items),
    subtotal: items.reduce((sum, item) => sum + item.lineTotal, 0),
    fullName: fullName.trim(),
    district: district.trim(),
    address: address.trim(),
    phone,
  };
}
