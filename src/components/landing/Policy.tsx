"use client";

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Shield } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  DELIVERY_CHARGE,
  SATISFACTION_GUARANTEE,
  getProductPricingSummary,
} from "@/lib/products";

const POLICIES = [
  {
    icon: Shield,
    title: "ডেলিভারি নীতি",
    items: [
      "সম্পূর্ণ ক্যাশ অন ডেলিভারিতে অর্ডার",
      `ডেলিভারি চার্জ: ${DELIVERY_CHARGE}৳ (সারা বাংলাদেশ)`,
      "2–4 দিনের মধ্যে হোম ডেলিভারি",
      "সিল করা জার/প্যাকেজিং সহ ডেলিভারি",
    ],
  },
  {
    icon: RefreshCw,
    title: "রিটার্ন ও রিফান্ড",
    items: [
      "100% সন্তুষ্টি অথবা সম্পূর্ণ টাকা ফেরত গ্যারান্টি",
      SATISFACTION_GUARANTEE,
      "রিফান্ড: বিকাশ / নগদ / রকেট / ব্যাংক একাউন্টে",
    ],
  },
  {
    icon: AlertCircle,
    title: "গুরুত্বপূর্ণ তথ্য",
    items: [
      "অর্ডার করার আগে নীতিমালা সম্পূর্ণ পড়ুন",
      "সঠিক তথ্য দিয়ে অর্ডার করুন",
      getProductPricingSummary(),
      "জেনে ও বুঝে অর্ডার করুন",
    ],
  },
];

export default function Policy() {
  return (
    <section id="policy" className="bg-slate-50 section-padding">
      <div className="section-container">
        <SectionHeader
          badge="নীতিমালা"
          title="নীতিমালা ও শর্তাবলী"
          description="অর্ডার করার আগে অনুগ্রহ করে পড়ুন"
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {POLICIES.map((policy, i) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.08 }}
              className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="accent-icon-box h-10 w-10">
                <policy.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900 sm:text-lg">
                {policy.title}
              </h3>
              <ul className="mt-3 space-y-2 sm:mt-4">
                {policy.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-slate-600"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
