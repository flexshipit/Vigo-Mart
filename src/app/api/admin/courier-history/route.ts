import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { serializeOrder } from "@/lib/admin/serializeOrder";
import {
  fetchBdCourierHistory,
  fetchCourierApiHistories,
  fetchLiveCourierStatuses,
} from "@/lib/courier/history";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { normalizePhone } from "@/lib/phone";
import type { Order } from "@/types/order";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const rawPhone = searchParams.get("phone")?.trim() ?? "";
    const phone = normalizePhone(rawPhone);

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid 11-digit Bangladesh phone number",
        },
        { status: 400 }
      );
    }

    const orders = await dbConnect<Order>("orders");
    const list = await orders
      .find({ phone })
      .sort({ createdAt: -1 })
      .toArray();

    const [courierApis, liveStatuses, bdCourier] = await Promise.all([
      fetchCourierApiHistories(phone),
      fetchLiveCourierStatuses(list),
      fetchBdCourierHistory(phone),
    ]);

    const serialized = list.map((order) => {
      const base = serializeOrder(order);
      const orderId = base._id;

      return {
        ...base,
        liveCourierStatus: orderId ? liveStatuses[orderId] : undefined,
      };
    });

    const withCourier = serialized.filter(
      (order) => order.courierShipment?.trackingId
    );

    return NextResponse.json({
      success: true,
      data: {
        phone,
        customerName: serialized[0]?.fullName ?? null,
        totalOrders: serialized.length,
        courierShipments: withCourier.length,
        courierApis,
        bdCourier,
        orders: serialized,
      },
    });
  } catch (error) {
    console.error("Courier history error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch courier history" },
      { status: 500 }
    );
  }
}
