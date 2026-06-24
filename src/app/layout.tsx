import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import MetaPixel from "@/components/analytics/MetaPixel";
import WhatsAppFloat from "@/components/landing/WhatsAppFloat";
import ToasterProvider from "@/components/providers/ToasterProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { siteMetadata } from "@/lib/site";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});


export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteJsonLd />
        <MetaPixel />
        <QueryProvider>
          {children}
          <WhatsAppFloat />
          <ToasterProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
