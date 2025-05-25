// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  format: string
  width: number
  height: number
  bytes: number
  created_at: string
  resource_type: string
  folder?: string
}

interface CloudinaryTransformation {
  width?: number
  height?: number
  crop?: string
  quality?: string | number
  fetch_format?: string
  gravity?: string
  [key: string]: string | number | undefined
}

interface UploadOptions {
  folder?: string
  transformation?: CloudinaryTransformation[]
  public_id?: string
  overwrite?: boolean
  resource_type?: 'image' | 'video' | 'raw' | 'auto'
  format?: string
  quality?: string | number
}

interface CloudinaryUploadOptions {
  folder?: string
  resource_type?: 'image' | 'video' | 'raw' | 'auto'
  quality?: string | number
  fetch_format?: string
  transformation?: CloudinaryTransformation[]
  public_id?: string
  overwrite?: boolean
  [key: string]: string | number | boolean | CloudinaryTransformation[] | undefined
}

interface DeleteResult {
  result: string
  [key: string]: string | number | undefined
}

interface ResponsiveImageUrls {
  thumbnail: string
  small: string
  medium: string
  large: string
  original: string
}

/**
 * Upload an image to Cloudinary
 * @param file - Buffer or base64 string of the file
 * @param folder - Optional folder name to organize uploads
 * @param options - Additional Cloudinary upload options
 * @returns Promise with upload result
 */
export async function uploadImage(
  file: Buffer | string,
  folder: string = 'msbuilders',
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  try {
    const uploadOptions: CloudinaryUploadOptions = {
      folder,
      resource_type: 'auto',
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options,
    }

    // Convert buffer to base64 if needed
    let fileData: string
    if (Buffer.isBuffer(file)) {
      fileData = `data:image/jpeg;base64,${file.toString('base64')}`
    } else {
      fileData = file
    }

    const result = await cloudinary.uploader.upload(fileData, uploadOptions)
    
    return result as CloudinaryUploadResult
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of buffers or base64 strings
 * @param folder - Optional folder name
 * @param options - Additional upload options
 * @returns Promise with array of upload results
 */
export async function uploadMultipleImages(
  files: (Buffer | string)[],
  folder: string = 'msbuilders',
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult[]> {
  try {
    const uploadPromises = files.map((file, index) => 
      uploadImage(file, folder, {
        ...options,
        public_id: options.public_id ? `${options.public_id}_${index}` : undefined,
      })
    )

    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Multiple upload error:', error)
    throw new Error('Failed to upload multiple images')
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 * @param resourceType - Type of resource (image, video, etc.)
 * @returns Promise with deletion result
 */
export async function deleteImage(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<DeleteResult> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })
    
    return result as DeleteResult
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}

/**
 * Get optimized image URL with transformations
 * @param publicId - The public ID of the image
 * @param transformations - Cloudinary transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  transformations: CloudinaryTransformation = {}
): string {
  const defaultTransformations = {
    quality: 'auto:good',
    fetch_format: 'auto',
    ...transformations,
  }

  return cloudinary.url(publicId, defaultTransformations)
}

/**
 * Generate thumbnail URL
 * @param publicId - The public ID of the image
 * @param width - Thumbnail width
 * @param height - Thumbnail height
 * @returns Thumbnail URL
 */
export function getThumbnailUrl(
  publicId: string,
  width: number = 400,
  height: number = 300
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto',
  })
}

/**
 * Generate responsive image URLs for different screen sizes
 * @param publicId - The public ID of the image
 * @returns Object with different sized image URLs
 */
export function getResponsiveImageUrls(publicId: string): ResponsiveImageUrls {
  const baseTransformations: CloudinaryTransformation = {
    quality: 'auto:good',
    fetch_format: 'auto',
    crop: 'fill',
  }

  return {
    thumbnail: cloudinary.url(publicId, {
      ...baseTransformations,
      width: 400,
      height: 300,
    }),
    small: cloudinary.url(publicId, {
      ...baseTransformations,
      width: 600,
      height: 400,
    }),
    medium: cloudinary.url(publicId, {
      ...baseTransformations,
      width: 800,
      height: 600,
    }),
    large: cloudinary.url(publicId, {
      ...baseTransformations,
      width: 1200,
      height: 800,
    }),
    original: cloudinary.url(publicId, {
      quality: 'auto:good',
      fetch_format: 'auto',
    }),
  }
}

/**
 * Upload image with automatic optimization for web
 * @param file - Buffer or base64 string of the file
 * @param folder - Optional folder name
 * @param filename - Optional custom filename
 * @returns Promise with upload result including optimized URLs
 */
export async function uploadOptimizedImage(
  file: Buffer | string,
  folder: string = 'msbuilders',
  filename?: string
): Promise<CloudinaryUploadResult & { optimizedUrls: ResponsiveImageUrls }> {
  try {
    const uploadOptions: UploadOptions = {
      folder,
      resource_type: 'auto',
      quality: 'auto:good',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    }

    if (filename) {
      uploadOptions.public_id = filename
    }

    const result = await uploadImage(file, folder, uploadOptions)
    const optimizedUrls = getResponsiveImageUrls(result.public_id)

    return {
      ...result,
      optimizedUrls,
    }
  } catch (error) {
    console.error('Optimized upload error:', error)
    throw new Error('Failed to upload optimized image')
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Public ID
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const regex = /\/([^\/]+)\.[a-z]+$/i
    const match = url.match(regex)
    return match ? match[1] : null
  } catch (error) {
    console.error('Error extracting public ID:', error)
    return null
  }
}

/**
 * Validate Cloudinary configuration
 * @returns Boolean indicating if configuration is valid
 */
export function validateCloudinaryConfig(): boolean {
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ]

  return requiredEnvVars.every(envVar => {
    const value = process.env[envVar]
    if (!value) {
      console.error(`Missing required environment variable: ${envVar}`)
      return false
    }
    return true
  })
}

// Preset transformations for common use cases
export const TRANSFORMATIONS = {
  // Property images
  PROPERTY_HERO: {
    width: 1200,
    height: 800,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  PROPERTY_THUMBNAIL: {
    width: 400,
    height: 300,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  PROPERTY_GALLERY: {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  
  // Blog images
  BLOG_HERO: {
    width: 1200,
    height: 630,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  BLOG_THUMBNAIL: {
    width: 400,
    height: 250,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
  
  // Avatar/profile images
  AVATAR: {
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
} as const

export default cloudinary