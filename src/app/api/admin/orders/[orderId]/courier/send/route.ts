import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { sendOrderToCourier } from "@/lib/courier/service";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const auth = requireAdmin(_request);
  if (!auth.ok) return auth.response;

  try {
    const { orderId } = await context.params;
    const result = await sendOrderToCourier(orderId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: {
        ...result.data,
        sentAt: result.data.sentAt.toISOString(),
        lastTrackedAt: result.data.lastTrackedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Courier send error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send order to courier" },
      { status: 500 }
    );
  }
}
