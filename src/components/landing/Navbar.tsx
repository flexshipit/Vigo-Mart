"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

const NAV_LINKS = [
  { label: "প্রোডাক্ট", href: "#products" },
  { label: "উপকারিতা", href: "#benefits" },
  { label: "সেবনবিধি", href: "#dosage" },
  { label: "কিভাবে কাজ করে", href: "#how-it-works" },
  { label: "রিভিউ", href: "#reviews" },
  { label: "নীতিমালা", href: "#policy" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 left-0 right-0 z-[100] w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
      <nav className="section-container flex h-14 items-center justify-between gap-3 sm:h-16">
        <a href="#" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-white sm:h-9 sm:w-9">
            <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <BrandLogo />
        </a>

        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#order"
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary sm:inline-flex sm:px-5 sm:py-2.5"
          >
            অর্ডার করুন
          </a>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="মেনু খুলুন"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-14 z-40 bg-slate-900/20 backdrop-blur-[2px] sm:top-16 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 top-14 z-50 border-b border-slate-200 bg-white shadow-lg sm:top-16 lg:hidden"
            >
              <ul className="section-container flex flex-col gap-1 py-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary/5 hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="mt-2 border-t border-slate-100 pt-2">
                  <a
                    href="#order"
                    onClick={() => setOpen(false)}
                    className="block rounded-md bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    অর্ডার করুন
                  </a>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
