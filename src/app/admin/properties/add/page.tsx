// src/app/admin/properties/add/page.tsx
"use client"

import AdminLayout from "@/components/admin/admin-layout"
import PropertyForm from "@/components/admin/property-form"

export default function AddPropertyPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Property</h1>
          <p className="text-muted-foreground mt-1">
            Create a new property listing
          </p>
        </div>

        <PropertyForm />
      </div>
    </AdminLayout>
  )
}