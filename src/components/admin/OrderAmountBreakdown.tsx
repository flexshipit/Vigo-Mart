import { resolveOrderPricing } from "@/lib/orderPricing";

type OrderAmountBreakdownProps = {
  subtotal?: number;
  deliveryCharge?: number;
  total: number;
  compact?: boolean;
};

export default function OrderAmountBreakdown({
  subtotal,
  deliveryCharge,
  total,
  compact = false,
}: OrderAmountBreakdownProps) {
  const pricing = resolveOrderPricing({ subtotal, deliveryCharge, total });

  if (compact) {
    return (
      <div lang="en">
        <p className="font-semibold text-primary">{pricing.total}৳</p>
        <p className="mt-0.5 text-[11px] text-slate-500">
          {pricing.subtotal}৳ + {pricing.deliveryCharge}৳ delivery
        </p>
      </div>
    );
  }

  return (
    <div lang="en" className="space-y-1 text-sm">
      <div className="flex justify-between gap-3 text-slate-600">
        <span>Subtotal</span>
        <span>{pricing.subtotal}৳</span>
      </div>
      <div className="flex justify-between gap-3 text-slate-600">
        <span>Delivery</span>
        <span>{pricing.deliveryCharge}৳</span>
      </div>
      <div className="flex justify-between gap-3 border-t border-slate-200 pt-2 font-semibold text-primary">
        <span>Total</span>
        <span>{pricing.total}৳</span>
      </div>
    </div>
  );
}
