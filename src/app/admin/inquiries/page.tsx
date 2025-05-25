// src/app/admin/inquiries/page.tsx
"use client"

import AdminLayout from "@/components/admin/admin-layout"
import InquiryList from "@/components/admin/inquiry-list"

export default function AdminInquiriesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Inquiries</h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to customer inquiries
          </p>
        </div>

        <InquiryList />
      </div>
    </AdminLayout>
  )
}