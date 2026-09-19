import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import ShopMark from "@/components/ui/ShopMark";
import ThankYouContent from "@/components/thank-you/ThankYouContent";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function ThankYouPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream">
      <header className="border-b border-primary/15 bg-cream/95 shadow-sm backdrop-blur-md">
        <div className="section-container flex h-14 items-center sm:h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <ShopMark size={36} className="h-9 w-9" />
            <BrandLogo className="text-base font-bold text-slate-900 sm:text-lg" />
          </Link>
        </div>
      </header>

      <main className="section-container section-padding">
        <ThankYouContent orderId={orderId} />
      </main>
    </div>
  );
}
