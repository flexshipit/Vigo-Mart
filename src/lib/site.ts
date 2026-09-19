import type { Metadata } from "next";
import { getProductPricingSummary, PRODUCT_DESCRIPTION, PRODUCT_NAME, PRODUCT_NAME_BN } from "@/lib/products";

export const SITE_URL = "https://vigomaxbd.store";

export const SITE = {
  name: PRODUCT_NAME,
  nameBn: PRODUCT_NAME_BN,
  brandLead: "EZ ALIF",
  brandAccent: "Shop",
  domain: "vigomaxbd.store",
  url: SITE_URL,
  tagline: PRODUCT_NAME_BN,
  description: `${PRODUCT_NAME} (${PRODUCT_NAME_BN}) — ${PRODUCT_DESCRIPTION} ${getProductPricingSummary()}। সারা বাংলাদেশে হোম ডেলিভারি 130৳। ক্যাশ অন ডেলিভারি।`,
  keywords: [
    "EZ ALIF Shop",
    "ইজি শপ",
    "EZ ALIF",
    "Easy Shop",
    "গরুর মাংসের আচার",
    "রসুনের আচার",
    "চিংড়ি বালাচাও",
    "মিক্সড নাট্স",
    "হোমমেড আচার বাংলাদেশ",
    "ক্যাশ অন ডেলিভারি",
    "হোম ডেলিভারি বাংলাদেশ",
  ],
  ogImage: "/images/beef-achar.jpg",
  locale: "bn_BD",
} as const;

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PRODUCT_NAME} — হোমমেড আচার, বালাচাও ও মিক্সড নাট্স`,
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
    title: `${PRODUCT_NAME} — ${PRODUCT_NAME_BN}`,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${PRODUCT_NAME} — ${PRODUCT_NAME_BN}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PRODUCT_NAME} — ${PRODUCT_NAME_BN}`,
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
  category: "food",
};

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE.name,
      alternateName: [SITE.nameBn, PRODUCT_NAME, PRODUCT_NAME_BN],
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE.name,
      alternateName: [SITE.nameBn, PRODUCT_NAME, PRODUCT_NAME_BN],
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
      priceRange: "৳200–৳400",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BD",
      },
      paymentAccepted: "Cash on Delivery",
      currenciesAccepted: "BDT",
    },
  ],
};
