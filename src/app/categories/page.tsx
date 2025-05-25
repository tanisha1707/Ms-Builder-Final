// src/app/categories/page.tsx
"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import PropertyCard from "@/components/properties/property-card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import EmptyState from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import type { Property } from "@/types"

const categories = [
  {
    name: "All",
    value: "",
    description: "View all properties",
    icon: "🏘️"
  },
  {
    name: "Residential",
    value: "Residential",
    description: "Family homes and residential properties",
    icon: "🏠"
  },
  {
    name: "Commercial",
    value: "Commercial", 
    description: "Business and commercial spaces",
    icon: "🏢"
  },
  {
    name: "Apartment",
    value: "Apartment",
    description: "Modern apartments and condos",
    icon: "🏬"
  },
  {
    name: "Villa",
    value: "Villa",
    description: "Luxury villas and estates",
    icon: "🏡"
  },
  {
    name: "Office",
    value: "Office",
    description: "Professional office spaces",
    icon: "🏛️"
  }
]

function CategoriesContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.get("category") || ""
  )

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) {
        params.append("category", selectedCategory)
      }
      params.append("limit", "12")

      const response = await fetch(`/api/properties?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setProperties(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue)
    
    // Update URL only if window is available
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (categoryValue) {
        url.searchParams.set("category", categoryValue)
      } else {
        url.searchParams.delete("category")
      }
      window.history.pushState({}, "", url.toString())
    }
  }

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory) || categories[0]

  return (
    <div className="container mx-auto px-4 py-12 page-transition">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Property Categories</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our diverse range of properties across different categories.
          Find exactly what you&apos;re looking for.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            onClick={() => handleCategoryChange(category.value)}
            className="flex items-center space-x-2"
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>

      {/* Selected Category Info */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2 flex items-center justify-center">
          <span className="text-3xl mr-3">{selectedCategoryData.icon}</span>
          {selectedCategoryData.name} Properties
        </h2>
        <p className="text-muted-foreground">{selectedCategoryData.description}</p>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Home}
          title="No Properties Found"
          description={`No properties available in the ${selectedCategoryData.name.toLowerCase()} category at the moment.`}
          action={{
            label: "View All Properties",
            onClick: () => handleCategoryChange("")
          }}
        />
      )}
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <CategoriesContent />
    </Suspense>
  )
}