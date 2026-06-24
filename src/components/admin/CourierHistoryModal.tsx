"use client";

import { ExternalLink, History, Loader2, X } from "lucide-react";
import OrderAmountBreakdown from "@/components/admin/OrderAmountBreakdown";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import { useCourierHistory } from "@/hooks/useAdmin";
import type { CourierPhoneHistoryResult } from "@/types/courier";

type CourierHistoryModalProps = {
  phone: string;
  customerName?: string;
  open: boolean;
  onClose: () => void;
};

function formatRating(rating?: string) {
  if (!rating) return null;
  return rating.replace(/_/g, " ");
}

function CourierApiCard({
  name,
  accent,
  history,
}: {
  name: string;
  accent: "blue" | "primary";
  history: CourierPhoneHistoryResult;
}) {
  const accentClasses =
    accent === "blue"
      ? "border-blue-100 bg-blue-50/60"
      : "border-primary/10 bg-primary/5";

  return (
    <div className={`rounded-md border p-4 ${accentClasses}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="mt-1 text-xs text-slate-500">
            {history.success ? "Live courier API data" : history.message}
          </p>
        </div>
        {history.success && (
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
            {history.successRate}% success
          </span>
        )}
      </div>

      {history.success ? (
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md bg-white p-3">
            <p className="text-[11px] text-slate-500">Total</p>
            <p lang="en" className="mt-1 text-lg font-bold text-slate-900">
              {history.total}
            </p>
          </div>
          <div className="rounded-md bg-white p-3">
            <p className="text-[11px] text-slate-500">Delivered</p>
            <p lang="en" className="mt-1 text-lg font-bold text-emerald-600">
              {history.delivered}
            </p>
          </div>
          <div className="rounded-md bg-white p-3">
            <p className="text-[11px] text-slate-500">Cancelled</p>
            <p lang="en" className="mt-1 text-lg font-bold text-red-500">
              {history.cancelled}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-red-500">{history.message}</p>
      )}

      {history.customerRating && (
        <p className="mt-3 text-xs text-slate-600">
          Rating:{" "}
          <span className="font-medium capitalize text-slate-800">
            {formatRating(history.customerRating)}
          </span>
          {history.riskLevel && (
            <span className="text-slate-500"> · Risk: {history.riskLevel}</span>
          )}
        </p>
      )}
    </div>
  );
}

export default function CourierHistoryModal({
  phone,
  customerName,
  open,
  onClose,
}: CourierHistoryModalProps) {
  const { data, isLoading, isError, error } = useCourierHistory(open ? phone : "");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-slate-950/60 p-4 sm:items-center">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Courier History
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {customerName ? `${customerName} · ` : ""}
                <span lang="en">{phone}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          {isLoading && (
            <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading courier history from VigoMax, Pathao and Steadfast...
            </div>
          )}

          {isError && (
            <p className="py-8 text-sm text-red-500">
              {error instanceof Error ? error.message : "Failed to load history"}
            </p>
          )}

          {data && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {data.customerName ?? customerName ?? "—"}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">VigoMax Orders</p>
                  <p lang="en" className="mt-1 text-lg font-bold text-slate-900">
                    {data.totalOrders}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">VigoMax Shipments</p>
                  <p lang="en" className="mt-1 text-lg font-bold text-primary">
                    {data.courierShipments}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <CourierApiCard
                  name="Pathao Courier"
                  accent="blue"
                  history={data.courierApis.pathao}
                />
                <CourierApiCard
                  name="Steadfast Courier"
                  accent="primary"
                  history={data.courierApis.steadfast}
                />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  VigoMax Order History
                </h3>

                {data.orders.length === 0 ? (
                  <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                    No VigoMax orders found for <span lang="en">{data.phone}</span>
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.orders.map((order) => (
                      <article
                        key={order._id}
                        className="rounded-md border border-slate-200 p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-slate-900">
                                {order.packageName}
                              </p>
                              <OrderStatusBadge status={order.status} />
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                              {order.district} — {order.address}
                            </p>
                            <p lang="en" className="mt-2 text-xs text-slate-400">
                              Order #{order._id.slice(-6).toUpperCase()} ·{" "}
                              {new Date(
                                order.confirmedAt ?? order.createdAt
                              ).toLocaleString("en-US")}
                            </p>
                          </div>
                          <OrderAmountBreakdown
                            subtotal={order.subtotal}
                            deliveryCharge={order.deliveryCharge}
                            total={order.total}
                            compact
                          />
                        </div>

                        {order.courierShipment ? (
                          <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                {order.courierName ?? order.courierShipment.courierId}
                              </span>
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                {order.courierShipment.statusLabel}
                              </span>
                              {order.liveCourierStatus?.success &&
                                order.liveCourierStatus.statusLabel && (
                                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                                    Live: {order.liveCourierStatus.statusLabel}
                                  </span>
                                )}
                            </div>
                            <div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                              <p>
                                <span className="text-slate-500">Tracking:</span>{" "}
                                <span lang="en" className="font-medium text-slate-800">
                                  {order.courierShipment.trackingId}
                                </span>
                              </p>
                              <p>
                                <span className="text-slate-500">Sent:</span>{" "}
                                <span lang="en">
                                  {new Date(
                                    order.courierShipment.sentAt
                                  ).toLocaleString("en-US")}
                                </span>
                              </p>
                              {order.courierShipment.lastTrackedAt && (
                                <p>
                                  <span className="text-slate-500">Last tracked:</span>{" "}
                                  <span lang="en">
                                    {new Date(
                                      order.courierShipment.lastTrackedAt
                                    ).toLocaleString("en-US")}
                                  </span>
                                </p>
                              )}
                              {order.courierShipment.invoice && (
                                <p>
                                  <span className="text-slate-500">Invoice:</span>{" "}
                                  <span lang="en">{order.courierShipment.invoice}</span>
                                </p>
                              )}
                            </div>
                            {order.liveCourierStatus &&
                              !order.liveCourierStatus.success && (
                                <p className="mt-2 text-xs text-primary">
                                  Live status: {order.liveCourierStatus.message}
                                </p>
                              )}
                            {order.courierShipment.trackingUrl && (
                              <a
                                href={order.courierShipment.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-secondary"
                              >
                                Open tracking
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <p className="mt-4 text-xs text-slate-400">
                            No courier shipment for this order yet
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
