import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { parseOrderId } from "@/lib/orderValidation";
import type { Order } from "@/types/order";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { orderId } = await context.params;
    const objectId = parseOrderId(orderId);

    if (!objectId) {
      return NextResponse.json(
        { success: false, message: "অর্ডার পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    const orders = await dbConnect<Order>("orders");
    const order = await orders.findOne({ _id: objectId });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "অর্ডার পাওয়া যায়নি" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id?.toString(),
        fullName: order.fullName,
        packageName: order.packageName,
        total: order.total,
        phone: order.phone,
        status: order.status,
        smsSent: Boolean(order.smsSent),
        createdAt: order.createdAt?.toISOString?.() ?? order.createdAt,
      },
    });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, message: "অর্ডার লোড করা যায়নি" },
      { status: 500 }
    );
  }
}
