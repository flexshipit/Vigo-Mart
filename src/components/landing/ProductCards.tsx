"use client";

import Image from "next/image";
import { CirclePlay } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";
import { toBengaliDigits } from "@/lib/numerals";
import { selectPackage } from "@/lib/selectPackage";

function OrderClickButton({ product }: { product: Product }) {
  return (
    <a
      href="#order"
      onClick={() => selectPackage(product.packageId)}
      className="order-click-btn"
    >
      অর্ডার করতে ক্লিক করুন
      <CirclePlay className="h-4 w-4 lg:h-6 lg:w-6" />
    </a>
  );
}

function ProductBlock({ product }: { product: Product }) {
  return (
    <article
      id={`product-${product.packageId}`}
      className="border-b border-white/15 py-8 last:border-b-0 sm:py-10 lg:py-14"
    >
      <h2 className="text-center text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[40px] lg:leading-tight">
        {product.headline}
      </h2>

      {product.intro && (
        <p className="mt-4 text-center text-base font-bold leading-relaxed text-white sm:text-lg lg:mt-6 lg:text-[34px] lg:leading-10">
          {product.intro}
        </p>
      )}

      <div className="mt-6 grid items-center gap-6 sm:mt-8 lg:mt-10 lg:grid-cols-2 lg:gap-12">
        <div>
          {product.whyTitle !== product.headline && (
            <h3 className="text-lg font-bold text-white sm:text-xl lg:text-[34px] lg:leading-10">
              {product.whyTitle}
            </h3>
          )}
          <ul
            className={
              product.whyTitle !== product.headline
                ? "mt-4 space-y-0 lg:mt-6"
                : "space-y-0"
            }
          >
            {product.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-3 border-b border-white/25 py-3 text-[15px] font-semibold leading-relaxed text-white last:border-b-0 sm:text-base lg:gap-4 lg:py-4 lg:text-[30px] lg:leading-[1.45]"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold lg:mt-3.5 lg:h-2.5 lg:w-2.5" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-md border-2 border-gold/80 bg-[#f3e6c8] shadow-lg sm:max-w-[360px] lg:mx-0 lg:max-w-[540px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 540px, (min-width: 640px) 360px, 280px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 lg:mt-10 lg:flex-row lg:justify-center lg:gap-8">
        <p className="text-center text-lg font-bold text-white sm:text-xl lg:text-[32px]">
          {product.name} {toBengaliDigits(product.price)} টাকা
        </p>
        <OrderClickButton product={product} />
      </div>
    </article>
  );
}

export default function ProductCards() {
  return (
    <section id="products" className="bg-maroon">
      <div className="catalog-container">
        {PRODUCTS.map((product) => (
          <ProductBlock key={product.packageId} product={product} />
        ))}
      </div>
    </section>
  );
}
