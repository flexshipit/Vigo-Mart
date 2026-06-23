"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { REVIEWS } from "@/lib/products";

export default function Reviews() {
  return (
    <section id="reviews" className="bg-white section-padding">
      <div className="section-container">
        <SectionHeader
          badge="রিভিউ"
          title="কাস্টমার রিভিউ"
          description="হাজারো সন্তুষ্ট গ্রাহকের কথা"
        />

        <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:mt-12 lg:grid-cols-3 lg:gap-5">
          {REVIEWS.map((review, i) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.06 }}
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-3.5 w-3.5 fill-primary text-primary sm:h-4 sm:w-4"
                  />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900 sm:mt-4">
                — {review.name}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
