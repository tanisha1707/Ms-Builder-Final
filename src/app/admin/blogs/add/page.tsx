// src/app/admin/blogs/add/page.tsx
"use client"

import AdminLayout from "@/components/admin/admin-layout"
import BlogForm from "@/components/admin/blog-form"

export default function AddBlogPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Blog Post</h1>
          <p className="text-muted-foreground mt-1">
            Create a new blog article
          </p>
        </div>

        <BlogForm />
      </div>
    </AdminLayout>
  )
}