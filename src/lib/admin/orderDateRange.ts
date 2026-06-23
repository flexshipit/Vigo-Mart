export type OrderDatePreset =
  | "today"
  | "yesterday"
  | "7days"
  | "15days"
  | "30days"
  | "lifetime"
  | "custom";

const DHAKA_OFFSET = "+06:00";

function dhakaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  return { year, month, day };
}

function dhakaDayBounds(year: number, month: number, day: number) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");

  return {
    start: new Date(`${year}-${mm}-${dd}T00:00:00.000${DHAKA_OFFSET}`),
    end: new Date(`${year}-${mm}-${dd}T23:59:59.999${DHAKA_OFFSET}`),
  };
}

function shiftDhakaDate(year: number, month: number, day: number, deltaDays: number) {
  const anchor = new Date(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T12:00:00.000${DHAKA_OFFSET}`);
  anchor.setUTCDate(anchor.getUTCDate() + deltaDays);
  return dhakaDateParts(anchor);
}

export function resolveOrderDateRange(input: {
  preset: OrderDatePreset;
  customFrom?: string;
  customTo?: string;
}): { from?: Date; to?: Date } | null {
  const now = new Date();
  const today = dhakaDateParts(now);

  if (input.preset === "lifetime") {
    return {};
  }

  if (input.preset === "today") {
    const bounds = dhakaDayBounds(today.year, today.month, today.day);
    return { from: bounds.start, to: bounds.end };
  }

  if (input.preset === "yesterday") {
    const yesterday = shiftDhakaDate(today.year, today.month, today.day, -1);
    const bounds = dhakaDayBounds(yesterday.year, yesterday.month, yesterday.day);
    return { from: bounds.start, to: bounds.end };
  }

  if (input.preset === "7days" || input.preset === "15days" || input.preset === "30days") {
    const days =
      input.preset === "7days" ? 6 : input.preset === "15days" ? 14 : 29;
    const startDate = shiftDhakaDate(today.year, today.month, today.day, -days);
    const start = dhakaDayBounds(startDate.year, startDate.month, startDate.day).start;
    const end = dhakaDayBounds(today.year, today.month, today.day).end;
    return { from: start, to: end };
  }

  if (input.preset === "custom") {
    if (!input.customFrom || !input.customTo) {
      return null;
    }

    const [fromYear, fromMonth, fromDay] = input.customFrom.split("-").map(Number);
    const [toYear, toMonth, toDay] = input.customTo.split("-").map(Number);

    if (!fromYear || !fromMonth || !fromDay || !toYear || !toMonth || !toDay) {
      return null;
    }

    const from = dhakaDayBounds(fromYear, fromMonth, fromDay).start;
    const to = dhakaDayBounds(toYear, toMonth, toDay).end;

    if (from > to) {
      return null;
    }

    return { from, to };
  }

  return {};
}

export const ORDER_DATE_PRESET_LABELS: Record<OrderDatePreset, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "7days": "7 Days",
  "15days": "15 Days",
  "30days": "30 Days",
  lifetime: "Lifetime",
  custom: "Custom",
};

export const ORDER_DATE_PRESETS: OrderDatePreset[] = [
  "today",
  "yesterday",
  "7days",
  "15days",
  "30days",
  "lifetime",
  "custom",
];
