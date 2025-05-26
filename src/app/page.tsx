import HeroSection from "@/components/home/hero-section";
import FeaturedProperties from "@/components/home/featured-properties";
import AboutSection from "@/components/home/about-section";
import CategoriesSection from "@/components/home/categories-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import LatestBlogsSection from "@/components/home/LatestBlogsSection";
import CTASection from "@/components/home/cta-section";

async function fetchLatestBlogs() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/blogs?limit=3`, {
    next: { revalidate: 60 }, // cache for 60 seconds
  });

  if (!res.ok) {
    console.error("Failed to fetch latest blogs");
    return [];
  }

  const data = await res.json();
  return data.data || [];
}

export default async function HomePage() { 
  const latestBlogs = await fetchLatestBlogs();

  return (
    <div className="page-transition">
      <HeroSection />
      <FeaturedProperties />
      <AboutSection />
      <CategoriesSection />
      <TestimonialsSection />
      <LatestBlogsSection blogs={latestBlogs} />
      <CTASection />
    </div>
  );
}
