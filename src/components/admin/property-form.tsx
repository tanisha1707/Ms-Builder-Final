"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { X, Upload, Plus, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LoadingSpinner from "@/components/ui/loading-spinner"
import type { Property } from "@/types"

interface PropertyFormProps {
  property?: Property
  isEditing?: boolean
}

export default function PropertyForm({ property, isEditing = false }: PropertyFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price ? String(property.price) : "",
    location: property?.location || "",
    category: property?.category || "Residential",
    status: property?.status || "Available",
    bedrooms: property?.bedrooms ? String(property.bedrooms) : "",
    bathrooms: property?.bathrooms ? String(property.bathrooms) : "",
    area: property?.area ? String(property.area) : "",
    yearBuilt: property?.yearBuilt ? String(property.yearBuilt) : String(new Date().getFullYear()),
    parking: property?.parking ? String(property.parking) : "",
    furnished: property?.furnished || false,
    petFriendly: property?.petFriendly || false,
    featured: property?.featured || false,
    video: property?.video || "",
  })

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(property?.features || [])
  const [customFeatures, setCustomFeatures] = useState<string[]>([])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(property?.amenities || [])
  const [customAmenities, setCustomAmenities] = useState<string[]>([])
  const [images, setImages] = useState<string[]>(property?.images || [])
  const [uploadingImages, setUploadingImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const categories = ["Residential", "Commercial", "Apartment", "Villa", "Office"]
  const statuses = ["Available", "Sold", "Rented", "Pending"]

  const predefinedFeatures = [
    "Modular Kitchen", "Private Garden", "Central Air", "Balcony", "Fireplace", "Pooja Room",
    "Stainless Steel Appliances", "Granite Countertops",
    "Security System", "Smart Home Features","Lift",
     "Home Office","Fire Safety Systems", "Store Room"
  ]

  const predefinedAmenities = [
    "Swimming Pool", "CCTV surveillance","Gym", "Parking", "Wi-Fi", "Banquet Hall",
    "Elevator", "Clubhouse","Playground", "Tennis Court", "Basketball Court", 
    "Hot Tub", "Rooftop Terrace", "BBQ Area", "Bike Storage", "Pet Park",
    "Community Garden", "Guest Suite", "On-Site Laundry", "Storage Units",
    "Electric Vehicle Charging","Movie Theater", "Yoga Studio",
    "Game Room","Indoor Games"
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    validateForm({ ...formData, [name]: value })
  }

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === "" ? "" : String(Number(value) || 0)
    }))
    validateForm({ ...formData, [name]: value })
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handleCustomFeatureAdd = (value: string) => {
    if (value.trim() && !customFeatures.includes(value.trim())) {
      setCustomFeatures(prev => [...prev, value.trim()])
      setSelectedFeatures(prev => [...prev, value.trim()])
    }
  }

  const handleCustomFeatureRemove = (index: number) => {
    const feature = customFeatures[index]
    setCustomFeatures(prev => prev.filter((_, i) => i !== index))
    setSelectedFeatures(prev => prev.filter(f => f !== feature))
  }

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const handleCustomAmenityAdd = (value: string) => {
    if (value.trim() && !customAmenities.includes(value.trim())) {
      setCustomAmenities(prev => [...prev, value.trim()])
      setSelectedAmenities(prev => [...prev, value.trim()])
    }
  }

  const handleCustomAmenityRemove = (index: number) => {
    const amenity = customAmenities[index]
    setCustomAmenities(prev => prev.filter((_, i) => i !== index))
    setSelectedAmenities(prev => prev.filter(a => a !== amenity))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024
      
      if (!isValidType) {
        setError(`Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`)
        return false
      }
      
      if (!isValidSize) {
        setError(`File too large: ${file.name}. Maximum size is 5MB.`)
        return false
      }
      
      return true
    })
    
    if (validFiles.length > 0) {
      setUploadingImages(prev => [...prev, ...validFiles])
      setError("")
      validateForm(formData, [...images, ...validFiles.map(f => f.name)])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const updatedImages = prev.filter((_, i) => i !== index)
      validateForm(formData, updatedImages)
      return updatedImages
    })
  }

  const removeUploadingImage = (index: number) => {
    setUploadingImages(prev => prev.filter((_, i) => i !== index))
    const updatedUploadingImages = uploadingImages.filter((_, i) => i !== index)
    // Combine current images and uploadingImages file names for validation
    const imagesToValidate = [...images, ...updatedUploadingImages.map(f => f.name)]
    validateForm(formData, imagesToValidate)
  }

  const validateForm = (data: typeof formData, imagesToValidate = images) => {
    const errors: string[] = []

    if (!data.title.trim()) errors.push("Property title is required")
    if (!data.description.trim()) errors.push("Property description is required")
    if (!data.location.trim()) errors.push("Property location is required")
    if (!data.price || Number(data.price) <= 0) errors.push("Property price must be greater than 0")
    if (imagesToValidate.length === 0 && uploadingImages.length === 0) errors.push("At least one property image is required")
    if (!data.bedrooms || Number(data.bedrooms) < 0) errors.push("Bedrooms must be 0 or greater")
    if (!data.bathrooms || Number(data.bathrooms) < 0) errors.push("Bathrooms must be 0 or greater")
    if (!data.area || Number(data.area) <= 0) errors.push("Area must be greater than 0")

    setValidationErrors(errors)
    return errors.length === 0
  }

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "properties")

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to upload image")
        }

        const data = await response.json()
        return data.url
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
        throw error
      }
    })

    return Promise.all(uploadPromises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!validateForm(formData)) {
      setError("Please fix the validation errors before submitting")
      setLoading(false)
      return
    }

    try {
      let allImages = [...images]
      if (uploadingImages.length > 0) {
        try {
          const uploadedUrls = await uploadImages(uploadingImages)
          allImages = [...allImages, ...uploadedUrls]
          setUploadingImages([])
        } catch (error) {
          console.error("Image upload error:", error)
          setError("Failed to upload one or more images. Please try again.")
          setLoading(false)
          return
        }
      }

      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area) || 0,
        yearBuilt: Number(formData.yearBuilt) || new Date().getFullYear(),
        parking: Number(formData.parking) || 0,
        features: [...selectedFeatures],
        amenities: [...selectedAmenities],
        images: allImages,
      }

      const url = isEditing ? `/api/properties/${property?._id}` : "/api/properties"
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
        console.log("Property saved successfully")
        router.push("/admin/properties")
      } else {
        const data = await response.json()
        console.error("API error:", data)
        setError(data.message || "Failed to save property")
      }
    } catch (error) {
      console.error("Error saving property:", error)
      setError("An error occurred while saving the property")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="list-disc ml-5">
            {validationErrors.map((err, index) => (
              <li key={index} className="text-black">{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic Information */}
      <Card className="bg-white border-gray-300">
        <CardHeader>
          <CardTitle className="text-black">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Property title"
                className="bg-white border-gray-300 text-black placeholder-gray-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1 text-black">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                aria-label="Property Category"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Price (₹) *</label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleNumericInputChange}
                required
                min="1"
                className="bg-white border-gray-300 text-black placeholder-gray-500"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1 text-black">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
                aria-label="Property Status"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Location *</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="Property location"
              className="bg-white border-gray-300 text-black placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Description *</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Property description"
              className="bg-white border-gray-300 text-black placeholder-gray-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Property Details */}
      <Card className="bg-white border-gray-300">
        <CardHeader>
          <CardTitle className="text-black">Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">Bedrooms *</label>
              <Input
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleNumericInputChange}
                min="0"
                required
                className="bg-white border-gray-300 text-black placeholder-gray-500"
                placeholder="Enter bedrooms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Bathrooms *</label>
              <Input
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleNumericInputChange}
                min="0"
                step="0.5"
                required
                className="bg-white border-gray-300 text-black placeholder-gray-500"
                placeholder="Enter bathrooms"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Area (sqft) *</label>
              <Input
                name="area"
                type="number"
                value={formData.area}
                onChange={handleNumericInputChange}
                min="1"
                required
                className="bg-white border-gray-300 text-black placeholder-gray-500"
                placeholder="Enter area"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Year Built</label>
              <Input
                name="yearBuilt"
                type="number"
                value={formData.yearBuilt}
                onChange={handleNumericInputChange}
                min="1800"
                max={new Date().getFullYear() + 5}
                className="bg-white border-gray-300 text-black placeholder-gray-500"
                placeholder="Enter year"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">Parking Spaces</label>
              <Input
                name="parking"
                type="number"
                value={formData.parking}
                onChange={handleNumericInputChange}
                min="0"
                className="bg-white border-gray-300 text-black placeholder-gray-500"
                placeholder="Enter parking"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-black">Video URL (optional)</label>
            <Input
              name="video"
              value={formData.video}
              onChange={handleInputChange}
              placeholder="YouTube or Vimeo URL"
              className="bg-white border-gray-300 text-black placeholder-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center text-black">
              <input
                type="checkbox"
                name="furnished"
                checked={formData.furnished}
                onChange={handleInputChange}
                className="mr-2"
              />
              Furnished
            </label>

            <label className="flex items-center text-black">
              <input
                type="checkbox"
                name="petFriendly"
                checked={formData.petFriendly}
                onChange={handleInputChange}
                className="mr-2"
              />
              Pet Friendly
            </label>

            <label className="flex items-center text-black">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="mr-2"
              />
              Featured Property
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="bg-white border-gray-300">
        <CardHeader>
          <CardTitle className="text-black">Property Images *</CardTitle>
          <p className="text-sm text-gray-500">
            Upload high-quality images. Maximum 5MB per image. Supported formats: JPEG, PNG, WebP
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <Image
                  src={image}
                  alt={`Property ${index + 1}`}
                  width={200}
                  height={150}
                  className="object-cover rounded-md w-full h-32"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white border-yellow-500 text-black hover:bg-yellow-100"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}

            {uploadingImages.map((file, index) => (
              <div key={`uploading-${index}`} className="relative group">
                <div className="w-full h-32 bg-gray-100 rounded-md flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                  <LoadingSpinner size="sm" />
                  <p className="text-xs mt-1 text-gray-500 truncate px-2">{file.name}</p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-white border-yellow-500 text-black hover:bg-yellow-100"
                  onClick={() => removeUploadingImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border-yellow-500 text-black hover:bg-yellow-100 hover:shadow-lg transform transition hover:scale-105"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
          
          {images.length === 0 && uploadingImages.length === 0 && (
            <p className="text-sm text-red-600 mt-2">At least one image is required</p>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-white border-gray-300">
        <CardHeader>
          <CardTitle className="text-black">Property Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {predefinedFeatures.map((feature) => (
              <label key={feature} className="flex items-center text-black">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="mr-2"
                />
                {feature}
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-black">Custom Features</p>
            {customFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={feature}
                  disabled
                  className="bg-white border-gray-300 text-black"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCustomFeatureRemove(index)}
                  className="bg-white border-yellow-500 text-black hover:bg-yellow-100 hover:shadow-lg transform transition hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Add custom feature"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleCustomFeatureAdd(e.currentTarget.value)
                    e.currentTarget.value = ""
                  }
                }}
                className="bg-white border-gray-300 text-black placeholder-gray-500"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add custom feature"]') as HTMLInputElement
                  if (input?.value) {
                    handleCustomFeatureAdd(input.value)
                    input.value = ""
                  }
                }}
                className="bg-white border-yellow-500 text-black hover:bg-yellow-100 hover:shadow-lg transform transition hover:scale-105"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card className="bg-white border-gray-300">
        <CardHeader>
          <CardTitle className="text-black">Property Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
            {predefinedAmenities.map((amenity) => (
              <label key={amenity} className="flex items-center text-black">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="mr-2"
                />
                {amenity}
              </label>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-black">Custom Amenities</p>
            {customAmenities.map((amenity, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={amenity}
                  disabled
                  className="bg-white border-gray-300 text-black"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCustomAmenityRemove(index)}
                  className="bg-white border-yellow-500 text-black hover:bg-yellow-100 hover:shadow-lg transform transition hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Add custom amenity"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleCustomAmenityAdd(e.currentTarget.value)
                    e.currentTarget.value = ""
                  }
                }}
                className="bg-white border-gray-300 text-black placeholder-gray-500"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Add custom amenity"]') as HTMLInputElement
                  if (input?.value) {
                    handleCustomAmenityAdd(input.value)
                    input.value = ""
                  }
                }}
                className="bg-white border-yellow-500 text-black hover:bg-yellow-100 hover:shadow-lg transform transition hover:scale-105"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/properties")}
          disabled={loading}
          className="bg-white border-yellow-500 text-black hover:bg-yellow-100 hover:shadow-lg transform transition hover:scale-105"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || validationErrors.length > 0}
          className="bg-yellow-500 hover:bg-yellow-600 text-black hover:shadow-lg transform transition hover:scale-105 disabled:bg-yellow-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            isEditing ? "Update Property" : "Create Property"
          )}
        </Button>
      </div>
    </form>
  )
}