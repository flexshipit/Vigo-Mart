"use client";

import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { DOSAGE_GUIDELINES } from "@/lib/products";

export default function DosageGuide() {
  return (
    <section id="dosage" className="bg-slate-50 py-6 sm:py-10">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.4 }}
          className="landing-card mx-auto max-w-xl"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Cookie className="h-4 w-4" />
            </span>
            <h2 className="text-center text-lg font-bold text-dark sm:text-xl">
              সাধারণ সেবনবিধি
            </h2>
          </div>

          <ul className="mt-4 divide-y divide-slate-200 sm:mt-5">
            {DOSAGE_GUIDELINES.map((item, i) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="py-3.5 first:pt-0 last:pb-0 sm:py-4"
              >
                <p className="text-sm leading-relaxed text-slate-800 sm:text-[15px]">
                  <span className="font-semibold text-primary">{item.label}:</span>{" "}
                  {item.text}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
