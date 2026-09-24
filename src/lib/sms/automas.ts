const DEFAULT_JSON_URL = "https://api.automas.com.bd/smsapiv4";
const DEFAULT_SENDER_ID = "8809617642693";

const STATUS_MESSAGES: Record<number, string> = {
  0: "Success",
  101: "Invalid message length",
  102: "Sender not valid",
  103: "Authentication failed",
  104: "Invalid user",
  105: "Invalid MSISDN",
  106: "Incorrect API key",
  107: "User account suspended",
  108: "IP address not allowed",
  109: "API access not allowed",
  110: "Do not disturb",
  111: "Spam word detected",
  1000: "Insufficient balance",
  2000: "Destination provider unavailable",
  2300: "Destination route issue",
  2400: "API access not allowed",
  3000: "Destination provider unavailable",
  3300: "System error",
  4000: "Destination provider unavailable",
};

export function isAutomasSmsConfigured(): boolean {
  const apiKey = process.env.AUTOMAS_SMS_API_KEY?.trim() ?? "";
  return Boolean(apiKey) && !apiKey.includes("YOUR_");
}

/** Normalize to 01XXXXXXXXX when possible (matches Automas examples). */
export function normalizeSmsPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (/^01\d{9}$/.test(digits)) return digits;

  if (digits.length === 13 && digits.startsWith("880")) {
    const local = `0${digits.slice(3)}`;
    return /^01\d{9}$/.test(local) ? local : null;
  }

  if (digits.length === 10 && digits.startsWith("1")) {
    const local = `0${digits}`;
    return /^01\d{9}$/.test(local) ? local : null;
  }

  return null;
}

function getConfig() {
  return {
    apiKey: process.env.AUTOMAS_SMS_API_KEY?.trim() ?? "",
    senderId:
      process.env.AUTOMAS_SMS_SENDER_ID?.trim() || DEFAULT_SENDER_ID,
    jsonUrl:
      process.env.AUTOMAS_SMS_JSON_API_URL?.trim() || DEFAULT_JSON_URL,
  };
}

function parseProviderPayload(payload: unknown): {
  status: number;
  id?: number | string;
  msisdn?: string;
} {
  if (!payload || typeof payload !== "object") {
    return { status: -1 };
  }

  const root = payload as Record<string, unknown>;

  if (Array.isArray(root.response) && root.response[0]) {
    const first = root.response[0] as Record<string, unknown>;
    return {
      status: Number(first.status ?? -1),
      id: (first.id as number | string | undefined) ?? undefined,
      msisdn: typeof first.msisdn === "string" ? first.msisdn : undefined,
    };
  }

  return {
    status: Number(root.status ?? -1),
    id: (root.id as number | string | undefined) ?? undefined,
    msisdn: typeof root.msisdn === "string" ? root.msisdn : undefined,
  };
}

export async function sendAutomasSms(
  phone: string,
  message: string
): Promise<{
  success: boolean;
  skipped?: boolean;
  providerStatus?: number;
  providerMessageId?: number | string;
  phone?: string;
  error?: string;
  message?: string;
}> {
  if (!isAutomasSmsConfigured()) {
    return {
      success: true,
      skipped: true,
      message: "SMS service is not configured",
    };
  }

  const normalized = normalizeSmsPhone(phone);
  if (!normalized) {
    return {
      success: false,
      providerStatus: 105,
      error: "Invalid MSISDN",
      message: "Invalid phone number",
      phone,
    };
  }

  const text = message.trim();
  if (!text) {
    return {
      success: false,
      providerStatus: 101,
      error: "Invalid message length",
      message: "SMS message is empty",
      phone: normalized,
    };
  }

  const { apiKey, senderId, jsonUrl } = getConfig();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const response = await fetch(jsonUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        senderid: senderId,
        type: "text",
        scheduledDateTime: "",
        msg: text,
        contacts: normalized,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const payload = await response.json().catch(() => null);
    const parsed = parseProviderPayload(payload);
    const providerStatus = Number.isFinite(parsed.status) ? parsed.status : -1;

    if (!response.ok || providerStatus !== 0) {
      const error =
        STATUS_MESSAGES[providerStatus] ||
        `SMS provider error (${providerStatus})`;

      console.error("[Automas SMS]", {
        providerStatus,
        phone: normalized,
        httpStatus: response.status,
      });

      return {
        success: false,
        providerStatus,
        providerMessageId: parsed.id,
        phone: normalized,
        error,
        message: error,
      };
    }

    return {
      success: true,
      providerStatus: 0,
      providerMessageId: parsed.id,
      phone: parsed.msisdn || normalized,
      message: "SMS sent successfully",
    };
  } catch (error) {
    const aborted =
      error instanceof Error && error.name === "AbortError";
    const message = aborted
      ? "SMS provider timed out"
      : "Unable to reach SMS provider";

    console.error("[Automas SMS] network error:", error);

    return {
      success: false,
      phone: normalized,
      error: message,
      message,
    };
  }
}
