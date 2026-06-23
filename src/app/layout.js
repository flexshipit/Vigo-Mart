import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/theme/ThemeRegistry";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
});

export const metadata = {
  title: "Vigor Q - প্রিমিয়াম আয়ুর্বেদিক মেডিসিন",
  description: "হারানো যৌন শক্তি ও জীবনীশক্তি ফিরে পান প্রাকৃতিকভাবে।",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F5F7F8]">
        <ThemeRegistry>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col">
            {children}
          </div>
        </ThemeRegistry>
      </body>
    </html>
  );
}

