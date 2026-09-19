"use client";

import { motion } from "framer-motion";

type SectionHeaderProps = {
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export default function SectionHeader({
  badge,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className={`max-w-3xl ${alignClass}`}
    >
      {badge && (
        <span className="mb-3 inline-block rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {badge}
        </span>
      )}
      <h2 className="text-2xl font-bold leading-snug text-dark sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base lg:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
