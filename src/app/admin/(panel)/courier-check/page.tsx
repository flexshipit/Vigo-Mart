"use client";

import { FormEvent, useState } from "react";
import { Loader2, Search, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import BdCourierCheckResultView from "@/components/admin/BdCourierCheckResultView";
import { useBdCourierCheck } from "@/hooks/useAdmin";
import { getAdminPageMeta } from "@/lib/admin/navigation";
import { normalizeBdCourierPhoneClient } from "@/lib/bdCourierPhone";
import type { BdCourierCheckResult } from "@/types/bdCourier";

export default function AdminCourierCheckPage() {
  const meta = getAdminPageMeta("/admin/courier-check");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<BdCourierCheckResult | null>(null);
  const checkMutation = useBdCourierCheck();

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalized = normalizeBdCourierPhoneClient(phone);
    if (!normalized) {
      toast.error("Please enter a valid 11-digit Bangladesh phone number.");
      return;
    }

    checkMutation.mutate(normalized, {
      onSuccess: (data) => {
        setResult(data);
      },
      onError: (error) => {
        setResult(null);
        toast.error(
          error.message ||
            "Unable to check courier information. Please try again."
        );
      },
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={meta.title}
        subtitle={meta.subtitle}
        breadcrumb={meta.breadcrumb}
      />

      <form
        onSubmit={onSubmit}
        className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Customer Phone Number
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Check delivery history, success rate, and AI risk verdict via BD
              Courier.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="01XXXXXXXXX"
            lang="en"
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={checkMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:opacity-60 sm:min-w-44"
          >
            {checkMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Check Customer
              </>
            )}
          </button>
        </div>

        {checkMutation.isPending ? (
          <p className="mt-4 text-sm text-slate-500">
            Checking customer history...
          </p>
        ) : null}
      </form>

      {result ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <BdCourierCheckResultView result={result} />
        </div>
      ) : null}
    </div>
  );
}
