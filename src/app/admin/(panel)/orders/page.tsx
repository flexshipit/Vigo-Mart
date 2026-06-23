"use client";

import { useEffect, useState } from "react";
import { Pencil, Search } from "lucide-react";
import AdminAvatar from "@/components/admin/AdminAvatar";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";
import OrderFilters, {
  type OrderStatusFilter,
} from "@/components/admin/OrderFilters";
import OrderAmountBreakdown from "@/components/admin/OrderAmountBreakdown";
import OrderManageDialog from "@/components/admin/OrderManageDialog";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { useAdminOrders } from "@/hooks/useAdmin";
import type { AdminOrder } from "@/lib/api/admin";
import type { OrderDatePreset } from "@/lib/admin/orderDateRange";
import { getAdminPageMeta } from "@/lib/admin/navigation";

const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [datePreset, setDatePreset] = useState<OrderDatePreset>("lifetime");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const meta = getAdminPageMeta("/admin/orders");

  const customRangeReady =
    datePreset !== "custom" || (Boolean(customFrom) && Boolean(customTo));

  const { data, isLoading, isError, refetch, isFetching } = useAdminOrders({
    page,
    limit: PAGE_SIZE,
    q: search,
    status: statusFilter,
    datePreset,
    from: datePreset === "custom" ? customFrom : undefined,
    to: datePreset === "custom" ? customTo : undefined,
    enabled: customRangeReady,
  });

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;
  const stats = data?.stats;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const hasActiveFilters =
    statusFilter !== "all" ||
    datePreset !== "lifetime" ||
    Boolean(search);

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        breadcrumb={meta.breadcrumb}
        action={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
            >
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        }
      />

      <OrderFilters
        status={statusFilter}
        datePreset={datePreset}
        customFrom={customFrom}
        customTo={customTo}
        onStatusChange={(value) => {
          setStatusFilter(value);
          resetPage();
        }}
        onDatePresetChange={(value) => {
          setDatePreset(value);
          resetPage();
        }}
        onCustomFromChange={(value) => {
          setCustomFrom(value);
          resetPage();
        }}
        onCustomToChange={(value) => {
          setCustomTo(value);
          resetPage();
        }}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">
            {hasActiveFilters ? "Filtered Orders" : "Total Orders"}
          </p>
          <p lang="en" className="mt-1 text-2xl font-bold text-slate-900">
            {isLoading ? "—" : stats?.totalOrders ?? 0}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">This Page</p>
          <p lang="en" className="mt-1 text-2xl font-bold text-slate-900">
            {isLoading ? "—" : orders.length}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p lang="en" className="mt-1 text-2xl font-bold text-primary">
            {isLoading ? "—" : `${stats?.totalRevenue ?? 0}৳`}
          </p>
          {hasActiveFilters && (
            <p className="mt-1 text-xs text-slate-400">Based on current filters</p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        {!customRangeReady ? (
          <div className="p-6 text-sm text-slate-500">
            Select a start and end date for the custom range.
          </div>
        ) : isLoading ? (
          <AdminTableSkeleton rows={PAGE_SIZE} />
        ) : isError ? (
          <div className="p-6 text-sm text-red-500">Failed to load orders</div>
        ) : orders.length === 0 ? (
          <AdminEmptyState
            title={hasActiveFilters ? "No matching orders" : "No orders found"}
            description={
              hasActiveFilters
                ? "Try changing the status or date filters, or clear the search field."
                : "Orders will show up here once customers place orders."
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Courier</th>
                    <th className="px-6 py-3">Tracking</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t border-slate-100 transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <AdminAvatar name={order.fullName} />
                          <div>
                            <p className="font-medium text-slate-900">
                              {order.fullName}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {order.packageName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {order.courierName || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {order.courierShipment ? (
                          <div>
                            <p lang="en" className="text-xs font-medium text-slate-800">
                              {order.courierShipment.trackingId}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {order.courierShipment.statusLabel}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <OrderAmountBreakdown
                          subtotal={order.subtotal}
                          deliveryCharge={order.deliveryCharge}
                          total={order.total}
                          compact
                        />
                      </td>
                      <td
                        lang="en"
                        className="px-6 py-4 text-slate-500"
                      >
                        {new Date(order.confirmedAt ?? order.createdAt).toLocaleString("en-US")}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 lg:hidden">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <AdminAvatar name={order.fullName} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {order.fullName}
                          </p>
                        </div>
                        <OrderAmountBreakdown
                          subtotal={order.subtotal}
                          deliveryCharge={order.deliveryCharge}
                          total={order.total}
                          compact
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                          {order.packageName}
                        </span>
                        {order.courierName && (
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                            {order.courierName}
                          </span>
                        )}
                        {order.courierShipment && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                            {order.courierShipment.statusLabel}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm text-slate-600">{order.district}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {order.address}
                      </p>
                      <p lang="en" className="mt-3 text-[11px] text-slate-400">
                        {new Date(order.confirmedAt ?? order.createdAt).toLocaleString("en-US")}
                      </p>

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Manage Order
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {pagination && (
              <AdminPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                limit={pagination.limit}
                onPageChange={setPage}
                isLoading={isFetching}
              />
            )}
          </>
        )}
      </div>

      <OrderManageDialog
        order={
          selectedOrder
            ? orders.find((item) => item._id === selectedOrder._id) ?? selectedOrder
            : null
        }
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
