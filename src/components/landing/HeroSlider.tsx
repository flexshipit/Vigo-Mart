"use client";

import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SITE_IMAGES } from "@/lib/images";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white lg:rounded-tr-[3rem] lg:rounded-bl-[3rem]">
      <div className="absolute right-2 top-2 z-10 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white sm:right-3 sm:top-3 sm:px-3 sm:text-xs">
        VIGORAP
      </div>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="hero-swiper aspect-[4/3] w-full sm:aspect-square"
      >
        {SITE_IMAGES.heroSlides.map((src, index) => (
          <SwiperSlide key={src}>
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={`ভিগোরাপ ক্যাপসুল ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
