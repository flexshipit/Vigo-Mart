import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import {
  findRecentOrderByPhoneOrIp,
  getClientIp,
  getCountryByIp,
  ORDER_COOLDOWN_MESSAGE,
  ORDER_COOLDOWN_MS,
} from "@/lib/orderRateLimit";
import { trackMetaPurchase } from "@/lib/meta/conversions";
import { validateOrderPayload } from "@/lib/orderValidation";
import { DELIVERY_CHARGE } from "@/lib/products";
import type { CreateOrderPayload, Order } from "@/types/order";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    let country = (
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-vercel-ip-country") ||
      ""
    ).toUpperCase();

    if (!country && ip && ip !== "unknown") {
      country = await getCountryByIp(ip);
    }

    if (country && country !== "BD") {
      return NextResponse.json(
        {
          success: false,
          message: "আপনি অর্ডার করতে পারবেন না।",
        },
        { status: 403 }
      );
    }

    const body = (await request.json()) as CreateOrderPayload;
    const validation = validateOrderPayload(body);

    if (!validation.ok) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    const { product, quantity, fullName, district, address, phone } =
      validation;
    const now = new Date();
    const subtotal = product.price * quantity;
    const total = subtotal + DELIVERY_CHARGE;

    const orders = await dbConnect<Order>("orders");
    const cooldownSince = new Date(now.getTime() - ORDER_COOLDOWN_MS);
    const recentOrder = await findRecentOrderByPhoneOrIp(
      orders,
      phone,
      ip,
      cooldownSince
    );

    if (recentOrder) {
      return NextResponse.json(
        { success: false, message: ORDER_COOLDOWN_MESSAGE },
        { status: 429 }
      );
    }

    const metaEventId =
      body.eventId?.trim() ||
      `purchase_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    const order: Order = {
      packageId: product.packageId,
      packageName: product.name,
      packets: quantity,
      fullName,
      district,
      address,
      phone,
      ip,
      subtotal,
      deliveryCharge: DELIVERY_CHARGE,
      total,
      status: "confirmed",
      createdAt: now,
      confirmedAt: now,
      smsSent: false,
      metaEventId,
    };

    const result = await orders.insertOne(order);
    const orderId = result.insertedId.toString();

    void trackMetaPurchase({
      eventId: metaEventId,
      orderId,
      fullName,
      phone,
      packageId: product.packageId,
      packageName: product.name,
      total,
      ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
      fbp: body.fbp,
      fbc: body.fbc,
      eventSourceUrl: body.eventSourceUrl,
    }).then((metaResult) => {
      if (!metaResult.success) {
        console.warn("[Meta CAPI]", metaResult.message);
      }
    });

    return NextResponse.json({
      success: true,
      message: "অর্ডার সফলভাবে গ্রহণ করা হয়েছে",
      orderId,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "সার্ভারে সমস্যা হয়েছে",
      },
      { status: 500 }
    );
  }
}
