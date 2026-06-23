"use client";

import { CalendarRange } from "lucide-react";
import type { ReactNode } from "react";
import {
  ORDER_DATE_PRESET_LABELS,
  ORDER_DATE_PRESETS,
  type OrderDatePreset,
} from "@/lib/admin/orderDateRange";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types/order";

export type OrderStatusFilter = "all" | OrderStatus;

type OrderFiltersProps = {
  status: OrderStatusFilter;
  datePreset: OrderDatePreset;
  customFrom: string;
  customTo: string;
  onStatusChange: (status: OrderStatusFilter) => void;
  onDatePresetChange: (preset: OrderDatePreset) => void;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
};

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function OrderFilters({
  status,
  datePreset,
  customFrom,
  customTo,
  onStatusChange,
  onDatePresetChange,
  onCustomFromChange,
  onCustomToChange,
}: OrderFiltersProps) {
  return (
    <div className="space-y-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Status
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <TabButton active={status === "all"} onClick={() => onStatusChange("all")}>
            All
          </TabButton>
          {ORDER_STATUSES.map((item) => (
            <TabButton
              key={item}
              active={status === item}
              onClick={() => onStatusChange(item)}
            >
              {ORDER_STATUS_LABELS[item]}
            </TabButton>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Date Range
        </p>
        <div className="flex flex-wrap gap-2">
          {ORDER_DATE_PRESETS.map((preset) => (
            <TabButton
              key={preset}
              active={datePreset === preset}
              onClick={() => onDatePresetChange(preset)}
            >
              {ORDER_DATE_PRESET_LABELS[preset]}
            </TabButton>
          ))}
        </div>

        {datePreset === "custom" && (
          <div className="mt-3 flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <CalendarRange className="h-3.5 w-3.5" />
                From
              </label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => onCustomFromChange(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                To
              </label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => onCustomToChange(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
