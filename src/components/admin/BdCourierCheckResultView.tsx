"use client";

import Image from "next/image";
import type { BdCourierCheckResult } from "@/types/bdCourier";

function riskTone(color?: string, level?: string) {
  const key = (color || level || "").toLowerCase();

  if (key.includes("green") || key === "safe" || key === "low") {
    return {
      panel: "border-emerald-200 bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-800",
      text: "text-emerald-800",
    };
  }

  if (key.includes("yellow") || key.includes("orange") || key === "medium") {
    return {
      panel: "border-amber-200 bg-amber-50",
      badge: "bg-amber-100 text-amber-900",
      text: "text-amber-900",
    };
  }

  if (
    key.includes("red") ||
    key === "high" ||
    key === "danger" ||
    key.includes("high_risk")
  ) {
    return {
      panel: "border-red-200 bg-red-50",
      badge: "bg-red-100 text-red-800",
      text: "text-red-800",
    };
  }

  return {
    panel: "border-slate-200 bg-slate-50",
    badge: "bg-slate-100 text-slate-800",
    text: "text-slate-800",
  };
}

type BdCourierCheckResultProps = {
  result: BdCourierCheckResult;
};

export default function BdCourierCheckResultView({
  result,
}: BdCourierCheckResultProps) {
  const verdict = result.risk_verdict;
  const tone = riskTone(verdict?.color, verdict?.level || result.risk_level);
  const summary = result.summary;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Phone Number</p>
          <p lang="en" className="mt-1 text-lg font-bold text-slate-900">
            {result.phone}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total Parcels</p>
          <p lang="en" className="mt-1 text-lg font-bold text-slate-900">
            {summary?.total_parcel ?? 0}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Successful</p>
          <p lang="en" className="mt-1 text-lg font-bold text-emerald-600">
            {summary?.success_parcel ?? 0}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Cancelled</p>
          <p lang="en" className="mt-1 text-lg font-bold text-red-500">
            {summary?.cancelled_parcel ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Overall Success Rate
          </p>
          <p lang="en" className="mt-2 text-3xl font-bold text-primary">
            {result.success_ratio}%
          </p>
        </div>

        <div className={`rounded-md border p-4 ${tone.panel}`}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
              Risk Level
            </p>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${tone.badge}`}
            >
              {verdict?.label || result.risk_level}
            </span>
          </div>
          <p className={`mt-3 text-lg font-semibold ${tone.text}`}>
            {verdict?.action || "Review before shipping"}
          </p>
          {verdict?.reasons?.length ? (
            <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
              {verdict.reasons.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-900">
          Courier History
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {result.couriers.map((courier) => (
            <div
              key={courier.key}
              className="rounded-md border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                {courier.logo ? (
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-slate-50">
                    <Image
                      src={courier.logo}
                      alt={courier.name || courier.key}
                      fill
                      sizes="40px"
                      className="object-contain p-1"
                    />
                  </span>
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {courier.name || courier.key}
                  </p>
                  <p lang="en" className="text-xs text-slate-500">
                    {courier.success_ratio}% success
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-slate-50 p-2">
                  <p className="text-[11px] text-slate-500">Total</p>
                  <p lang="en" className="mt-1 text-sm font-bold text-slate-900">
                    {courier.total_parcel}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 p-2">
                  <p className="text-[11px] text-slate-500">Success</p>
                  <p
                    lang="en"
                    className="mt-1 text-sm font-bold text-emerald-600"
                  >
                    {courier.success_parcel}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 p-2">
                  <p className="text-[11px] text-slate-500">Cancel</p>
                  <p lang="en" className="mt-1 text-sm font-bold text-red-500">
                    {courier.cancelled_parcel}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {result.reports.length > 0 ? (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            Fraud Reports ({result.reports.length})
          </h3>
          <div className="space-y-2">
            {result.reports.slice(0, 12).map((report) => (
              <div
                key={String(report.id)}
                className="rounded-md border border-slate-200 bg-white p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-slate-900">
                    {report.name || "Report"}
                  </p>
                  {report.courierName ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {report.courierName}
                    </span>
                  ) : null}
                  {report.created_at ? (
                    <span lang="en" className="text-[11px] text-slate-400">
                      {new Date(report.created_at).toLocaleDateString("en-US")}
                    </span>
                  ) : null}
                </div>
                {report.details ? (
                  <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                    {report.details}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
