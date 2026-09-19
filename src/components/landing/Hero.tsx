"use client";

import Image from "next/image";
import { HEADER_TAGLINE_LINES } from "@/lib/products";
import { SITE_IMAGES } from "@/lib/images";

export default function Hero() {
  return (
    <section className="bg-cream">
      <div className="catalog-container py-6 text-center sm:py-8 lg:py-10">
        <p className="text-[15px] font-bold leading-snug text-primary sm:text-lg lg:text-[31px] lg:leading-[1.45]">
          {HEADER_TAGLINE_LINES[0]}
        </p>
        <p className="mt-1 text-[15px] font-bold text-primary sm:text-lg lg:mt-2 lg:text-[31px] lg:leading-[1.45]">
          {HEADER_TAGLINE_LINES[1]}
        </p>

        <div className="mt-5 flex justify-center sm:mt-6 lg:mt-8">
          <Image
            src={SITE_IMAGES.logo}
            alt="EZ ALIF Shop — ইজি শপ"
            width={176}
            height={176}
            priority
            className="h-24 w-24 rounded-md bg-black object-contain shadow-md sm:h-28 sm:w-28 lg:h-40 lg:w-40"
          />
        </div>
      </div>
    </section>
  );
}
