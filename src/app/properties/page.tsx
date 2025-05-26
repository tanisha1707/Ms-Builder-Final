// src/app/properties/page.tsx
"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import PropertyCard from "@/components/properties/property-card"
import PropertyFilters from "@/components/properties/property-filters"
import LoadingSpinner from "@/components/ui/loading-spinner"
import EmptyState from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Home, ChevronLeft, ChevronRight } from "lucide-react"
import type { Property } from "@/types"

interface Filters {
  search: string
  category: string
  status: string
  minPrice: string
  maxPrice: string
  bedrooms: string
  bathrooms: string
  location: string
}

function PropertiesContent() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  const [filters, setFilters] = useState<Filters>({
    search: searchParams?.get("search") || "",
    category: searchParams?.get("category") || "",
    status: searchParams?.get("status") || "",
    minPrice: searchParams?.get("minPrice") || "",
    maxPrice: searchParams?.get("maxPrice") || "",
    bedrooms: searchParams?.get("bedrooms") || "",
    bathrooms: searchParams?.get("bathrooms") || "",
    location: searchParams?.get("location") || "",
  })

  const fetchProperties = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      // Add pagination
      params.append("page", pagination.page.toString())
      params.append("limit", pagination.limit.toString())
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/properties?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setProperties(data.data || [])
        setPagination(prev => ({ ...prev, ...data.pagination }))
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      location: "",
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 page-transition">
      <section className="w-full px-6 pt-0 md:pt-0 pb-12 bg-white mb-12">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
    
    {/* Text Content */}
    <div className="md:w-1/2">
      <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-12">
        <span className="text-black">Premium Properties Listing by </span>
        <span className="text-yellow-500 drop-shadow-md">MS Builder</span>
      </h1>
      <p className="text-gray-700 text-base md:text-lg mb-8">
        Explore an extensive range of <span className="text-yellow-600 font-semibold">residential</span> and <span className="text-yellow-600 font-semibold">commercial properties</span> tailored for every lifestyle and investment need. From luxurious villas to modern office spaces—find it all in one place.
      </p>
      <p className="text-gray-700 text-base md:text-lg">
        MS Builder ensures <span className="text-black font-medium">trusted ownership</span>, <span className="text-black font-medium">transparent pricing</span>, and <span className="text-yellow-600 font-semibold">prime locations</span>—your dream property is just a click away.
      </p>
    </div>

    {/* Image */}
    <div className="md:w-1/2 flex justify-center">
      <img 
        src="/images/properties-hero.jpg" 
        alt="For Sale Sign in Front of Property" 
        className="w-full max-w-md rounded-xl shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-transform duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(232,179,8,0.7)] object-cover"
      />
    </div>
  </div>
</section>



      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Properties Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : properties.length > 0 ? (
            <>
              {/* Results Info */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} properties
                </p>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={Home}
              title="No Properties Found"
              description="Try adjusting your search criteria or browse all properties."
              action={{
                label: "Clear Filters",
                onClick: handleClearFilters
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  )
}