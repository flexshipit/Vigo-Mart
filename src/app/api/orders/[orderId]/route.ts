import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getOrderItems, sumOrderQuantities } from "@/lib/orderItems";
import { parseOrderId } from "@/lib/orderValidation";
import { isOrderSmsConfigured } from "@/lib/sms/orderNotifications";
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

    const items = getOrderItems(order);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order._id?.toString(),
        fullName: order.fullName,
        items: items.map((item) => ({
          packageId: item.packageId,
          packageName: item.packageName,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
        packageName: order.packageName,
        quantity: sumOrderQuantities(items),
        total: order.total,
        phone: order.phone,
        status: order.status,
        smsSent: Boolean(
          order.smsSent || order.smsNotifications?.includes("order_received")
        ),
        smsEnabled: isOrderSmsConfigured(),
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
