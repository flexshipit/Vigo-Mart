import { PRODUCTS } from "@/lib/products";

export const SITE_IMAGES = {
  logo: "/images/logo.png",
  orderBanner: PRODUCTS[0].image,
  heroSlides: PRODUCTS.map((product) => product.image),
} as const;
