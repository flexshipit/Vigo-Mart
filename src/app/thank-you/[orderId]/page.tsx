import Link from "next/link";
import { Leaf } from "lucide-react";
import ThankYouContent from "@/components/thank-you/ThankYouContent";

type PageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function ThankYouPage({ params }: PageProps) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-white to-slate-50">
      <header className="border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="section-container flex h-14 items-center sm:h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-base font-bold text-slate-900 sm:text-lg">
              Vigo<span className="text-primary">Max</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="section-container section-padding">
        <ThankYouContent orderId={orderId} />
      </main>
    </div>
  );
}
