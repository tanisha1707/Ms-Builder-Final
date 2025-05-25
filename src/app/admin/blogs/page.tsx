// src/app/admin/blogs/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Eye, RefreshCw } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils"
import type { Blog } from "@/types"

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("auth-token")
      
      // Remove the published=false filter to get ALL blogs
      const response = await fetch("/api/blogs?limit=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Fetched blogs:", data) // Debug log
        setBlogs(data.data || [])
      } else {
        console.error("Failed to fetch blogs:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
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
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setBlogs(prev => prev.filter(b => b._id !== id))
        alert("Blog deleted successfully!")
      } else {
        alert("Failed to delete blog")
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      alert("Error deleting blog")
    } finally {
      setDeleting(null)
    }
  }

  // Filter blogs based on search term and status
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "published" && blog.published) ||
      (statusFilter === "draft" && !blog.published) ||
      (statusFilter === "featured" && blog.featured)
    
    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    const published = blogs.filter(b => b.published).length
    const drafts = blogs.filter(b => !b.published).length
    const featured = blogs.filter(b => b.featured).length
    
    return { published, drafts, featured, total: blogs.length }
  }

  const statusCounts = getStatusCounts()

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Blogs</h1>
            <p className="text-gray-600 mt-1">
              {statusCounts.total} total blog posts ({statusCounts.published} published, {statusCounts.drafts} drafts)
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              onClick={fetchBlogs}
              disabled={loading}
              className="hover:bg-yellow-50 hover:border-yellow-500"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
              <Link href="/admin/blogs/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Blog
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:bg-yellow-50" onClick={() => setStatusFilter("all")}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
              <div className="text-sm text-gray-600">Total Blogs</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-green-50" onClick={() => setStatusFilter("published")}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.published}</div>
              <div className="text-sm text-gray-600">Published</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setStatusFilter("draft")}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{statusCounts.drafts}</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-blue-50" onClick={() => setStatusFilter("featured")}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.featured}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search blogs by title, category, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex space-x-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  className={statusFilter === "all" ? "bg-yellow-500 text-black hover:bg-yellow-600" : "hover:bg-yellow-50"}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "published" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("published")}
                  className={statusFilter === "published" ? "bg-green-500 text-white hover:bg-green-600" : "hover:bg-green-50"}
                >
                  Published
                </Button>
                <Button
                  variant={statusFilter === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("draft")}
                  className={statusFilter === "draft" ? "bg-gray-500 text-white hover:bg-gray-600" : "hover:bg-gray-50"}
                >
                  Drafts
                </Button>
                <Button
                  variant={statusFilter === "featured" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("featured")}
                  className={statusFilter === "featured" ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-blue-50"}
                >
                  Featured
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blogs List */}
        {loading ? (
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-gray-600">Loading blogs...</span>
              </div>
            </CardContent>
          </Card>
        ) : filteredBlogs.length > 0 ? (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <Card key={blog._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start">
                    {/* Blog Info */}
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {blog.title}
                        </h3>
                        <div className="flex flex-wrap gap-1">
                          {blog.featured && (
                            <Badge className="bg-yellow-500 text-black">
                              Featured
                            </Badge>
                          )}
                          <Badge variant={blog.published ? "default" : "secondary"}>
                            {blog.published ? "Published" : "Draft"}
                          </Badge>
                          <Badge variant="outline">{blog.category}</Badge>
                        </div>
                      </div>
                      
                      {blog.excerpt && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {blog.excerpt}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                        <span>By <span className="font-medium">{blog.author}</span></span>
                        <span>{formatDate(blog.createdAt)}</span>
                        <span>{blog.readTime || 5} min read</span>
                        <span>{blog.views || 0} views</span>
                        {blog.tags && blog.tags.length > 0 && (
                          <span>{blog.tags.length} tags</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      {blog.published && (
                        <Button asChild size="sm" variant="outline" title="View Blog">
                          <Link href={`/blogs/${blog._id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      
                      <Button asChild size="sm" variant="outline" title="Edit Blog">
                        <Link href={`/admin/blogs/edit/${blog._id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(blog._id!, blog.title)}
                        disabled={deleting === blog._id}
                        title="Delete Blog"
                      >
                        {deleting === blog._id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || statusFilter !== "all" ? "No blogs match your filters" : "No blogs found"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating your first blog post!"
                  }
                </p>
                {(!searchTerm && statusFilter === "all") && (
                  <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Link href="/admin/blogs/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Blog
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}