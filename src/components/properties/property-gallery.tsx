// src/components/properties/property-gallery.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyGalleryProps {
  images: string[]
  video?: string
  title: string
}

export default function PropertyGallery({ images, video, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setShowVideo(false)
  }

  return (
    <>
      <div className="mb-8">
        <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-lg">
          {showVideo && video ? (
            <div className="w-full h-full">
              <iframe 
                src={video} 
                title={`${title} Video`} 
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <Image
              src={images[currentIndex] || "/images/placeholder-property.jpg"}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            />
          )}

          {!showVideo && images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {video && (
            <Button
              variant={showVideo ? "default" : "secondary"}
              size="icon"
              onClick={() => setShowVideo(!showVideo)}
              className="absolute bottom-4 right-4"
              aria-label={showVideo ? "Show images" : "Play video"}
            >
              <Play className="h-6 w-6" />
            </Button>
          )}

          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {showVideo ? "Video" : `${currentIndex + 1} / ${images.length}`}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative h-16 w-24 rounded-md overflow-hidden transition-all flex-shrink-0 ${
                currentIndex === index && !showVideo ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
          {video && (
            <button
              onClick={() => setShowVideo(true)}
              className={`relative h-16 w-24 rounded-md overflow-hidden transition-all flex-shrink-0 bg-black flex items-center justify-center ${
                showVideo ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Play className="h-6 w-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4">
            <Image
              src={images[currentIndex]}
              alt={`${title} - Fullscreen`}
              fill
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
        </div>
      )}
    </>
  )
}