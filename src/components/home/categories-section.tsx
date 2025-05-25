"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PropertyCard from "@/components/properties/property-card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import type { Property } from "@/types"

const categories = [
  {
    name: "Residential",
    description: "Beautiful homes and residential properties for families",
    icon: "🏠"
  },
  {
    name: "Commercial",
    description: "Prime commercial spaces for your business needs",
    icon: "🏢"
  },
  {
    name: "Apartment",
    description: "Modern apartments in prime locations",
    icon: "🏬"
  },
  {
    name: "Villa",
    description: "Luxury villas with premium amenities",
    icon: "🏡"
  }
]

export default function CategoriesSection() {
  const [propertiesByCategory, setPropertiesByCategory] = useState<Record<string, Property[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPropertiesByCategory = async () => {
      try {
        const promises = categories.map(async (category) => {
          const response = await fetch(`/api/properties?category=${category.name}&limit=3`)
          if (response.ok) {
            const data = await response.json()
            return { category: category.name, properties: data.data || [] }
          }
          return { category: category.name, properties: [] }
        })

        const results = await Promise.all(promises)
        const categoriesData = results.reduce((acc, { category, properties }) => {
          acc[category] = properties
          return acc
        }, {} as Record<string, Property[]>)

        setPropertiesByCategory(categoriesData)
      } catch (error) {
        console.error("Error fetching properties by category:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPropertiesByCategory()
  }, [])

  const renderCategorySection = (category: typeof categories[0]) => (
    <div key={category.name} className="mb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold mb-2 flex items-center text-white">
            <span className="text-3xl mr-3 text-yellow-500">{category.icon}</span>
            {category.name} Properties
          </h3>
          <p className="text-gray-300">{category.description}</p>
        </div>
        
        <Button
          asChild
          variant="outline"
          className="mt-4 md:mt-0 bg-transparent border-gray-300 text-gray-300 hover:bg-gray-200 hover:text-black transition-all duration-300 transform hover:scale-105"
        >
          <Link href={`/categories?category=${category.name}`}>
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner />
        </div>
      ) : propertiesByCategory[category.name]?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertiesByCategory[category.name].map((property) => (
            <div
              key={property._id}
              className="transform transition-all duration-500 ease-in-out hover:scale-105"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-800 border-gray-200">
          <CardContent className="p-8 text-center">
            <p className="text-gray-300">No properties available in this category</p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore our diverse range of properties across different categories 
            to find exactly what you&apos;re looking for.
          </p>
        </div>

        {categories.map(renderCategorySection)}

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transform transition-transform duration-300 hover:scale-105"
          >
            <Link href="/categories">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}