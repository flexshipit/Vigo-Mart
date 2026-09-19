"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CirclePlay, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCreateOrder } from "@/hooks/useOrders";
import {
  createMetaEventId,
  getMetaCookies,
  trackBrowserPurchase,
} from "@/lib/meta/client";
import { DELIVERY_CHARGE, MAX_ORDER_QUANTITY, PRODUCTS } from "@/lib/products";
import { SELECT_PACKAGE_EVENT } from "@/lib/selectPackage";
import { toBengaliDigits } from "@/lib/numerals";

type FormData = {
  fullName: string;
  district: string;
  address: string;
  phone: string;
};

function OrderSummary({
  selectedName,
  quantity,
  subtotal,
  total,
  compact = false,
}: {
  selectedName: string;
  quantity: number;
  subtotal: number;
  total: number;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-2 text-sm" : "space-y-3 text-sm"}>
      <div className="flex justify-between gap-3 text-slate-700">
        <span className="min-w-0 flex-1 break-words">
          {selectedName}
          {quantity > 1 ? (
            <span lang="en" className="text-slate-500">
              {" "}
              × {quantity}
            </span>
          ) : null}
        </span>
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
  const [quantity, setQuantity] = useState(1);
  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const applyPackage = (packageId: string) => {
      if (PRODUCTS.some((product) => product.packageId === packageId)) {
        setSelectedPackageId(packageId);
      }
    };

    const onSelect = (event: Event) => {
      applyPackage((event as CustomEvent<string>).detail);
    };

    window.addEventListener(SELECT_PACKAGE_EVENT, onSelect);

    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("package");
    if (fromQuery) applyPackage(fromQuery);

    return () => window.removeEventListener(SELECT_PACKAGE_EVENT, onSelect);
  }, []);

  const selected = PRODUCTS.find((p) => p.packageId === selectedPackageId)!;
  const subtotal = selected.price * quantity;
  const total = subtotal + DELIVERY_CHARGE;

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(MAX_ORDER_QUANTITY, prev + 1));
  };

  const onSubmit = (data: FormData) => {
    const eventId = createMetaEventId();
    const { fbp, fbc } = getMetaCookies();

    createOrderMutation.mutate(
      {
        packageId: selected.packageId,
        quantity,
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
          setQuantity(1);
          router.push(`/thank-you/${result.orderId}`);
        },
        onError: (error) => {
          toast.error(error.message || "অর্ডার তৈরি হয়নি");
        },
      }
    );
  };

  return (
    <section id="order" className="bg-cream section-padding">
      <div className="section-container">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
            অর্ডার করুন
          </h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base lg:text-lg">
            পণ্য বেছে নিন, সঠিক তথ্য দিন — ক্যাশ অন ডেলিভারিতে পাবেন
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-md border border-primary/20 lg:hidden">
          <div className="relative aspect-[16/9] w-full bg-maroon">
            <Image
              src={selected.image}
              alt={`${selected.name} অর্ডার`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-5xl rounded-md border border-primary/20 bg-white p-4 lg:hidden">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
            অর্ডার সামারি
          </p>
          <OrderSummary
            selectedName={selected.name}
            quantity={quantity}
            subtotal={subtotal}
            total={total}
            compact
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mt-6 grid max-w-6xl gap-5 sm:mt-8 sm:gap-6 lg:mt-10 lg:grid-cols-5 lg:gap-8"
        >
          <div className="space-y-5 sm:space-y-6 lg:col-span-3">
            <div className="rounded-md border border-primary/15 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 sm:text-lg lg:text-xl">
                <ShoppingBag className="h-5 w-5 shrink-0 text-primary" />
                পণ্য সিলেক্ট করুন
              </h3>

              <div className="space-y-3">
                {PRODUCTS.map((product) => (
                  <label
                    key={product.packageId}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors sm:p-4 ${
                      selectedPackageId === product.packageId
                        ? "border-primary/40 bg-primary/5"
                        : "border-slate-200 hover:border-primary/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="packageId"
                      value={product.packageId}
                      checked={selectedPackageId === product.packageId}
                      onChange={() => setSelectedPackageId(product.packageId)}
                      className="accent-primary"
                    />
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-primary/15 bg-cream">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug text-slate-900 lg:text-base">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 lg:text-sm">
                        {toBengaliDigits(product.price)} টাকা
                      </p>
                    </div>
                    <span
                      lang="en"
                      className="shrink-0 text-sm font-bold text-primary"
                    >
                      {product.price}৳
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-700">
                  পরিমাণ
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="পরিমাণ কমান"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    lang="en"
                    className="min-w-8 text-center text-base font-semibold text-slate-900"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= MAX_ORDER_QUANTITY}
                    aria-label="পরিমাণ বাড়ান"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-primary/15 bg-white p-4 shadow-sm sm:p-6">
              <h3 className="mb-4 text-base font-semibold text-slate-900 sm:text-lg lg:text-xl">
                ডেলিভারি তথ্য
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm text-slate-600">
                    সম্পূর্ণ নাম *
                  </label>
                  <input
                    {...register("fullName", { required: "নাম আবশ্যক" })}
                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 lg:text-base"
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
                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 lg:text-base"
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
                    className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 lg:text-base"
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
                    className="w-full resize-none rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 lg:text-base"
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
            <div className="rounded-md border border-primary/15 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-20">
              <div className="relative mb-4 hidden aspect-[4/3] overflow-hidden rounded-md bg-maroon lg:block">
                <Image
                  src={selected.image}
                  alt={`${selected.name} অর্ডার`}
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
                  quantity={quantity}
                  subtotal={subtotal}
                  total={total}
                />
              </div>

              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60 sm:mt-6"
              >
                {createOrderMutation.isPending ? (
                  "অর্ডার প্রসেস হচ্ছে..."
                ) : (
                  <>
                    অর্ডার কনফার্ম করুন — {total}৳
                    <CirclePlay className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-3 text-center text-xs text-slate-500">
                ক্যাশ অন ডেলিভারি · সারা বাংলাদেশ · {DELIVERY_CHARGE}৳ ডেলিভারি
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
