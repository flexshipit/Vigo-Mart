import type { OrderStatus } from "@/types/order";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  isOrderStatus,
} from "@/lib/orderStatus";

type OrderStatusBadgeProps = {
  status?: string;
};

export default function OrderStatusBadge({
  status = "confirmed",
}: OrderStatusBadgeProps) {
  const normalized = isOrderStatus(status) ? status : "confirmed";
  const styles = ORDER_STATUS_STYLES[normalized];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${styles.bg} ${styles.text} ${styles.ring}`}
    >
      {ORDER_STATUS_LABELS[normalized]}
    </span>
  );
}

export function getOrderStatusLabel(status: OrderStatus) {
  return ORDER_STATUS_LABELS[status];
}
