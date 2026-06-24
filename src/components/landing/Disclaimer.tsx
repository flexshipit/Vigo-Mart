"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { PRODUCT_DISCLAIMERS } from "@/lib/products";

export default function Disclaimer() {
  return (
    <section id="disclaimer" className="bg-white py-6 sm:py-10">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-xl rounded-md border-2 border-amber-300/80 bg-amber-50/60 p-4 sm:p-5"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
            </span>
            <h2 className="text-center text-lg font-bold text-dark sm:text-xl">
              সতর্কতা / ডিসক্লেইমার
            </h2>
          </div>

          <div className="mt-4 space-y-3 sm:mt-5">
            {PRODUCT_DISCLAIMERS.map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="text-sm leading-relaxed text-slate-700 sm:text-[15px]"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
