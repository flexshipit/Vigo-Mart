"use client";

import { useEffect, useMemo, useState } from "react";
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

type QuantityMap = Record<string, number>;

function buildInitialQuantities(): QuantityMap {
  const map: QuantityMap = {};
  for (const product of PRODUCTS) {
    map[product.packageId] = 0;
  }
  map[PRODUCTS[0].packageId] = 1;
  return map;
}

function OrderSummary({
  lines,
  total,
  compact = false,
}: {
  lines: Array<{ name: string; quantity: number; lineTotal: number }>;
  total: number;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-2 text-sm" : "space-y-3 text-sm"}>
      {lines.map((line) => (
        <div
          key={line.name}
          className="flex justify-between gap-3 text-slate-700"
        >
          <span className="min-w-0 flex-1 break-words">
            {line.name}
            {line.quantity > 1 ? (
              <span lang="en" className="text-slate-500">
                {" "}
                × {line.quantity}
              </span>
            ) : null}
          </span>
          <span lang="en" className="shrink-0 font-medium">
            {line.lineTotal}৳
          </span>
        </div>
      ))}
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
  const [quantities, setQuantities] = useState<QuantityMap>(buildInitialQuantities);
  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    const applyPackage = (packageId: string) => {
      if (!PRODUCTS.some((product) => product.packageId === packageId)) return;

      setQuantities((prev) => ({
        ...prev,
        [packageId]: Math.max(1, prev[packageId] ?? 0),
      }));
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

  const selectedLines = useMemo(
    () =>
      PRODUCTS.filter((product) => (quantities[product.packageId] ?? 0) > 0).map(
        (product) => {
          const quantity = quantities[product.packageId];
          return {
            packageId: product.packageId,
            name: product.name,
            image: product.image,
            quantity,
            lineTotal: product.price * quantity,
          };
        }
      ),
    [quantities]
  );

  const subtotal = selectedLines.reduce((sum, line) => sum + line.lineTotal, 0);
  const total = subtotal + DELIVERY_CHARGE;
  const previewImage =
    selectedLines[0]?.image ?? PRODUCTS[0].image;
  const previewName =
    selectedLines[0]?.name ?? PRODUCTS[0].name;

  const setQuantity = (packageId: string, next: number) => {
    setQuantities((prev) => ({
      ...prev,
      [packageId]: Math.max(0, Math.min(MAX_ORDER_QUANTITY, next)),
    }));
  };

  const onSubmit = (data: FormData) => {
    if (selectedLines.length === 0) {
      toast.error("কমপক্ষে একটি পণ্য সিলেক্ট করুন");
      return;
    }

    const eventId = createMetaEventId();
    const { fbp, fbc } = getMetaCookies();

    createOrderMutation.mutate(
      {
        items: selectedLines.map((line) => ({
          packageId: line.packageId,
          quantity: line.quantity,
        })),
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
            contentIds: selectedLines.map((line) => line.packageId),
            contentName: selectedLines
              .map((line) =>
                line.quantity > 1
                  ? `${line.name} × ${line.quantity}`
                  : line.name
              )
              .join(", "),
          });
          reset();
          setQuantities(buildInitialQuantities());
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
            একাধিক পণ্য বেছে নিন, সঠিক তথ্য দিন — ক্যাশ অন ডেলিভারিতে পাবেন
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-md border border-primary/20 lg:hidden">
          <div className="relative aspect-[16/9] w-full bg-maroon">
            <Image
              src={previewImage}
              alt={`${previewName} অর্ডার`}
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
          {selectedLines.length === 0 ? (
            <p className="text-sm text-slate-500">কোনো পণ্য সিলেক্ট করা হয়নি</p>
          ) : (
            <OrderSummary
              lines={selectedLines}
              total={total}
              compact
            />
          )}
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
                {PRODUCTS.map((product) => {
                  const quantity = quantities[product.packageId] ?? 0;
                  const selected = quantity > 0;

                  return (
                    <div
                      key={product.packageId}
                      className={`flex items-center gap-3 rounded-md border p-3 transition-colors sm:p-4 ${
                        selected
                          ? "border-primary/40 bg-primary/5"
                          : "border-slate-200"
                      }`}
                    >
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
                      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(product.packageId, quantity - 1)
                          }
                          disabled={quantity <= 0}
                          aria-label={`${product.name} পরিমাণ কমান`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span
                          lang="en"
                          className="min-w-7 text-center text-sm font-semibold text-slate-900 sm:min-w-8 sm:text-base"
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity(product.packageId, quantity + 1)
                          }
                          disabled={quantity >= MAX_ORDER_QUANTITY}
                          aria-label={`${product.name} পরিমাণ বাড়ান`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition-colors hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                  src={previewImage}
                  alt={`${previewName} অর্ডার`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 320px"
                  className="object-cover"
                />
              </div>

              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                আপনার অর্ডার
              </h3>

              <div className="mt-4 hidden border-b border-slate-200 pb-4 lg:block">
                {selectedLines.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    কমপক্ষে একটি পণ্য সিলেক্ট করুন
                  </p>
                ) : (
                  <OrderSummary
                    lines={selectedLines}
                    total={total}
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={
                  createOrderMutation.isPending || selectedLines.length === 0
                }
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
