import { siteJsonLd } from "@/lib/site";

export default function SiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
    />
  );
}
