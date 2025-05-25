// src/app/blogs/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, ArrowLeft, Share2, Tag, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import BlogCard from "@/components/blogs/blog-card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils"
import type { Blog } from "@/types"

interface BlogPageProps {
  params: Promise<{ id: string }>
}

export default function BlogPage({ params }: BlogPageProps) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
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
        const response = await fetch(`/api/blogs/${blogId}`)
        
        if (response.ok) {
          const data = await response.json()
          setBlog(data.data)
          
          // Fetch related blogs
          fetchRelatedBlogs(data.data.category, data.data._id)
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

  const fetchRelatedBlogs = async (category: string, currentId: string) => {
    try {
      const response = await fetch(`/api/blogs?category=${encodeURIComponent(category)}&limit=3`)
      
      if (response.ok) {
        const data = await response.json()
        // Filter out current blog
        const related = data.data.filter((b: Blog) => b._id !== currentId)
        setRelatedBlogs(related.slice(0, 3))
      }
    } catch (error) {
      console.error("Error fetching related blogs:", error)
    }
  }

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        })
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!blog) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="outline" className="hover:bg-yellow-50 hover:border-yellow-500">
            <Link href="/blogs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article Container */}
        <div className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <Card className="mb-8 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Featured Image */}
              {blog.image && (
                <div className="relative w-full h-[400px]">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Title overlay on image */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
                        {blog.category}
                      </Badge>
                      {blog.featured && (
                        <Badge variant="secondary" className="bg-green-500 text-white">
                          <Heart className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
                      {blog.title}
                    </h1>
                  </div>
                </div>
              )}

              {/* Article Meta - always visible */}
              <div className="p-6 bg-white">
                {/* If no image, show title here */}
                {!blog.image && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
                        {blog.category}
                      </Badge>
                      {blog.featured && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Heart className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                      {blog.title}
                    </h1>
                  </>
                )}
                
                {/* Author and Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-3">
                      {blog.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span className="font-medium text-gray-900">{blog.author}</span>
                      </div>
                      <div className="text-sm text-gray-500">Real Estate Expert</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{blog.readTime} min read</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    <span>{blog.views || 0} views</span>
                  </div>
                </div>

                {/* Excerpt */}
                {blog.excerpt && (
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed border-l-4 border-yellow-500 pl-4 bg-yellow-50 py-3">
                    {blog.excerpt}
                  </p>
                )}

                {/* Share Button */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <Button 
                    onClick={handleShare} 
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    size="sm"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Article
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    Published in <span className="font-medium text-gray-700">{blog.category}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blog Content */}
          <Card className="mb-8 shadow-sm">
            <CardContent className="p-8 bg-white">
              <div 
                className="prose prose-lg prose-gray max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <Card className="mb-8 shadow-sm">
              <CardContent className="p-6 bg-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                  <Tag className="h-4 w-4 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="hover:bg-yellow-50 hover:border-yellow-500 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Author Bio */}
          <Card className="mb-8 shadow-sm">
            <CardContent className="p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xl font-bold flex-shrink-0">
                  {blog.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About {blog.author}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {blog.author} is a real estate expert and content writer with years of experience 
                    in the industry. They specialize in sharing insights on real estate trends, 
                    investment strategies, and market analysis to help readers make informed decisions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Real Estate Expert</Badge>
                    <Badge variant="outline" className="text-xs">Market Analyst</Badge>
                    <Badge variant="outline" className="text-xs">Content Writer</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <Card className="shadow-sm">
              <CardContent className="p-8 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  You Might Also Like
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <BlogCard key={relatedBlog._id} blog={relatedBlog} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <Card className="max-w-4xl mx-auto mt-12 shadow-sm">
          <CardContent className="p-8 bg-gradient-to-r from-yellow-50 to-yellow-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Take the Next Step?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Whether you&apos;re buying, selling, or investing in real estate, our expert team 
              is here to guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black px-6">
                <Link href="/properties">
                  Browse Properties
                </Link>
              </Button>
              <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black px-6">
                <Link href="/blogs">
                  Read More Articles
                </Link>
              </Button>
              <Button asChild variant="outline" className="hover:bg-white border-gray-300 px-6">
                <Link href="/contact">
                  Contact Our Experts
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Styles for Blog Content */}
      <style jsx global>{`
        .blog-content {
          line-height: 1.8;
          font-size: 17px;
          color: #374151;
        }
        
        .blog-content h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 2rem 0 1rem 0;
          color: #1f2937;
          line-height: 1.2;
        }
        
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
          color: #374151;
          line-height: 1.3;
        }
        
        .blog-content h3 {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 1.25rem 0 0.5rem 0;
          color: #4b5563;
          line-height: 1.4;
        }
        
        .blog-content p {
          margin: 1rem 0;
          line-height: 1.8;
        }
        
        .blog-content ul, .blog-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .blog-content li {
          margin: 0.5rem 0;
          line-height: 1.7;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #eab308;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background-color: #fefce8;
          font-style: italic;
          color: #374151;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        .blog-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          color: #1f2937;
        }
        
        .blog-content pre {
          background-color: #1f2937;
          color: #10b981;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          line-height: 1.5;
        }
        
        .blog-content a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .blog-content a:hover {
          color: #1d4ed8;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .blog-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }
        
        .blog-content strong {
          font-weight: 600;
          color: #1f2937;
        }
        
        .blog-content em {
          font-style: italic;
        }
      `}</style>
    </div>
  )
}