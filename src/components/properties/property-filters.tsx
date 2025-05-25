// src/components/properties/property-filters.tsx
"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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

interface PropertyFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onClearFilters: () => void
}

export default function PropertyFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: PropertyFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const categories = ["All", "Residential", "Commercial", "Apartment", "Villa", "Office"]
  const statuses = ["All", "Available", "Sold", "Rented", "Pending"]
  const bedroomOptions = ["Any", "1", "2", "3", "4", "5+"]
  const bathroomOptions = ["Any", "1", "2", "3", "4+"]

  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== "All" && value !== "Any" && value !== ""
  ).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={onClearFilters} size="sm">
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Filter Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filters.category === category || (category === "All" && !filters.category) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("category", category === "All" ? "" : category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={filters.status === status || (status === "All" && !filters.status) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("status", status === "All" ? "" : status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                />
                <Input
                  placeholder="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {bedroomOptions.map((bedroom) => (
                  <Button
                    key={bedroom}
                    variant={filters.bedrooms === bedroom || (bedroom === "Any" && !filters.bedrooms) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("bedrooms", bedroom === "Any" ? "" : bedroom)}
                  >
                    {bedroom}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium mb-2">Bathrooms</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {bathroomOptions.map((bathroom) => (
                  <Button
                    key={bathroom}
                    variant={filters.bathrooms === bathroom || (bathroom === "Any" && !filters.bathrooms) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange("bathrooms", bathroom === "Any" ? "" : bathroom)}
                  >
                    {bathroom}
                  </Button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}