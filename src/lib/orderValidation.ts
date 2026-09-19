import { ObjectId } from "mongodb";
import { getProductByPackageId, MAX_ORDER_QUANTITY } from "@/lib/products";
import type { CreateOrderPayload } from "@/types/order";

export function parseOrderId(orderId: string): ObjectId | null {
  if (!ObjectId.isValid(orderId)) return null;
  return new ObjectId(orderId);
}

export function validateOrderPayload(body: CreateOrderPayload) {
  const { packageId, fullName, district, address, phone } = body;
  const quantity = Number(body.quantity);

  if (!packageId || !fullName || !district || !address || !phone) {
    return { ok: false as const, message: "সব আবশ্যক তথ্য পূরণ করুন" };
  }

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_ORDER_QUANTITY
  ) {
    return {
      ok: false as const,
      message: `পরিমাণ ১ থেকে ${MAX_ORDER_QUANTITY} এর মধ্যে হতে হবে`,
    };
  }

  if (!/^01[3-9]\d{8}$/.test(phone)) {
    return { ok: false as const, message: "সঠিক 11 ডিজিটের ফোন নম্বর দিন" };
  }

  const product = getProductByPackageId(packageId);
  if (!product) {
    return { ok: false as const, message: "প্যাকেজ পাওয়া যায়নি" };
  }

  return {
    ok: true as const,
    product,
    quantity,
    fullName: fullName.trim(),
    district: district.trim(),
    address: address.trim(),
    phone,
  };
}
