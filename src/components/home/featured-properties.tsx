"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/properties/property-card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import EmptyState from "@/components/ui/empty-state"
import { Home } from "lucide-react"
import type { Property } from "@/types"

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await fetch("/api/properties?featured=true&limit=6")
        if (response.ok) {
          const data = await response.json()
          setProperties(data.data || [])
        }
      } catch (error) {
        console.error("Error fetching featured properties:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProperties()
  }, [])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-Portica mb-4 tracking-tight">
            Featured Properties
          </h2>
          <p className="text-lg text-Portica-300 max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium properties that offer 
            exceptional value and outstanding features.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="transform transition-all duration-500 ease-in-out hover:scale-105"
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transform transition-transform duration-300 hover:scale-105"
              >
                <Link href="/properties">
                  View All Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <EmptyState
            icon={Home}
            title="No Featured Properties"
            description="Check back soon for our featured property listings."
            action={{
              label: "Browse All Properties",
              href: "/properties"
            }}
          />
        )}
      </div>
    </section>
  )
}