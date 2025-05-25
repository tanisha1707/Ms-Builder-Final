"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import PropertyForm from "@/components/admin/property-form"
import LoadingSpinner from "@/components/ui/loading-spinner"
import type { Property } from "@/types"

interface EditPropertyPageProps {
  params: Promise<{ id: string }>
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [propertyId, setPropertyId] = useState<string>("")

  useEffect(() => {
    // Resolve params Promise
    params.then((resolvedParams) => {
      setPropertyId(resolvedParams.id)
    })
  }, [params])

  useEffect(() => {
    if (!propertyId) return

    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        const response = await fetch(`/api/properties/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProperty(data.data)
        } else if (response.status === 404) {
          notFound()
        }
      } catch (error) {
        console.error("Error fetching property:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  if (!property) {
    return notFound()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Property</h1>
          <p className="text-muted-foreground mt-1">
            Update property: {property.title}
          </p>
        </div>

        <PropertyForm property={property} isEditing={true} />
      </div>
    </AdminLayout>
  )
}