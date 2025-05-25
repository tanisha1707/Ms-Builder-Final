// src/app/admin/blogs/edit/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import AdminLayout from "@/components/admin/admin-layout"
import BlogForm from "@/components/admin/blog-form"
import LoadingSpinner from "@/components/ui/loading-spinner"
import type { Blog } from "@/types"

interface EditBlogPageProps {
  params: Promise<{ id: string }>
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [blogId, setBlogId] = useState<string>("")

  useEffect(() => {
    // Resolve params Promise
    params.then((resolvedParams) => {
      setBlogId(resolvedParams.id)
    })
  }, [params])

  useEffect(() => {
    if (!blogId) return

    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        const response = await fetch(`/api/blogs/${blogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setBlog(data.data)
        } else if (response.status === 404) {
          notFound()
        }
      } catch (error) {
        console.error("Error fetching blog:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [blogId])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    )
  }

  if (!blog) {
    return notFound()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground mt-1">
            Update blog: {blog.title}
          </p>
        </div>

        <BlogForm blog={blog} isEditing={true} />
      </div>
    </AdminLayout>
  )
}