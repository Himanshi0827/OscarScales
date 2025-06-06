import { Helmet } from "react-helmet";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProductsSection from "@/components/home/ProductsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactSection from "@/components/home/ContactSection";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Oscar Digital System - Precision Weighing Scales</title>
        <meta name="description" content="Oscar Digital System provides high-quality weighing solutions for personal, commercial, and industrial applications." />
      </Helmet>
      
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <ProductsSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
};

export default Home;
