import { BadgeCheck, Banknote, MapPin, Truck } from "lucide-react";

const ITEMS = [
  { icon: Banknote, label: "ক্যাশ অন ডেলিভারি" },
  { icon: Truck, label: "2–4 দিন ডেলিভারি" },
  { icon: MapPin, label: "সারা বাংলাদেশ — 130৳" },
  { icon: BadgeCheck, label: "100% টাকা ফেরত গ্যারান্টি" },
];

export default function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="section-container py-4 sm:py-5">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2.5 sm:justify-center sm:gap-2.5 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0"
            >
              <item.icon className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
              <span className="text-xs font-medium text-slate-700 sm:text-sm">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
