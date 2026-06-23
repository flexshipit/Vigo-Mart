import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { serializeOrder } from "@/lib/admin/serializeOrder";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getCourierById, isValidCourierId } from "@/lib/couriers";
import { isOrderStatus } from "@/lib/orderStatus";
import type { Order, UpdateOrderPayload } from "@/types/order";

type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { orderId } = await context.params;

    if (!ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { success: false, message: "Invalid order id" },
        { status: 400 }
      );
    }

    const body = (await request.json()) as UpdateOrderPayload;

    if (body.status === undefined && body.courierId === undefined) {
      return NextResponse.json(
        { success: false, message: "No updates provided" },
        { status: 400 }
      );
    }

    if (body.status !== undefined && !isOrderStatus(body.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid order status" },
        { status: 400 }
      );
    }

    let courierName: string | undefined;

    if (body.courierId !== undefined && body.courierId !== null && body.courierId !== "") {
      if (!isValidCourierId(body.courierId)) {
        return NextResponse.json(
          { success: false, message: "Invalid courier" },
          { status: 400 }
        );
      }
      courierName = getCourierById(body.courierId)?.name;
    }

    const orders = await dbConnect<Order>("orders");
    const objectId = new ObjectId(orderId);
    const existing = await orders.findOne({ _id: objectId });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const setFields: Partial<Order> = { statusUpdatedAt: new Date() };
    const unsetFields: Record<string, ""> = {};

    if (body.status !== undefined) {
      setFields.status = body.status;
    }

    if (body.courierId !== undefined) {
      if (body.courierId === null || body.courierId === "") {
        unsetFields.courierId = "";
        unsetFields.courierName = "";
        unsetFields.courierShipment = "";
      } else {
        const courierChanged = existing.courierId !== body.courierId;
        setFields.courierId = body.courierId;
        setFields.courierName = courierName;

        if (courierChanged && existing.courierShipment) {
          unsetFields.courierShipment = "";
        }
      }
    }

    await orders.updateOne(
      { _id: objectId },
      {
        $set: setFields,
        ...(Object.keys(unsetFields).length ? { $unset: unsetFields } : {}),
      }
    );

    const updated = await orders.findOne({ _id: objectId });

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      data: updated ? serializeOrder(updated) : null,
    });
  } catch (error) {
    console.error("Admin order PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}
