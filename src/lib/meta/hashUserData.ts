import { createHash } from "crypto";

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function hashMetaPhone(phone: string) {
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

export function hashMetaName(fullName: string) {
  const firstName = fullName.trim().split(/\s+/)[0];
  if (!firstName) return undefined;
  return sha256(firstName);
}

export function hashMetaExternalId(value: string) {
  const normalized = value.trim();
  if (!normalized) return undefined;
  return sha256(normalized);
}
