"use client";

import { motion } from "framer-motion";
import { ClipboardList, Package, Truck } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { DELIVERY_CHARGE } from "@/lib/products";

const STEPS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "অর্ডার করুন",
    desc: "পছন্দের পণ্য সিলেক্ট করে অর্ডার ফর্ম পূরণ করুন।",
  },
  {
    icon: Truck,
    step: "02",
    title: "ডেলিভারি পান",
    desc: `2–4 দিনের মধ্যে সারা বাংলাদেশে হোম ডেলিভারি। ডেলিভারি চার্জ মাত্র ${DELIVERY_CHARGE}৳।`,
  },
  {
    icon: Package,
    step: "03",
    title: "খেয়ে দেখুন",
    desc: "ক্যাশ অন ডেলিভারিতে পেমেন্ট করুন এবং হোমমেড স্বাদ উপভোগ করুন!",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream section-padding">
      <div className="section-container">
        <SectionHeader
          badge="প্রক্রিয়া"
          title="কিভাবে কাজ করে"
          description="মাত্র 3টি সহজ ধাপে আপনার অর্ডার পেয়ে যান"
        />

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {STEPS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <span className="text-xs font-bold tracking-widest text-primary">
                {item.step}
              </span>
              <div className="accent-icon-box mt-3 h-11 w-11 sm:mt-4 sm:h-12 sm:w-12">
                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900 sm:mt-4 sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 lg:text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
