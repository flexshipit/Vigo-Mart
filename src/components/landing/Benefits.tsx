"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check } from "lucide-react";
import { BENEFITS, SATISFACTION_GUARANTEE } from "@/lib/products";
import { SITE } from "@/lib/site";
import { SITE_IMAGES } from "@/lib/images";

export default function Benefits() {
  return (
    <section id="benefits" className="bg-white py-6 sm:py-10">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.4 }}
          className="landing-card mx-auto max-w-xl"
        >
          <a href="#order" className="landing-cta">
            অর্ডার করতে ক্লিক করুন
          </a>

          <h2 className="mt-5 text-center text-lg font-bold text-dark sm:mt-6 sm:text-xl">
            উপকারিতা
          </h2>

          <ul className="mt-4 divide-y divide-slate-200 sm:mt-5">
            {BENEFITS.map((benefit, i) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0 sm:gap-3.5 sm:py-4"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <p className="text-sm leading-relaxed text-slate-800 sm:text-[15px]">
                  {benefit}
                </p>
              </motion.li>
            ))}
          </ul>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6">
            {SITE_IMAGES.heroSlides.map((src, index) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-white"
              >
                <Image
                  src={src}
                  alt={`${SITE.name} ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="landing-card mx-auto mt-4 max-w-xl sm:mt-5"
        >
          <h3 className="text-base font-bold leading-snug text-dark sm:text-lg">
            3. শতভাগ সন্তুষ্টি অথবা সম্পূর্ণ টাকা ফেরত! 💰
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
            {SATISFACTION_GUARANTEE}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
