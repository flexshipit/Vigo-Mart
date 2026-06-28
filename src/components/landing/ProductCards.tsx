"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { DELIVERY_CHARGE, getProductPricingSummary, PRODUCT_NAME, PRODUCT_NAME_BN, PRODUCTS } from "@/lib/products";

const FEATURES = [
  `অরিজিনাল ${PRODUCT_NAME} (${PRODUCT_NAME_BN})`,
  "সারা বাংলাদেশে হোম ডেলিভারি",
  "100% সন্তুষ্টি বা টাকা ফেরত গ্যারান্টি",
];

export default function ProductCards() {
  return (
    <section id="products" className="bg-slate-50 section-padding">
      <div className="section-container">
        <SectionHeader
          badge="প্রোডাক্ট"
          title={`${PRODUCT_NAME_BN} — প্যাকেজ বেছে নিন`}
          description={`${getProductPricingSummary()} | ডেলিভারি ${DELIVERY_CHARGE}৳ (সারা বাংলাদেশ)`}
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {PRODUCTS.map((product, i) => (
            <motion.article
              key={product.packageId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative flex h-full flex-col rounded-md border-2 border-primary/30 bg-gradient-to-b from-primary/5 to-white p-5 shadow-sm ring-1 ring-primary/10 transition-shadow hover:shadow-md sm:p-6"
            >
              {product.badge && (
                <span className="absolute -top-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-md bg-primary px-3 py-1 text-[11px] font-bold text-white sm:text-xs">
                  <Sparkles className="h-3 w-3" />
                  {product.badge}
                </span>
              )}

              <div className="accent-icon-box mb-4 h-12 w-12 text-xl sm:h-14 sm:w-14 sm:text-2xl">
                🍫
              </div>

              <h3 className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                <span lang="en">{product.packets}</span> পিস
              </h3>

              <div className="mt-3 flex items-baseline gap-1 sm:mt-4">
                <span lang="en" className="text-2xl font-bold text-primary sm:text-3xl">
                  {product.price}
                </span>
                <span className="text-sm text-slate-500">৳</span>
              </div>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                + ডেলিভারি <span lang="en">{DELIVERY_CHARGE}</span>৳ | মোট{" "}
                <span lang="en">{product.price + DELIVERY_CHARGE}</span>৳
              </p>

              <ul className="mt-4 flex-1 space-y-2 sm:mt-5">
                {FEATURES.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-slate-600 sm:text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#order"
                className="mt-5 block rounded-md bg-primary py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-secondary sm:mt-6"
              >
                অর্ডার করুন
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
