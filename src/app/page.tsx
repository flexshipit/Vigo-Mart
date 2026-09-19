import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProductCards from "@/components/landing/ProductCards";
import OrderForm from "@/components/landing/OrderForm";
import HowItWorks from "@/components/landing/HowItWorks";
import Reviews from "@/components/landing/Reviews";
import Policy from "@/components/landing/Policy";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-full bg-maroon font-sans">
        <Hero />
        <ProductCards />
        <OrderForm />
        <HowItWorks />
        <Reviews />
        <Policy />
        <Footer />
      </div>
    </>
  );
}
