import { NextResponse } from "next/server";
import {
  createAdminToken,
  verifyAdminCredentials,
  verifyAdminToken,
  getTokenFromRequest,
} from "@/lib/auth/adminToken";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token: createAdminToken(),
      username,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Server error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const token = getTokenFromRequest(request);

  if (!verifyAdminToken(token)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, message: "Authenticated" });
}
