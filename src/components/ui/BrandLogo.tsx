import { SITE } from "@/lib/site";

type BrandLogoProps = {
  className?: string;
  accentClassName?: string;
};

export default function BrandLogo({
  className = "text-sm font-bold text-dark sm:text-base lg:text-lg",
  accentClassName = "text-primary",
}: BrandLogoProps) {
  return (
    <span className={className}>
      {SITE.brandLead}{" "}
      <span className={accentClassName}>{SITE.brandAccent}</span>
    </span>
  );
}
