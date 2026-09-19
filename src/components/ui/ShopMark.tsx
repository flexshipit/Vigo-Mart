import Image from "next/image";
import { SITE_IMAGES } from "@/lib/images";
import { PRODUCT_NAME } from "@/lib/products";

type ShopMarkProps = {
  size?: number;
  className?: string;
};

export default function ShopMark({ size = 40, className = "" }: ShopMarkProps) {
  return (
    <Image
      src={SITE_IMAGES.logo}
      alt={PRODUCT_NAME}
      width={size}
      height={size}
      className={`rounded-md bg-black object-contain ${className}`}
    />
  );
}
