"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import AdminAvatar from "@/components/admin/AdminAvatar";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";
import OrderAmountBreakdown from "@/components/admin/OrderAmountBreakdown";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import DashboardCharts from "@/components/admin/charts/DashboardCharts";
import { useAdminOrders } from "@/hooks/useAdmin";
import { getAdminPageMeta } from "@/lib/admin/navigation";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useAdminOrders({
    page: 1,
    limit: 200,
  });
  const meta = getAdminPageMeta("/admin");

  const orders = data?.orders ?? [];
  const stats = data?.stats;
  const uniqueCustomers = new Set(orders.map((o) => o.phone)).size;
  const avgOrder =
    orders.length > 0
      ? Math.round((stats?.totalRevenue ?? 0) / orders.length)
      : 0;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        breadcrumb={meta.breadcrumb}
        action={
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            <TrendingUp className={`h-4 w-4 ${isFetching ? "animate-pulse" : ""}`} />
            Refresh Data
          </button>
        }
      />

      <div className="rounded-md border border-primary/20 bg-gradient-to-r from-primary/5 via-white to-primary/5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Store Performance</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
              Your VigoMax store is live
            </h3>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Monitor confirmed orders, revenue, and customer activity from this
              dashboard.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary"
          >
            View All Orders
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Total Orders"
          value={isLoading ? "—" : String(stats?.totalOrders ?? 0)}
          hint="Confirmed orders"
          icon={ShoppingBag}
          accent="primary"
        />
        <AdminStatCard
          title="Total Revenue"
          value={isLoading ? "—" : `${stats?.totalRevenue ?? 0}৳`}
          hint="Gross sales amount"
          icon={Banknote}
          accent="emerald"
        />
        <AdminStatCard
          title="Customers"
          value={isLoading ? "—" : String(uniqueCustomers)}
          hint="Unique phone numbers"
          icon={Users}
          accent="blue"
        />
        <AdminStatCard
          title="Avg. Order Value"
          value={isLoading ? "—" : `${avgOrder}৳`}
          hint="Per confirmed order"
          icon={Package}
          accent="violet"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-md border border-slate-200 bg-white" />
          <div className="h-80 animate-pulse rounded-md border border-slate-200 bg-white" />
          <div className="h-80 animate-pulse rounded-md border border-slate-200 bg-white lg:col-span-2" />
        </div>
      ) : (
        <DashboardCharts orders={orders} />
      )}

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              Recent Orders
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Latest confirmed customer orders
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-primary hover:text-secondary"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <AdminTableSkeleton rows={5} />
        ) : isError ? (
          <div className="p-6 text-sm text-red-500">Failed to load orders</div>
        ) : orders.length === 0 ? (
          <AdminEmptyState
            title="No orders yet"
            description="When customers confirm orders, they will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 sm:px-6">Customer</th>
                  <th className="px-4 py-3 sm:px-6">Package</th>
                  <th className="hidden px-4 py-3 md:table-cell sm:px-6">Phone</th>
                  <th className="px-4 py-3 sm:px-6">Status</th>
                  <th className="px-4 py-3 sm:px-6">Amount</th>
                  <th className="hidden px-4 py-3 lg:table-cell sm:px-6">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <AdminAvatar name={order.fullName} />
                        <div>
                          <p className="font-medium text-slate-900">
                            {order.fullName}
                          </p>
                          <p className="text-xs text-slate-500 md:hidden">
                            {order.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 sm:px-6">
                      {order.packageName}
                    </td>
                    <td
                      lang="en"
                      className="hidden px-4 py-4 text-slate-600 md:table-cell sm:px-6"
                    >
                      {order.phone}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <OrderAmountBreakdown
                        subtotal={order.subtotal}
                        deliveryCharge={order.deliveryCharge}
                        total={order.total}
                        compact
                      />
                    </td>
                    <td
                      lang="en"
                      className="hidden px-4 py-4 text-slate-500 lg:table-cell sm:px-6"
                    >
                      {new Date(order.confirmedAt ?? order.createdAt).toLocaleDateString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
