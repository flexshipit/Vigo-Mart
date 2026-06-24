import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import MetaPixel from "@/components/analytics/MetaPixel";
import WhatsAppFloat from "@/components/landing/WhatsAppFloat";
import ToasterProvider from "@/components/providers/ToasterProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});


export const metadata: Metadata = {
  title: "VigoRap — ভিগোরাপ অর্ডার করুন",
  description:
    "ভিগোরাপ আয়ুর্বেদিক — 10 পিস 600৳, 15 পিস 900৳, 20 পিস 1100৳। ডেলিভারি 130৳ সারা বাংলাদেশে। ক্যাশ অন ডেলিভারি।",
};

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
