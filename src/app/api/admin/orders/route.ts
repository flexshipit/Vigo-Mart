import { NextResponse } from "next/server";
import { buildAdminOrdersFilter } from "@/lib/admin/buildOrderFilter";
import {
  resolveOrderDateRange,
  type OrderDatePreset,
} from "@/lib/admin/orderDateRange";
import { serializeOrder } from "@/lib/admin/serializeOrder";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { dbConnect } from "@/lib/dbConnect";
import type { Order } from "@/types/order";

export const ADMIN_ORDERS_PAGE_SIZE = 10;

const DATE_PRESETS = new Set<OrderDatePreset>([
  "today",
  "yesterday",
  "7days",
  "15days",
  "30days",
  "lifetime",
  "custom",
]);

export async function GET(request: Request) {
  const auth = requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit") || ADMIN_ORDERS_PAGE_SIZE))
    );
    const q = searchParams.get("q")?.trim() ?? "";
    const status = searchParams.get("status")?.trim() ?? "all";
    const datePreset = (searchParams.get("datePreset")?.trim() ??
      "lifetime") as OrderDatePreset;
    const customFrom = searchParams.get("from")?.trim() ?? "";
    const customTo = searchParams.get("to")?.trim() ?? "";
    const skip = (page - 1) * limit;

    if (!DATE_PRESETS.has(datePreset)) {
      return NextResponse.json(
        { success: false, message: "Invalid date filter" },
        { status: 400 }
      );
    }

    const dateRange = resolveOrderDateRange({
      preset: datePreset,
      customFrom,
      customTo,
    });

    if (dateRange === null) {
      return NextResponse.json(
        { success: false, message: "Select a valid custom date range" },
        { status: 400 }
      );
    }

    const filter = buildAdminOrdersFilter({
      q,
      status,
      from: dateRange.from,
      to: dateRange.to,
    });

    const orders = await dbConnect<Order>("orders");

    const [list, filteredTotal, filteredRevenueAgg] = await Promise.all([
      orders
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      orders.countDocuments(filter),
      orders
        .aggregate<{ total: number }>([
          { $match: filter },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ])
        .toArray(),
    ]);

    const serialized = list.map(serializeOrder);
    const totalRevenue = filteredRevenueAgg[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(filteredTotal / limit));

    return NextResponse.json({
      success: true,
      data: {
        orders: serialized,
        stats: {
          totalOrders: filteredTotal,
          totalRevenue,
        },
        pagination: {
          page,
          limit,
          totalItems: filteredTotal,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
