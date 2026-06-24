import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import Benefits from "@/components/landing/Benefits";
import DosageGuide from "@/components/landing/DosageGuide";
import Disclaimer from "@/components/landing/Disclaimer";
import ProductCards from "@/components/landing/ProductCards";
import HowItWorks from "@/components/landing/HowItWorks";
import OrderForm from "@/components/landing/OrderForm";
import Reviews from "@/components/landing/Reviews";
import Policy from "@/components/landing/Policy";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-full bg-background font-sans">
        <Hero />
        <TrustBar />
        <Benefits />
        <DosageGuide />
        <Disclaimer />
        <ProductCards />
        <HowItWorks />
        <OrderForm />
        <Policy />
        <Reviews />
        <Footer />
      </div>
    </>
  );
}
