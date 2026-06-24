"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useCreateOrder } from "@/hooks/useOrders";
import { SITE_IMAGES } from "@/lib/images";
import {
  createMetaEventId,
  getMetaCookies,
  trackBrowserPurchase,
} from "@/lib/meta/client";
import { DELIVERY_CHARGE, PRODUCTS } from "@/lib/products";

type FormData = {
  fullName: string;
  district: string;
  address: string;
  phone: string;
};

function OrderSummary({
  selectedName,
  subtotal,
  total,
  compact = false,
}: {
  selectedName: string;
  subtotal: number;
  total: number;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-2 text-sm" : "space-y-3 text-sm"}>
      <div className="flex justify-between gap-3 text-slate-700">
        <span className="min-w-0 flex-1 break-words">{selectedName}</span>
        <span lang="en" className="shrink-0 font-medium">
          {subtotal}৳
        </span>
      </div>
      <div className="flex justify-between text-slate-500">
        <span>ডেলিভারি চার্জ</span>
        <span lang="en">{DELIVERY_CHARGE}৳</span>
      </div>
      <div
        className={`flex justify-between font-bold text-slate-900 ${compact ? "border-t border-slate-200 pt-2" : "text-base"}`}
      >
        <span>মোট</span>
        <span lang="en" className="text-primary">
          {total}৳
        </span>
      </div>
    </div>
  );
}

export default function OrderForm() {
  const router = useRouter();
  const [selectedPackageId, setSelectedPackageId] = useState(PRODUCTS[0].packageId);
  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const selected = PRODUCTS.find((p) => p.packageId === selectedPackageId)!;
  const subtotal = selected.price;
  const total = subtotal + DELIVERY_CHARGE;

  const onSubmit = (data: FormData) => {
    const eventId = createMetaEventId();
    const { fbp, fbc } = getMetaCookies();

    createOrderMutation.mutate(
      {
        packageId: selected.packageId,
        fullName: data.fullName,
        district: data.district,
        address: data.address,
        phone: data.phone,
        eventId,
        fbp,
        fbc,
        eventSourceUrl:
          typeof window !== "undefined" ? window.location.href : undefined,
      },
      {
        onSuccess: (result) => {
          trackBrowserPurchase({
            eventId,
            value: total,
            contentIds: [selected.packageId],
            contentName: selected.name,
          });
          reset();
          router.push(`/thank-you/${result.orderId}`);
        },
        onError: (error) => {
          toast.error(error.message || "অর্ডার তৈরি হয়নি");
        },
      }
    );
  };

  return (
    <section id="order" className="bg-slate-50 section-padding">
      <div className="section-container">
        <SectionHeader
          badge="অর্ডার"
          title="অর্ডার করুন"
          description="সঠিক তথ্য দিয়ে ফর্ম পূরণ করুন — অর্ডার কনফার্ম হলে Thank You পেজে যাবেন এবং ফোনে SMS পাবেন"
        />

        <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-md border border-slate-200 lg:hidden">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={SITE_IMAGES.orderBanner}
              alt="ভিগোরাপ ক্যাপসুল অর্ডার"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-5xl rounded-md border border-primary/20 bg-primary/5 p-4 lg:hidden">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            অর্ডার সামারি
          </p>
          <OrderSummary
            selectedName={selected.name}
            subtotal={subtotal}
            total={total}
            compact
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-6 grid max-w-5xl gap-5 sm:mt-8 sm:gap-6 lg:mt-10 lg:grid-cols-5 lg:gap-8"
        >
          <div className="space-y-5 sm:space-y-6 lg:col-span-3">
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 sm:text-lg">
                <ShoppingBag className="h-5 w-5 shrink-0 text-primary" />
                প্যাকেজ সিলেক্ট করুন
              </h3>

              <div className="space-y-3">
                {PRODUCTS.map((product) => (
                  <label
                    key={product.packageId}
                    className={`flex cursor-pointer flex-col gap-3 rounded-md border p-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:p-4 ${
                      selectedPackageId === product.packageId
                        ? "border-primary/30 bg-primary/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:items-center">
                      <input
                        type="radio"
                        name="packageId"
                        value={product.packageId}
                        checked={selectedPackageId === product.packageId}
                        onChange={() => setSelectedPackageId(product.packageId)}
                        className="mt-1 accent-primary sm:mt-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-snug text-slate-900">
                          <span lang="en">{product.packets}</span> পিস
                        </p>
                      </div>
                    </div>
                    <span
                      lang="en"
                      className="pl-7 text-sm font-bold text-primary sm:pl-0"
                    >
                      {product.price}৳
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-900 sm:text-lg">
                ডেলিভারি তথ্য
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm text-slate-600">
                    সম্পূর্ণ নাম *
                  </label>
                  <input
                    {...register("fullName", { required: "নাম আবশ্যক" })}
                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="আপনার পূর্ণ নাম"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-600">
                    জেলা ও থানা *
                  </label>
                  <input
                    {...register("district", {
                      required: "জেলা ও থানা আবশ্যক",
                    })}
                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="যেমন: ঢাকা, মিরপুর"
                  />
                  {errors.district && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.district.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-600">
                    11 ডিজিটের ফোন নম্বর *
                  </label>
                  <input
                    {...register("phone", {
                      required: "ফোন নম্বর আবশ্যক",
                      pattern: {
                        value: /^01[3-9]\d{8}$/,
                        message: "সঠিক 11 ডিজিটের নম্বর দিন",
                      },
                    })}
                    inputMode="numeric"
                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm text-slate-600">
                    ডেলিভারি ঠিকানা *
                  </label>
                  <textarea
                    {...register("address", { required: "ঠিকানা আবশ্যক" })}
                    rows={3}
                    className="w-full resize-none rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="বিস্তারিত ঠিকানা লিখুন"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-20">
              <div className="relative mb-4 hidden aspect-[4/3] overflow-hidden rounded-md lg:block">
                <Image
                  src={SITE_IMAGES.orderBanner}
                  alt="ভিগোরাপ ক্যাপসুল অর্ডার"
                  fill
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="object-cover"
                />
              </div>

              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                আপনার অর্ডার
              </h3>

              <div className="mt-4 hidden border-b border-slate-200 pb-4 lg:block">
                <OrderSummary
                  selectedName={selected.name}
                  subtotal={subtotal}
                  total={total}
                />
              </div>

              <p className="mt-4 rounded-md bg-primary/5 p-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                📱 অর্ডার কনফার্ম হলে আপনার ফোনে confirmation SMS পাঠানো হবে
              </p>

              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="mt-5 w-full rounded-md bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60 sm:mt-6"
              >
                {createOrderMutation.isPending
                  ? "অর্ডার প্রসেস হচ্ছে..."
                  : `অর্ডার কনফার্ম করুন — ${total}৳`}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                100% সন্তুষ্টি বা সম্পূর্ণ টাকা ফেরত গ্যারান্টি
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
