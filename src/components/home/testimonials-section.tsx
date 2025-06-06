"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    image: "/images/SarahImg.jpg",
    rating: 5,
    content: "MSBUILDER'S helped us find our dream home in just 2 weeks! Their team was professional, knowledgeable, and went above and beyond to make sure we found exactly what we were looking for. Highly recommended!",
    property: "4-bedroom villa in Downtown"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Investor",
    image: "/images/MichaelImg.jpg",
    rating: 5,
    content: "As a real estate investor, I've worked with many agencies, but MSBUILDER'S stands out. Their market knowledge and investment insights have helped me build a profitable portfolio. Excellent service!",
    property: "Commercial property portfolio"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "First-time Buyer",
    image: "/images/EmilyImg.jpg",
    rating: 5,
    content: "Being a first-time buyer was overwhelming, but MSBUILDER'S made the process smooth and stress-free. They explained everything clearly and found us a perfect apartment within our budget.",
    property: "2-bedroom apartment in Riverside"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Business Owner",
    image: "/images/DavidImg.jpg",
    rating: 5,
    content: "MSBUILDER'S helped us find the perfect office space for our growing business. Their understanding of commercial real estate and negotiation skills saved us both time and money.",
    property: "Office space in Business District"
  }
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 10000)
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    )
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 10000)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 10000)
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-craterbrown mb-4 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-lg text-craterbrown-300 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied clients 
            have to say about their experience with MSBUILDER&apos;S.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="overflow-hidden bg-akaroa border-gray-200 transform transition-transform duration-300 hover:scale-105">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <Quote className="h-12 w-12 text-yellow-500 mx-auto mb-6" />
                
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-lg md:text-xl text-craterbrown leading-relaxed mb-8">
                    &quot;{testimonials[currentIndex].content}&quot;
                  </blockquote>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="text-left">
                    <div className="font-semibold text-lg text-craterbrown">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text- craterbrown-300">
                      {testimonials[currentIndex].role}
                    </div>
                    <div className="text-sm text-craterbrown-500">
                      {testimonials[currentIndex].property}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-800 border-gray-200 text-gray-300 hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 border-gray-200 text-gray-300 hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-yellow-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}