import BrandLogo from "@/components/ui/BrandLogo";
import ShopMark from "@/components/ui/ShopMark";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-cream py-8 sm:py-10">
      <div className="section-container">
        <div className="flex flex-col items-center gap-5 text-center sm:gap-6 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <ShopMark size={32} className="h-8 w-8" />
            <BrandLogo />
          </div>

          <p className="max-w-sm text-xs text-slate-600 sm:text-sm">
            © {new Date().getFullYear()} {SITE.name}. সর্বস্বত্ব সংরক্ষিত।
            <br />
            <a
              href={SITE.url}
              className="mt-1 inline-block text-primary hover:underline"
            >
              {SITE.domain}
            </a>
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
