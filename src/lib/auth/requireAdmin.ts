import { NextResponse } from "next/server";
import { getTokenFromRequest, verifyAdminToken } from "@/lib/auth/adminToken";

export function requireAdmin(request: Request) {
  const token = getTokenFromRequest(request);

  if (!verifyAdminToken(token)) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      ),
    };
  }

  return { ok: true as const };
}
