import type {
  BdCourierCheckResult,
  BdCourierPlan,
  BdCourierReport,
  BdCourierRiskVerdict,
  BdCourierStats,
} from "@/types/bdCourier";

const BD_COURIER_PHONE_REGEX = /^01\d{9}$/;

function getConfig() {
  const baseUrl = (
    process.env.BD_COURIER_API_URL || "https://api.bdcourier.com"
  ).replace(/\/$/, "");
  const token = process.env.BD_COURIER_API_TOKEN?.trim() ?? "";

  return { baseUrl, token };
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function isBdCourierConfigured(): boolean {
  const { token } = getConfig();
  return Boolean(token) && !token.includes("YOUR_API_TOKEN");
}

export function normalizeBdCourierPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 11 && BD_COURIER_PHONE_REGEX.test(digits)) {
    return digits;
  }

  if (digits.length === 13 && digits.startsWith("880")) {
    const local = `0${digits.slice(3)}`;
    return BD_COURIER_PHONE_REGEX.test(local) ? local : null;
  }

  if (digits.length === 10 && digits.startsWith("1")) {
    const local = `0${digits}`;
    return BD_COURIER_PHONE_REGEX.test(local) ? local : null;
  }

  return null;
}

function parseStats(value: unknown): BdCourierStats | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;

  return {
    name: asString(row.name) || undefined,
    logo: asString(row.logo) || undefined,
    total_parcel: asNumber(row.total_parcel),
    success_parcel: asNumber(row.success_parcel),
    cancelled_parcel: asNumber(row.cancelled_parcel),
    success_ratio: asNumber(row.success_ratio),
  };
}

function parseRiskVerdict(value: unknown): BdCourierRiskVerdict | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const reasons = Array.isArray(row.reasons)
    ? row.reasons.filter((item): item is string => typeof item === "string")
    : [];

  return {
    level: asString(row.level, "unknown"),
    label: asString(row.label, asString(row.level, "Unknown")),
    action: asString(row.action, "Review before shipping"),
    color: asString(row.color, "gray"),
    reasons,
  };
}

function normalizeCheckPayload(
  payload: Record<string, unknown>,
  phone: string
): BdCourierCheckResult {
  const data =
    payload.data && typeof payload.data === "object"
      ? (payload.data as Record<string, unknown>)
      : {};

  const summary = parseStats(data.summary);
  const couriers: Array<BdCourierStats & { key: string }> = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === "summary") continue;
    const stats = parseStats(value);
    if (!stats) continue;
    couriers.push({
      key,
      ...stats,
      name: stats.name || key,
    });
  }

  const riskVerdict = parseRiskVerdict(payload.risk_verdict);

  const reports = Array.isArray(payload.reports)
    ? payload.reports
        .filter(
          (item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object"
        )
        .map(
          (item): BdCourierReport => ({
            id: (item.id as number | string) ?? Math.random(),
            name: asString(item.name) || undefined,
            details: asString(item.details) || undefined,
            created_at: asString(item.created_at) || undefined,
            courierLogo: asString(item.courierLogo) || undefined,
            courierName: asString(item.courierName) || undefined,
          })
        )
    : [];

  return {
    status:
      asString(payload.status, "success") === "error" ? "error" : "success",
    phone: asString(payload.phone, phone),
    success_ratio: asNumber(payload.success_ratio, summary?.success_ratio ?? 0),
    risk_level: asString(payload.risk_level, riskVerdict?.level || "unknown"),
    risk_verdict: riskVerdict,
    summary,
    couriers,
    reports,
    message: asString(payload.message) || asString(payload.error) || undefined,
  };
}

export async function checkBdCourierCustomer(
  rawPhone: string
): Promise<BdCourierCheckResult> {
  const phone = normalizeBdCourierPhone(rawPhone);

  if (!phone) {
    return {
      status: "error",
      phone: rawPhone.trim(),
      success_ratio: 0,
      risk_level: "unknown",
      risk_verdict: null,
      summary: null,
      couriers: [],
      reports: [],
      message: "Please enter a valid 11-digit Bangladesh phone number.",
    };
  }

  if (!isBdCourierConfigured()) {
    return {
      status: "error",
      phone,
      success_ratio: 0,
      risk_level: "unknown",
      risk_verdict: null,
      summary: null,
      couriers: [],
      reports: [],
      message: "Courier API is not configured.",
    };
  }

  const { baseUrl, token } = getConfig();

  try {
    const response = await fetch(`${baseUrl}/courier-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone }),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (!response.ok) {
      return {
        status: "error",
        phone,
        success_ratio: 0,
        risk_level: "unknown",
        risk_verdict: null,
        summary: null,
        couriers: [],
        reports: [],
        message:
          asString(payload.message) ||
          asString(payload.error) ||
          "Unable to check courier information.",
      };
    }

    const normalized = normalizeCheckPayload(payload, phone);

    if (normalized.status === "error") {
      return {
        ...normalized,
        message: normalized.message || "Unable to check courier information.",
      };
    }

    return normalized;
  } catch (error) {
    console.error("BD Courier API error:", error);
    return {
      status: "error",
      phone,
      success_ratio: 0,
      risk_level: "unknown",
      risk_verdict: null,
      summary: null,
      couriers: [],
      reports: [],
      message: "Unable to check courier information. Please try again.",
    };
  }
}

export async function fetchBdCourierPlans(): Promise<{
  success: boolean;
  plans: BdCourierPlan[];
  message?: string;
}> {
  if (!isBdCourierConfigured()) {
    return {
      success: false,
      plans: [],
      message: "Courier API is not configured.",
    };
  }

  const { baseUrl, token } = getConfig();

  try {
    const response = await fetch(`${baseUrl}/plans`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "message" in payload
          ? String((payload as { message?: unknown }).message ?? "")
          : "Unable to load courier plans.";

      return { success: false, plans: [], message };
    }

    const list = Array.isArray(payload)
      ? payload
      : payload &&
          typeof payload === "object" &&
          Array.isArray((payload as { data?: unknown }).data)
        ? (payload as { data: unknown[] }).data
        : payload &&
            typeof payload === "object" &&
            Array.isArray((payload as { plans?: unknown }).plans)
          ? (payload as { plans: unknown[] }).plans
          : [];

    const plans: BdCourierPlan[] = list
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object"
      )
      .map((item) => ({
        id: (item.id as number | string) ?? item.name ?? Math.random(),
        name: asString(item.name, "Plan"),
        price: (item.price as number | string) ?? 0,
        features: Array.isArray(item.features)
          ? item.features.filter((f): f is string => typeof f === "string")
          : undefined,
      }));

    return { success: true, plans };
  } catch (error) {
    console.error("BD Courier plans error:", error);
    return {
      success: false,
      plans: [],
      message: "Unable to load courier plans.",
    };
  }
}
