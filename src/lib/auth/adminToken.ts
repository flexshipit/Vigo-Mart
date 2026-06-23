import { createHash, timingSafeEqual } from "crypto";

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (!username || !password || !secret) {
    throw new Error("Admin credentials are not configured in environment variables");
  }

  return { username, password, secret };
}

export function createAdminToken(): string {
  const { username, password, secret } = getAdminCredentials();

  return createHash("sha256")
    .update(`${username}:${password}:${secret}`)
    .digest("hex");
}

export function verifyAdminCredentials(username: string, password: string) {
  const creds = getAdminCredentials();
  return username === creds.username && password === creds.password;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;

  try {
    const expected = Buffer.from(createAdminToken(), "utf8");
    const received = Buffer.from(token, "utf8");

    if (expected.length !== received.length) return false;

    return timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return null;
}
