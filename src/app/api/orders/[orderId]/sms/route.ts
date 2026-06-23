import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { sendOrderConfirmationSms } from "@/lib/mimsms";
import { parseOrderId } from "@/lib/orderValidation";
import type { Order } from "@/types/order";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
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

    if (order.smsSent) {
      return NextResponse.json({
        success: true,
        message: "আপনার ফোনে confirmation SMS ইতিমধ্যে পাঠানো হয়েছে।",
        alreadySent: true,
      });
    }

    const smsResult = await sendOrderConfirmationSms(order.phone, {
      fullName: order.fullName,
      packageName: order.packageName,
      total: order.total,
      orderId,
    });

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

    await orders.updateOne(
      { _id: objectId },
      {
        $set: {
          smsSent: true,
          smsSentAt: new Date(),
        },
      }
    );

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
