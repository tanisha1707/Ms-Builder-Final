// src/components/admin/blog-form.tsx
"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Upload, Plus, Trash2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import RichTextEditor from "./rich-text-editor"
import type { Blog } from "@/types"

interface BlogFormProps {
  blog?: Blog
  isEditing?: boolean
}

export default function BlogForm({ blog, isEditing = false }: BlogFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: blog?.title || "",
    content: blog?.content || "",
    excerpt: blog?.excerpt || "",
    author: blog?.author || "",
    category: blog?.category || "Real Estate",
    featured: blog?.featured || false,
    published: blog?.published !== false,
  })

  const [tags, setTags] = useState<string[]>(blog?.tags || [""])
  const [image, setImage] = useState<string>(blog?.image || "")
  const [uploadingImage, setUploadingImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [autoGeneratingExcerpt, setAutoGeneratingExcerpt] = useState(false)

  const categories = [
    "Real Estate",
    "Market Trends",
    "Investment Tips",
    "Home Buying",
    "Property Management",
    "Legal Advice",
    "Lifestyle",
    "News"
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingImage(file)
    }
  }

  const addTag = () => {
    setTags(prev => [...prev, ""])
  }

  const updateTag = (index: number, value: string) => {
    setTags(prev => prev.map((item, i) => i === index ? value : item))
  }

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "blogs")

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.url
  }

  const generateExcerpt = (content: string) => {
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    return textContent.length > 150 ? textContent.substring(0, 150) + '...' : textContent
  }

  const autoGenerateExcerpt = () => {
    if (formData.content) {
      setAutoGeneratingExcerpt(true)
      setTimeout(() => {
        const excerpt = generateExcerpt(formData.content)
        setFormData(prev => ({ ...prev, excerpt }))
        setAutoGeneratingExcerpt(false)
      }, 1000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let imageUrl = image
      if (uploadingImage) {
        imageUrl = await uploadImage(uploadingImage)
      }

      const excerpt = formData.excerpt || generateExcerpt(formData.content)

      const payload = {
        ...formData,
        excerpt,
        tags: tags.filter(t => t.trim() !== ""),
        image: imageUrl,
      }

      const url = isEditing ? `/api/blogs/${blog?._id}` : "/api/blogs"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push("/admin/blogs")
      } else {
        const data = await response.json()
        setError(data.message || "Failed to save blog")
      }
    } catch (error) {
      console.error("Error saving blog:", error)
      setError("An error occurred while saving the blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
{error && (
  <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
    <strong>Error:</strong> {error}
  </div>
)}

          {formData.title && formData.content && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
              <strong>✓ Looking good!</strong> Your blog post is ready to {isEditing ? 'update' : 'publish'}.
            </div>
          )}

          {/* Basic Information */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200">
              <CardTitle className="text-gray-900 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-600" />
                Blog Information
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Start with the basic details about your blog post
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-6 bg-white">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter an engaging and SEO-friendly title"
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be displayed as the main heading on your blog
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    placeholder="Author name"
                    className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Excerpt / Summary
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={autoGenerateExcerpt}
                    disabled={!formData.content || autoGeneratingExcerpt}
                    className="border-gray-300 hover:bg-yellow-50 hover:border-yellow-500 text-xs"
                  >
                    {autoGeneratingExcerpt ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-1" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        Auto-Generate
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Brief description that will appear in search results and blog previews..."
                  className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to auto-generate from content. Ideal length: 120-160 characters.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rich Text Content Editor */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <CardTitle className="text-gray-900">Blog Content</CardTitle>
              <p className="text-gray-600 text-sm">
                Create your content using our advanced rich text editor with formatting, media, and more.
              </p>
            </CardHeader>
            <CardContent className="p-0 bg-white">
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="Start writing your amazing blog post here... Use the toolbar above for formatting, links, images, and more!"
                minHeight="600px"
              />
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200">
              <CardTitle className="text-gray-900">Featured Image</CardTitle>
              <p className="text-gray-600 text-sm">
                Add a compelling featured image that represents your blog content
              </p>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              {(image || uploadingImage) && (
                <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                  {uploadingImage ? (
                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <LoadingSpinner size="sm" className="mb-2" />
                        <p className="text-sm text-gray-600">Uploading image...</p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={image}
                      alt="Blog featured image"
                      fill
                      className="object-cover"
                    />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8"
                    onClick={() => {
                      setImage("")
                      setUploadingImage(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-gray-300 hover:bg-yellow-50 hover:border-yellow-500"
              >
                <Upload className="h-4 w-4 mr-2" />
                {image ? 'Change Featured Image' : 'Upload Featured Image'}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: 1200x630px for optimal social media sharing
              </p>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200">
              <CardTitle className="text-gray-900">Tags & Keywords</CardTitle>
              <p className="text-gray-600 text-sm">
                Add relevant tags to help readers discover your content
              </p>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="space-y-3">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1">
                      <Input
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        placeholder={`Tag ${index + 1} (e.g., real estate, investment)`}
                        className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeTag(index)}
                      className="border-gray-300 hover:bg-red-50 hover:border-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                className="mt-4 border-gray-300 hover:bg-yellow-50 hover:border-yellow-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Tag
              </Button>
              
              <div className="mt-3 text-xs text-gray-500">
                <strong>Tip:</strong> Use 3-5 relevant tags for better SEO and discoverability
              </div>
            </CardContent>
          </Card>

          {/* Publication Settings */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="bg-white border-b border-gray-200">
              <CardTitle className="text-gray-900">Publication Settings</CardTitle>
              <p className="text-gray-600 text-sm">
                Control how and when your blog post is published
              </p>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="space-y-4">
                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-gray-900 font-medium">Featured Blog Post</span>
                    <p className="text-sm text-gray-600">
                      Mark as featured to highlight this post on the homepage and blog listing
                    </p>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-gray-900 font-medium">Publish Immediately</span>
                    <p className="text-sm text-gray-600">
                      Make this post visible to visitors right away. Uncheck to save as draft.
                    </p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/blogs")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8"
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData(prev => ({ ...prev, published: false }))
                handleSubmit(new Event("submit") as unknown as React.FormEvent)
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8"
              disabled={loading}
            >
              Save as Draft
            </Button>
            
            <Button 
              type="submit" 
              disabled={loading || !formData.title || !formData.content}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 font-medium"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {isEditing ? 'Updating...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Blog Post" : formData.published ? "Publish Blog Post" : "Save Draft"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      </div>
    )
  }