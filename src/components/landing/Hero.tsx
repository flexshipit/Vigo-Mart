"use client";

import { motion } from "framer-motion";
import { ArrowRight, Package, ShieldCheck, Truck } from "lucide-react";
import HeroSlider from "@/components/landing/HeroSlider";
import { DELIVERY_CHARGE, PRODUCTS, getProductPricingSummary, PRODUCT_DESCRIPTION, PRODUCT_NAME, PRODUCT_NAME_BN, PRODUCT_TAGLINE } from "@/lib/products";

const lowestPrice = Math.min(...PRODUCTS.map((product) => product.price));

const STATS = [
  { icon: Package, label: "8–20 পিস", sub: "প্যাকেজ অপশন" },
  { icon: Truck, label: "2–4 দিন", sub: "হোম ডেলিভারি" },
  { icon: ShieldCheck, label: "ক্যাশ অন", sub: "ডেলিভারিতে পেমেন্ট" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pb-0 pt-10 sm:pt-14 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 hero-shape-bg bg-gradient-to-br from-primary/20 via-primary/8 to-background" />

      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 hero-blob bg-secondary/15 blur-2xl sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-16 bottom-32 h-56 w-56 rounded-full border-[18px] border-primary/10 sm:h-72 sm:w-72 sm:border-[24px]" />
      <div className="pointer-events-none absolute right-[8%] top-[18%] hidden h-20 w-20 rotate-12 rounded-2xl border-2 border-primary/20 bg-primary/5 lg:block" />
      <div className="pointer-events-none absolute left-[42%] top-[12%] hidden h-14 w-14 -rotate-6 rounded-full bg-secondary/15 lg:block" />

      <div className="section-container relative pb-14 sm:pb-16 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="order-2 lg:order-1"
          >
            <div className="hero-content-panel text-center lg:text-left">
              <span className="accent-badge">
                <span lang="en">{lowestPrice}</span>৳ থেকে শুরু —{" "}
                {getProductPricingSummary()}
              </span>

              <h1 className="mt-4 text-[1.65rem] font-bold leading-tight text-dark sm:mt-5 sm:text-4xl lg:text-[2.65rem] xl:text-5xl">
                <span lang="en">{PRODUCT_NAME}</span>
                <span className="block text-primary sm:mt-1 lg:inline lg:before:content-['_—_']">
                  {PRODUCT_NAME_BN}
                </span>
              </h1>

              <p className="mx-auto mt-2 text-sm font-medium text-primary sm:text-base lg:mx-0">
                {PRODUCT_TAGLINE}
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-base lg:mx-0 lg:text-lg">
                {PRODUCT_DESCRIPTION} সম্পূর্ণ ক্যাশ অন ডেলিভারি,
                সারা বাংলাদেশে হোম ডেলিভারি মাত্র{" "}
                <span lang="en">{DELIVERY_CHARGE}</span>৳।
              </p>

              <div className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3 sm:mt-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:gap-4">
                <a
                  href="#order"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-secondary lg:w-auto lg:min-w-[210px]"
                >
                  এখনই অর্ডার করুন
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </a>
                <a
                  href="#benefits"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full border-2 border-primary/25 bg-white px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 lg:w-auto lg:min-w-[210px]"
                >
                  উপকারিতা দেখুন
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-lg"
          >
            <div className="relative">
              <div className="absolute -inset-3 hero-blob bg-gradient-to-br from-primary/25 to-secondary/20 sm:-inset-4" />

              <div className="hero-image-frame relative p-3 sm:p-4">
                <HeroSlider />

                <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
                  {STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-primary/10 bg-primary/5 p-2 text-center sm:p-3"
                    >
                      <stat.icon className="mx-auto h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" />
                      <p className="mt-1 text-[10px] font-semibold leading-tight text-slate-800 sm:text-xs">
                        {stat.label}
                      </p>
                      <p className="hidden text-[10px] text-slate-500 sm:block">
                        {stat.sub}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-4 -left-3 hidden rounded-2xl border border-white bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg sm:block">
                <span lang="en">100%</span> অরিজিনাল
              </div>
              <div className="absolute -right-2 -top-3 hidden rounded-full bg-secondary px-3 py-1.5 text-[11px] font-bold text-white shadow-md sm:block">
                COD ✓
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 w-full text-white">
        <svg
          viewBox="0 0 1440 80"
          fill="currentColor"
          className="block h-10 w-full sm:h-14 lg:h-16"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,48 C360,96 720,0 1080,48 C1260,72 1380,64 1440,56 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
