"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Leaf, Search } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { SITE } from "@/lib/site";

const floatingItems = [
  { emoji: "💊", x: "12%", y: "18%", delay: 0 },
  { emoji: "📦", x: "82%", y: "22%", delay: 0.4 },
  { emoji: "✨", x: "78%", y: "72%", delay: 0.8 },
  { emoji: "🌿", x: "15%", y: "75%", delay: 1.2 },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-primary/10 via-white to-slate-50 font-sans">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      {floatingItems.map((item) => (
        <motion.span
          key={item.emoji}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            y: [0, -12, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute text-2xl sm:text-3xl"
          style={{ left: item.x, top: item.y }}
        >
          {item.emoji}
        </motion.span>
      ))}

      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="section-container flex h-14 items-center sm:h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white sm:h-9 sm:w-9">
              <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <BrandLogo className="text-base font-bold text-slate-900 sm:text-lg" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="relative mx-auto mb-6 inline-block"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="flex h-28 w-28 items-center justify-center rounded-md border border-primary/20 bg-white text-6xl shadow-lg shadow-primary/10 sm:h-32 sm:w-32 sm:text-7xl"
            >
              💊
            </motion.div>
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -right-2 -top-2 rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-white sm:-right-3 sm:-top-3 sm:px-3 sm:text-xs"
            >
              LOST
            </motion.span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            lang="en"
            className="text-7xl font-bold tracking-tight text-primary sm:text-8xl"
          >
            404
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            পেজটি পাওয়া যায়নি
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base"
          >
            দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি নেই, সরানো হয়েছে, বা URL ভুল
            হয়েছে। হোমপেজে ফিরে যান।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-secondary"
            >
              <Home className="h-4 w-4" />
              হোমপেজে যান
            </Link>
            <Link
              href="/#order"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Search className="h-4 w-4" />
              অর্ডার করুন
            </Link>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            type="button"
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            আগের পেজে ফিরুন
          </motion.button>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white/80 py-4 text-center">
        <p className="text-xs text-slate-500 sm:text-sm">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </footer>
    </div>
  );
}
