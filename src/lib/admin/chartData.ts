import type { AdminOrder } from "@/lib/api/admin";
import { getOrderItems } from "@/lib/orderItems";

const CHART_COLORS = ["#0d7c66", "#16a085", "#3b82f6", "#8b5cf6", "#f4b400"];

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getLast7DaysLabels() {
  const days: { key: string; label: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    days.push({
      key: date.toISOString().slice(0, 10),
      label: formatShortDate(date),
    });
  }

  return days;
}

export function buildRevenueChartData(orders: AdminOrder[]) {
  const days = getLast7DaysLabels();

  return days.map(({ key, label }) => {
    const dayOrders = orders.filter((order) => {
      const confirmed = new Date(order.confirmedAt ?? order.createdAt);
      confirmed.setHours(0, 0, 0, 0);
      return confirmed.toISOString().slice(0, 10) === key;
    });

    return {
      date: label,
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    };
  });
}

export function buildPackageChartData(orders: AdminOrder[]) {
  const map = new Map<string, { name: string; value: number; revenue: number }>();

  for (const order of orders) {
    const items = getOrderItems(order);

    for (const item of items) {
      const existing = map.get(item.packageId) ?? {
        name: item.packageName,
        value: 0,
        revenue: 0,
      };

      existing.value += item.quantity;
      existing.revenue += item.lineTotal;
      map.set(item.packageId, existing);
    }
  }

  return Array.from(map.values()).map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));
}

export function buildOrdersBarData(orders: AdminOrder[]) {
  return buildRevenueChartData(orders).map((item) => ({
    date: item.date,
    orders: item.orders,
  }));
}

export { CHART_COLORS };
