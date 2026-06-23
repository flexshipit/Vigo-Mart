import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 sm:py-10">
      <div className="section-container">
        <div className="flex flex-col items-center gap-5 text-center sm:gap-6 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="text-base font-bold text-dark sm:text-lg">
              Vigo<span className="text-primary">Rap</span>
            </span>
          </div>

          <p className="max-w-sm text-xs text-slate-500 sm:text-sm">
            © {new Date().getFullYear()} VigoRap. সর্বস্বত্ব সংরক্ষিত।
          </p>

          <a
            href="#order"
            className="w-full rounded-md bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-secondary sm:w-auto"
          >
            অর্ডার করুন
          </a>
        </div>
      </div>
    </footer>
  );
}
