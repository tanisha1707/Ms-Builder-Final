// src/app/admin/properties/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import PropertyCard from "@/components/properties/property-card"
import type { Property } from "@/types"

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/properties?limit=50", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProperties(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setDeleting(id)
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setProperties(prev => prev.filter(p => p._id !== id))
      } else {
        alert("Failed to delete property")
      }
    } catch (error) {
      console.error("Error deleting property:", error)
      alert("Error deleting property")
    } finally {
      setDeleting(null)
    }
  }

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Properties</h1>
            <p className="text-muted-foreground mt-1">
              {properties.length} total properties
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/properties/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Properties */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property._id} className="relative">
                <PropertyCard property={property} />
                
                {/* Admin Actions Overlay */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="bg-white/90"
                  >
                    <Link href={`/admin/properties/edit/${property._id}`}>
                      <Edit className="h-3 w-3" />
                    </Link>
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-500/90"
                    onClick={() => handleDelete(property._id!, property.title)}
                    disabled={deleting === property._id}
                  >
                    {deleting === property._id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No properties found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}