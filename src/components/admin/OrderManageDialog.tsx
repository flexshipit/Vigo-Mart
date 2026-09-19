"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  History,
  Loader2,
  RefreshCw,
  Send,
  Truck,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import CourierHistoryModal from "@/components/admin/CourierHistoryModal";
import OrderAmountBreakdown from "@/components/admin/OrderAmountBreakdown";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import {
  useAdminCouriers,
  useSendOrderToCourier,
  useTrackCourierOrder,
  useUpdateOrder,
} from "@/hooks/useAdmin";
import type { AdminOrder } from "@/lib/api/admin";
import { getCourierOrderId } from "@/lib/courier/utils";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types/order";

type OrderManageDialogProps = {
  order: AdminOrder | null;
  onClose: () => void;
};

export default function OrderManageDialog({
  order,
  onClose,
}: OrderManageDialogProps) {
  const { data: couriers = [] } = useAdminCouriers();
  const updateOrder = useUpdateOrder();
  const sendToCourier = useSendOrderToCourier();
  const trackCourier = useTrackCourierOrder();

  const [status, setStatus] = useState<OrderStatus>("confirmed");
  const [courierId, setCourierId] = useState("");
  const [riderNote, setRiderNote] = useState("");
  const [courierHistoryOpen, setCourierHistoryOpen] = useState(false);

  useEffect(() => {
    if (!order) return;
    setStatus(order.status);
    setCourierId(order.courierId ?? "");
    setRiderNote(order.riderNote ?? "");
    setCourierHistoryOpen(false);
  }, [order]);

  if (!order) return null;

  const shipment = order.courierShipment;
  const courierOrderId = getCourierOrderId(shipment);
  const selectedCourier = couriers.find((item) => item.id === courierId);
  const isSent = Boolean(shipment?.trackingId);

  const handleSave = () => {
    updateOrder.mutate(
      {
        orderId: order._id,
        payload: {
          status,
          courierId: courierId || null,
          riderNote: riderNote || null,
        },
      },
      {
        onSuccess: (result) => {
          toast.success(result.message || "Order updated");
          onClose();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update order");
        },
      }
    );
  };

  const handleSend = async () => {
    if (!courierId) {
      toast.error("Select a courier first");
      return;
    }

    if (!selectedCourier?.configured) {
      toast.error(`${selectedCourier?.name ?? "Courier"} API is not configured`);
      return;
    }

    const needsSave =
      courierId !== order.courierId ||
      status !== order.status ||
      riderNote !== (order.riderNote ?? "");

    try {
      if (needsSave) {
        await updateOrder.mutateAsync({
          orderId: order._id,
          payload: {
            status,
            courierId,
            riderNote: riderNote || null,
          },
        });
      }

      const result = await sendToCourier.mutateAsync(order._id);
      toast.success(result.message || "Sent to courier");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send to courier"
      );
    }
  };

  const handleTrack = () => {
    trackCourier.mutate(order._id, {
      onSuccess: (result) => {
        toast.success(result.message || "Tracking updated");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to track shipment");
      },
    });
  };

  const handleCheckCourier = () => {
    setCourierHistoryOpen(true);
  };

  return (
    <>
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/50 p-4 sm:items-center">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md border border-slate-200 bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Manage Order</p>
            <p className="mt-1 text-xs text-slate-500">{order.fullName}</p>
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

        <div className="space-y-5 px-5 py-5">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Current Status</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="mt-3 flex justify-between gap-3">
              <span className="text-slate-500">Contact</span>
              <a
                href={`tel:${order.phone}`}
                lang="en"
                className="font-medium text-primary hover:text-secondary"
              >
                {order.phone}
              </a>
            </div>
            <div className="mt-3 flex justify-between gap-3">
              <span className="text-slate-500">Package</span>
              <span className="text-right font-medium text-slate-800">
                {order.packageName}
                {order.packets > 1 ? (
                  <span lang="en" className="text-slate-500">
                    {" "}
                    × {order.packets}
                  </span>
                ) : null}
              </span>
            </div>
            <div className="mt-3 flex justify-between gap-3">
              <span className="shrink-0 text-slate-500">Location</span>
              <span className="text-right font-medium text-slate-800">
                {order.district}
              </span>
            </div>
            <div className="mt-3 flex justify-between gap-3">
              <span className="shrink-0 text-slate-500">Address</span>
              <span className="max-w-[240px] text-right leading-relaxed text-slate-700">
                {order.address}
              </span>
            </div>
            <div className="mt-3 flex justify-between gap-3">
              <span className="text-slate-500">Order Date</span>
              <span lang="en" className="text-slate-700">
                {new Date(order.confirmedAt ?? order.createdAt).toLocaleString("en-US")}
              </span>
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3">
              <OrderAmountBreakdown
                subtotal={order.subtotal}
                deliveryCharge={order.deliveryCharge}
                total={order.total}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Order Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {ORDER_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {ORDER_STATUS_LABELS[item]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Truck className="h-4 w-4 text-slate-400" />
              Courier Partner
            </label>
            <select
              value={courierId}
              onChange={(e) => setCourierId(e.target.value)}
              disabled={isSent}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-100"
            >
              <option value="">Select courier</option>
              {couriers.map((courier) => (
                <option key={courier.id} value={courier.id}>
                  {courier.name}
                  {courier.configured ? "" : " (API not configured)"}
                </option>
              ))}
            </select>
            {selectedCourier && !selectedCourier.configured && (
              <p className="mt-2 text-xs text-primary">
                {selectedCourier.name} API credentials missing in `.env`
              </p>
            )}
            {selectedCourier?.id === "steadfast" && selectedCourier.balanceWarning && (
              <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {selectedCourier.balanceWarning}
              </p>
            )}
            {selectedCourier?.id === "steadfast" &&
              selectedCourier.balance !== null &&
              selectedCourier.balance !== undefined &&
              !selectedCourier.balanceWarning && (
                <p className="mt-2 text-xs text-slate-500">
                  Steadfast balance:{" "}
                  <span lang="en" className="font-medium text-slate-700">
                    {selectedCourier.balance} BDT
                  </span>
                </p>
              )}
            {isSent && shipment?.status === "in_review" && (
              <p className="mt-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
                This parcel is waiting for approval in the Steadfast merchant panel.
                Open{" "}
                <a
                  href="https://portal.packzy.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  portal.packzy.com
                </a>{" "}
                and approve the consignment to start delivery.
              </p>
            )}
          </div>

          <div className="rounded-md border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">
                Courier Integration
              </p>
              {isSent ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-600/10">
                  Sent
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  Not Sent
                </span>
              )}
            </div>

            {isSent && shipment ? (
              <div className="mt-4 space-y-3 text-sm">
                {order.courierName && (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Courier</span>
                    <span className="font-medium text-slate-900">
                      {order.courierName}
                    </span>
                  </div>
                )}
                {courierOrderId && (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Courier Order ID</span>
                    <span
                      lang="en"
                      className="break-all text-right font-medium text-slate-900"
                    >
                      {courierOrderId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Tracking ID</span>
                  <span
                    lang="en"
                    className="break-all text-right font-medium text-slate-900"
                  >
                    {shipment.trackingId}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Courier Status</span>
                  <span className="font-medium text-slate-800">
                    {shipment.statusLabel}
                  </span>
                </div>
                {order.riderNote && (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Rider Note</span>
                    <span className="font-medium text-slate-900 text-right">
                      {order.riderNote}
                    </span>
                  </div>
                )}
                {shipment.lastTrackedAt && (
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Last Tracked</span>
                    <span lang="en" className="text-slate-700">
                      {new Date(shipment.lastTrackedAt).toLocaleString("en-US")}
                    </span>
                  </div>
                )}
                {shipment.trackingUrl && (
                  <a
                    href={shipment.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-secondary"
                  >
                    Open courier tracking
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <div>
                <p className="mt-3 text-sm text-slate-500">
                  Select a courier and click Send — assignment saves automatically.
                </p>
                <div className="mt-4">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    RIDER NOTE (COURIER INSTRUCTION)
                  </label>
                  <textarea
                    value={riderNote}
                    onChange={(e) => setRiderNote(e.target.value)}
                    placeholder="যেমন: কল দিয়ে পাঠাবেন, ডেলিভারি না নিলে ফেরত দিন..."
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    rows={2}
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {!isSent && (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={
                    sendToCourier.isPending ||
                    updateOrder.isPending ||
                    !courierId ||
                    !selectedCourier?.configured
                  }
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {sendToCourier.isPending || updateOrder.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send to Courier
                </button>
              )}
              {isSent && (
                <button
                  type="button"
                  onClick={handleTrack}
                  disabled={trackCourier.isPending}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  {trackCourier.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Track Shipment
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col gap-2 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleCheckCourier}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <History className="h-4 w-4" />
            Check Courier
          </button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={updateOrder.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-secondary disabled:opacity-60"
            >
              {updateOrder.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <CourierHistoryModal
      phone={order.phone}
      customerName={order.fullName}
      open={courierHistoryOpen}
      onClose={() => setCourierHistoryOpen(false)}
    />
    </>
  );
}
