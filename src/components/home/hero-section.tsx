"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/properties?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpeg"
          alt="Luxury Real Estate Background"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
      </div>

      {/* AI-Generated Image Overlay */}
      <div className="absolute inset-0 z-10 hidden md:block">
        <Image
          src="/images/ai-hero-image.jpg"
          alt="AI-Generated Luxury Property"
          fill
          className="object-contain opacity-20 scale-125 transform translate-x-1/4"
          priority
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Discover Your Dream Property with{" "}
            <span className="text-yellow-500">MSBUILDER&apos;S</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Explore premium properties crafted for your lifestyle and investment aspirations. 
            Your perfect home awaits.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-4 bg-white/95 p-3 rounded-xl shadow-xl border border-gray-200">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Search by location, property type, or price..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 border-0 focus-visible:ring-0 text-base bg-gray-100 rounded-lg"
                />
              </div>
              <Button type="submit" size="lg" className="px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                Search Properties
              </Button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              <Link href="/properties">
                Browse Properties
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="px-8 bg-transparent border-2 border-gray-300 text-gray-300 hover:bg-gray-200 hover:text-black transition-all duration-300">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">500+</div>
              <div className="text-gray-300 text-sm md:text-base">Properties Sold</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">1000+</div>
              <div className="text-gray-300 text-sm md:text-base">Happy Clients</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">15+</div>
              <div className="text-gray-300 text-sm md:text-base">Years Experience</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">50+</div>
              <div className="text-gray-300 text-sm md:text-base">Locations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-yellow-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}