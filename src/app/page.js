import { Hero, Benefits, Ingredients, OrderForm, Navbar, Footer } from "@/components/landing/Index";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Benefits />
      <Ingredients />
      <OrderForm />
      <Footer />
    </>
  );
}
