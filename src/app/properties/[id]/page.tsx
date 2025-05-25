// src/app/properties/[id]/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Share2, Heart, MapPin, Calendar, Eye, Home, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PropertyGallery from "@/components/properties/property-gallery"
import PropertyDetails from "@/components/properties/property-details"
import PropertyContact from "@/components/properties/property-contact"
import PropertyCard from "@/components/properties/property-card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils"
import type { Property } from "@/types"

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

// Format price in INR
const formatPriceINR = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [propertyId, setPropertyId] = useState<string>("")

  useEffect(() => {
    // Resolve params Promise
    params.then((resolvedParams) => {
      setPropertyId(resolvedParams.id)
    })
  }, [params])

  const fetchProperty = useCallback(async () => {
    if (!propertyId) return
    
    try {
      const response = await fetch(`/api/properties/${propertyId}`)
      
      if (response.ok) {
        const data = await response.json()
        setProperty(data.data)
        
        // Fetch related properties
        fetchRelatedProperties(data.data.category, data.data._id)
      } else if (response.status === 404) {
        notFound()
      }
    } catch (error) {
      console.error("Error fetching property:", error)
    } finally {
      setLoading(false)
    }
  }, [propertyId])

  useEffect(() => {
    fetchProperty()
  }, [fetchProperty])

  const fetchRelatedProperties = async (category: string, currentId: string) => {
    try {
      const response = await fetch(`/api/properties?category=${encodeURIComponent(category)}&limit=3`)
      
      if (response.ok) {
        const data = await response.json()
        // Filter out current property
        const related = data.data.filter((p: Property) => p._id !== currentId)
        setRelatedProperties(related.slice(0, 3))
      }
    } catch (error) {
      console.error("Error fetching related properties:", error)
    }
  }

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        })
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Here you would typically save to localStorage or user preferences
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (isFavorite) {
      const updated = favorites.filter((id: string) => id !== property?._id)
      localStorage.setItem('favorites', JSON.stringify(updated))
    } else {
      favorites.push(property?._id)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
  }

  useEffect(() => {
    // Check if property is in favorites
    if (property) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setIsFavorite(favorites.includes(property._id))
    }
  }, [property])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!property) {
    return notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-yellow-600 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/properties" className="hover:text-yellow-600 transition-colors">
            Properties
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/categories?category=${property.category}`} className="hover:text-yellow-600 transition-colors">
            {property.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{property.title}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-8">
          <Link href="/properties" className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </div>

        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
                  {property.category}
                </Badge>
                <Badge variant={property.status === 'Available' ? 'default' : 'secondary'} 
                       className={property.status === 'Available' 
                         ? 'bg-green-100 text-green-800 border-green-200' 
                         : 'bg-gray-100 text-gray-700 border-gray-200'}>
                  {property.status}
                </Badge>
                {property.featured && (
                  <Badge className="bg-yellow-500 text-black border-yellow-600">
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{property.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Listed {formatDate(property.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{property.views || 0} views</span>
                </div>
              </div>

              <div className="text-3xl md:text-4xl font-bold text-yellow-600 mb-4">
                {formatPriceINR(property.price)}
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <Button
                onClick={toggleFavorite}
                className={`bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-600 ${
                  isFavorite ? "bg-red-500 hover:bg-red-600 text-white" : ""
                }`}
                size="sm"
              >
                <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Saved" : "Save"}
              </Button>
              
              <Button 
                onClick={handleShare} 
                className="bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-600" 
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
            {property.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Gallery */}
            <PropertyGallery
              images={property.images}
              video={property.video}
              title={property.title}
            />

            {/* Property Details */}
            <PropertyDetails property={property} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PropertyContact property={property} />
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProperties.length > 0 && (
          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">You May Also Like</h2>
            <p className="text-gray-600 mb-8">Similar properties in {property.category}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProperties.map((relatedProperty) => (
                <PropertyCard key={relatedProperty._id} property={relatedProperty} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Link href={`/categories?category=${property.category}`}>
                  View All {property.category} Properties
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}