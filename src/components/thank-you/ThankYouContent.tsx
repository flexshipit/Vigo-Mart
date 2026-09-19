"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Home, MessageSquare, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { orderKeys, useOrderSummary, useSendOrderSms } from "@/hooks/useOrders";

type ThankYouContentProps = {
  orderId: string;
};

export default function ThankYouContent({ orderId }: ThankYouContentProps) {
  const queryClient = useQueryClient();
  const smsTriggered = useRef(false);
  const { data: order, isLoading, isError } = useOrderSummary(orderId);
  const sendSmsMutation = useSendOrderSms();

  useEffect(() => {
    if (!order || order.smsSent || smsTriggered.current) return;

    smsTriggered.current = true;
    sendSmsMutation.mutate(orderId, {
      onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
        if (!result.alreadySent) {
          toast.success(result.message, { duration: 5000 });
        }
      },
      onError: (error) => {
        toast.error(error.message || "SMS পাঠানো যায়নি");
      },
    });
  }, [order, orderId, queryClient, sendSmsMutation]);

  const shortOrderId = orderId.slice(-6).toUpperCase();
  const smsPending = sendSmsMutation.isPending;
  const smsFailed = sendSmsMutation.isError && !order?.smsSent;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500">অর্ডার লোড হচ্ছে...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-lg rounded-md border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-semibold text-red-700">অর্ডার পাওয়া যায়নি</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary"
        >
          <Home className="h-4 w-4" />
          হোমে ফিরুন
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-xl"
    >
      <div className="rounded-md border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">
            ধন্যবাদ! অর্ডার কনফার্ম হয়েছে
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {order.fullName}, আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। শীঘ্রই আমরা
            যোগাযোগ করব।
          </p>
        </div>

        <div className="mt-8 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">অর্ডার আইডি</span>
            <span lang="en" className="font-semibold text-slate-900">
              {shortOrderId}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">পণ্য</span>
            <span className="text-right font-medium text-slate-800">
              {order.packageName}
              {order.quantity > 1 ? (
                <span lang="en" className="text-slate-500">
                  {" "}
                  × {order.quantity}
                </span>
              ) : null}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">মোট বিল</span>
            <span lang="en" className="font-bold text-primary">
              {order.total}৳
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">ফোন</span>
            <span lang="en" className="font-medium text-slate-800">
              {order.phone}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-md border border-primary/20 bg-primary/5 p-4 text-sm text-dark">
          <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            {smsPending ? (
              <p>আপনার ফোনে confirmation SMS পাঠানো হচ্ছে...</p>
            ) : order.smsSent || sendSmsMutation.isSuccess ? (
              <p>আপনার ফোনে confirmation SMS পাঠানো হয়েছে।</p>
            ) : smsFailed ? (
              <p>SMS পাঠানো যায়নি। নিচের বাটনে ক্লিক করে আবার চেষ্টা করুন।</p>
            ) : (
              <p>অর্ডার কনফার্মেশন SMS শীঘ্রই পাঠানো হবে।</p>
            )}
          </div>
        </div>

        {smsFailed && (
          <button
            type="button"
            onClick={() =>
              sendSmsMutation.mutate(orderId, {
                onSuccess: (result) => {
                  queryClient.invalidateQueries({
                    queryKey: orderKeys.detail(orderId),
                  });
                  toast.success(result.message);
                },
                onError: (error) =>
                  toast.error(error.message || "SMS পাঠানো যায়নি"),
              })
            }
            disabled={sendSmsMutation.isPending}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-primary/30 bg-white px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${sendSmsMutation.isPending ? "animate-spin" : ""}`}
            />
            SMS আবার পাঠান
          </button>
        )}

        <Link
          href="/"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
        >
          <Home className="h-4 w-4" />
          হোমে ফিরুন
        </Link>
      </div>
    </motion.div>
  );
}
