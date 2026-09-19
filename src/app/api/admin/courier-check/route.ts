import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  checkBdCourierCustomer,
  isBdCourierConfigured,
  normalizeBdCourierPhone,
} from "@/lib/bdCourier";

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json().catch(() => null)) as {
      phone?: string;
    } | null;

    const rawPhone = body?.phone?.trim() ?? "";

    if (!rawPhone) {
      return NextResponse.json(
        {
          success: false,
          status: "error",
          message: "Phone number is required.",
        },
        { status: 400 }
      );
    }

    const phone = normalizeBdCourierPhone(rawPhone);
    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          status: "error",
          message: "Please enter a valid 11-digit Bangladesh phone number.",
        },
        { status: 400 }
      );
    }

    if (!isBdCourierConfigured()) {
      console.error("BD Courier environment variables are missing.");
      return NextResponse.json(
        {
          success: false,
          status: "error",
          message: "Courier API is not configured.",
        },
        { status: 500 }
      );
    }

    const result = await checkBdCourierCustomer(phone);

    if (result.status === "error") {
      return NextResponse.json(
        {
          success: false,
          status: "error",
          message:
            result.message ||
            "Unable to check courier information. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("BD Courier check route error:", error);
    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: "Unable to check courier information. Please try again.",
      },
      { status: 500 }
    );
  }
}
