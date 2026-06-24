import type { Metadata } from "next";

export const SITE_URL = "https://vigomaxbd.store";

export const SITE = {
  name: "VigoMax",
  nameBn: "ভিগোম্যাক্স",
  domain: "vigomaxbd.store",
  url: SITE_URL,
  tagline: "অরিজিনাল আয়ুর্বেদিক ক্যাপসুল",
  description:
    "VigoMax (ভিগোম্যাক্স) — অরিজিনাল আয়ুর্বেদিক ক্যাপসুল। 10 পিস 600৳, 15 পিস 900৳, 20 পিস 1100৳। সারা বাংলাদেশে হোম ডেলিভারি 130৳। ক্যাশ অন ডেলিভারি ও 100% সন্তুষ্টি গ্যারান্টি।",
  keywords: [
    "VigoMax",
    "ভিগোম্যাক্স",
    "vigomaxbd",
    "আয়ুর্বেদিক ক্যাপসুল",
    "ভিগোম্যাক্স ক্যাপসুল",
    "অরিজিনাল ক্যাপসুল বাংলাদেশ",
    "ক্যাশ অন ডেলিভারি",
    "হোম ডেলিভারি বাংলাদেশ",
  ],
  ogImage: "/images/product-1.png",
  locale: "bn_BD",
} as const;

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name} — ${SITE.nameBn} ${SITE.tagline} অর্ডার করুন`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE_URL,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "health",
};

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE.name,
      alternateName: SITE.nameBn,
      url: SITE_URL,
      logo: `${SITE_URL}${SITE.ogImage}`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE.name,
      alternateName: SITE.nameBn,
      description: SITE.description,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "bn-BD",
    },
    {
      "@type": "Store",
      "@id": `${SITE_URL}/#store`,
      name: SITE.name,
      url: SITE_URL,
      image: `${SITE_URL}${SITE.ogImage}`,
      description: SITE.description,
      priceRange: "৳600–৳1100",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
      },
      paymentAccepted: "Cash on Delivery",
      currenciesAccepted: "BDT",
    },
  ],
};
