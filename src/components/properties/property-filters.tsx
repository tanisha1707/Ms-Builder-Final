// src/components/properties/property-filters.tsx
"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import clsx from "clsx"

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
          className="pl-10 border border-yellow-200 shadow-sm focus:ring-yellow-300 focus:border-yellow-400 transition"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center border-yellow-200 hover:bg-yellow-50 transition"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 border border-yellow-300">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={onClearFilters} size="sm" className="text-yellow-600 hover:bg-yellow-50">
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {isOpen && (
        <Card className="border border-yellow-100 shadow-md shadow-yellow-100 transition rounded-xl">
          <CardHeader>
            <CardTitle className="text-yellow-700 font-semibold">Filter Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category */}
            <FilterGroup 
              label="Category" 
              options={categories} 
              selected={filters.category} 
              onChange={(val) => handleFilterChange("category", val)} 
            />

            {/* Status */}
            <FilterGroup 
              label="Status" 
              options={statuses} 
              selected={filters.status} 
              onChange={(val) => handleFilterChange("status", val)} 
            />

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                  className="border-yellow-200 shadow-sm"
                />
                <Input
                  placeholder="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                  className="border-yellow-200 shadow-sm"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <FilterGroup 
              label="Bedrooms" 
              options={bedroomOptions} 
              selected={filters.bedrooms} 
              onChange={(val) => handleFilterChange("bedrooms", val)} 
              gridCols="grid-cols-3 md:grid-cols-6"
            />

            {/* Bathrooms */}
            <FilterGroup 
              label="Bathrooms" 
              options={bathroomOptions} 
              selected={filters.bathrooms} 
              onChange={(val) => handleFilterChange("bathrooms", val)} 
              gridCols="grid-cols-3 md:grid-cols-5"
            />

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Input
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="border-yellow-200 shadow-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function FilterGroup({
  label,
  options,
  selected,
  onChange,
  gridCols = "grid-cols-2 md:grid-cols-3"
}: {
  label: string
  options: string[]
  selected: string
  onChange: (val: string) => void
  gridCols?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className={clsx("grid gap-2", gridCols)}>
        {options.map((option) => {
          const isSelected = selected === option || (option === "All" || option === "Any") && !selected
          return (
            <Button
              key={option}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(option === "All" || option === "Any" ? "" : option)}
              className={clsx(
                "transition",
                isSelected ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "border-yellow-100 hover:bg-yellow-50"
              )}
            >
              {option}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
