import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { fetchBdCourierPlans, isBdCourierConfigured } from "@/lib/bdCourier";

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    if (!isBdCourierConfigured()) {
      return NextResponse.json(
        {
          success: false,
          status: "error",
          message: "Courier API is not configured.",
        },
        { status: 500 }
      );
    }

    const result = await fetchBdCourierPlans();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          status: "error",
          message: result.message || "Unable to load courier plans.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "success",
      data: result.plans,
    });
  } catch (error) {
    console.error("BD Courier plans route error:", error);
    return NextResponse.json(
      {
        success: false,
        status: "error",
        message: "Unable to load courier plans.",
      },
      { status: 500 }
    );
  }
}
