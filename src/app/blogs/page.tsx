// src/app/blogs/page.tsx
"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import BlogCard from "@/components/blogs/blog-card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import EmptyState from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import type { Blog } from "@/types"

const categories = [
  "All",
  "Real Estate",
  "Market Trends", 
  "Investment Tips",
  "Home Buying",
  "Property Management",
  "Legal Advice",
  "Lifestyle",
  "News"
]

function BlogsContent() {
  const searchParams = useSearchParams()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("category") || "")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  })

  const fetchBlogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      params.append("page", pagination.page.toString())
      params.append("limit", pagination.limit.toString())
      
      if (searchTerm) params.append("search", searchTerm)
      if (selectedCategory && selectedCategory !== "All") {
        params.append("category", selectedCategory)
      }

      const response = await fetch(`/api/blogs?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.data || [])
        setPagination(prev => ({ ...prev, ...data.pagination }))
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, searchTerm, selectedCategory])

  useEffect(() => {
    fetchBlogs()
  }, [selectedCategory, searchTerm, pagination.page, fetchBlogs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchBlogs()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === "All" ? "" : category)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const hasActiveFilters = searchTerm || selectedCategory

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real Estate Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest real estate trends, market insights, and expert advice 
            from our professional team.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-12 shadow-sm">
          <CardContent className="p-6 bg-white">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-20 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category)}
                  size="sm"
                  className={
                    selectedCategory === category || (category === "All" && !selectedCategory)
                      ? "bg-yellow-500 hover:bg-yellow-600 text-black" 
                      : "hover:bg-yellow-50 hover:border-yellow-500"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Active filters and clear */}
            {hasActiveFilters && (
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Filter className="h-4 w-4 mr-2" />
                  Active filters:
                  {searchTerm && <span className="ml-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Search: &quot;{searchTerm}&quot;</span>}
                  {selectedCategory && <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">{selectedCategory}</span>}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Info */}
        {!loading && (
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {pagination.total > 0 ? (
                <>
                  Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> - 
                  <span className="font-medium"> {Math.min(pagination.page * pagination.limit, pagination.total)}</span> of 
                  <span className="font-medium"> {pagination.total}</span> blog posts
                  {hasActiveFilters && " matching your filters"}
                </>
              ) : (
                "No blog posts found"
              )}
            </p>
          </div>
        )}

        {/* Blog Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <Card className="shadow-sm">
                <CardContent className="p-6 bg-white">
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="hover:bg-yellow-50 hover:border-yellow-500"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const pageNum = i + 1
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.page === pageNum ? "default" : "outline"}
                            onClick={() => handlePageChange(pageNum)}
                            size="sm"
                            className={
                              pagination.page === pageNum
                                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                                : "hover:bg-yellow-50 hover:border-yellow-500"
                            }
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="hover:bg-yellow-50 hover:border-yellow-500"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <EmptyState
            icon={FileText}
            title="No Blog Posts Found"
            description={
              hasActiveFilters 
                ? "No blog posts match your search criteria. Try adjusting your filters."
                : "No blog posts are available at the moment. Check back soon for new content!"
            }
            action={{
              label: hasActiveFilters ? "Clear Filters" : "Browse Categories",
              onClick: hasActiveFilters ? clearFilters : () => handleCategoryChange("Real Estate")
            }}
          />
        )}

        {/* Newsletter CTA */}
        <Card className="mt-16 shadow-sm">
          <CardContent className="p-8 bg-gradient-to-r from-yellow-50 to-yellow-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated with Real Estate Insights
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Get the latest market trends, investment tips, and property insights delivered 
              directly to your inbox. Join thousands of real estate enthusiasts!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function BlogsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <BlogsContent />
    </Suspense>
  )
}