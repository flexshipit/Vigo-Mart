import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { parseOrderId } from "@/lib/orderValidation";
import {
  isOrderSmsConfigured,
  sendOrderNotificationSms,
} from "@/lib/sms/orderNotifications";
import type { Order } from "@/types/order";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

/** Retry endpoint for order-received SMS (thank-you page). */
export async function POST(_request: Request, context: RouteContext) {
  try {
    if (!isOrderSmsConfigured()) {
      return NextResponse.json({
        success: true,
        skipped: true,
        alreadySent: false,
      });
    }

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

    if (
      order.smsSent ||
      order.smsNotifications?.includes("order_received")
    ) {
      return NextResponse.json({
        success: true,
        message: "আপনার ফোনে confirmation SMS ইতিমধ্যে পাঠানো হয়েছে।",
        alreadySent: true,
      });
    }

    const smsResult = await sendOrderNotificationSms({
      orderId,
      phone: order.phone,
      notificationType: "order_received",
    });

    if (smsResult.skipped) {
      return NextResponse.json({
        success: true,
        skipped: true,
        alreadySent: false,
      });
    }

    if (smsResult.alreadySent) {
      return NextResponse.json({
        success: true,
        message: "আপনার ফোনে confirmation SMS ইতিমধ্যে পাঠানো হয়েছে।",
        alreadySent: true,
      });
    }

    if (!smsResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            smsResult.message ||
            "Confirmation SMS পাঠানো যায়নি, আবার চেষ্টা করুন",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "আপনার ফোনে confirmation SMS পাঠানো হয়েছে।",
      alreadySent: false,
    });
  } catch (error) {
    console.error("Send order SMS error:", error);
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
