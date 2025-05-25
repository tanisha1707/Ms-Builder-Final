// src/app/page.tsx
import HeroSection from "@/components/home/hero-section"
import FeaturedProperties from "@/components/home/featured-properties"
import AboutSection from "@/components/home/about-section"
import CategoriesSection from "@/components/home/categories-section"
import TestimonialsSection from "@/components/home/testimonials-section"
import CTASection from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <div className="page-transition">
      <HeroSection />
      <FeaturedProperties />
      <AboutSection />
      <CategoriesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
