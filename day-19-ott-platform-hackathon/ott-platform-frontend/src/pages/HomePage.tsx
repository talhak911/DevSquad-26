import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import CategoriesSection from '../components/Home/CategoriesSection';
import DevicesSection from '../components/Home/DevicesSection';
import FAQSection from '../components/Home/FAQSection';
import PricingSection from '../components/Home/PricingSection';
import CTASection from '../components/Home/CTASection';
import Footer from '../components/Footer/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="w-full bg-[var(--color-bg-custom)] flex flex-col items-center">
      <HeroSection />
      <CategoriesSection />
      <DevicesSection />
      <FAQSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default HomePage;
