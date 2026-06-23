import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { trackCourierShipment } from "@/lib/courier/service";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = requireAdmin(_request);
  if (!auth.ok) return auth.response;

  try {
    const { orderId } = await context.params;
    const result = await trackCourierShipment(orderId);

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
    console.error("Courier track error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to track courier shipment" },
      { status: 500 }
    );
  }
}
