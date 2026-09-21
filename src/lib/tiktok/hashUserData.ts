import { createHash } from "crypto";

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** TikTok expects E.164-style phone digits, then SHA-256. */
export function hashTikTokPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) return undefined;

  if (digits.startsWith("880")) {
    return sha256(digits);
  }

  if (digits.startsWith("0")) {
    return sha256(`880${digits.slice(1)}`);
  }

  return sha256(digits);
}

export function hashTikTokExternalId(value: string) {
  const normalized = value.trim();
  if (!normalized) return undefined;
  return sha256(normalized);
}
