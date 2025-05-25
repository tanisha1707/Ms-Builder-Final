// src/types/index.ts - Complete Types File
export interface Property {
  _id?: string
  id?: string
  title: string
  description: string
  price: number
  location: string
  category: 'Residential' | 'Commercial' | 'Apartment' | 'Villa' | 'Office'
  status: 'Available' | 'Sold' | 'Rented' | 'Pending'
  bedrooms: number
  bathrooms: number
  area: number
  yearBuilt?: number
  features: string[]
  images: string[]
  video?: string
  amenities: string[]
  parking?: number
  furnished: boolean
  petFriendly: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
  views: number
}

export interface Blog {
  _id?: string
  id?: string
  title: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  image: string
  featured: boolean
  published: boolean
  readTime: number
  createdAt: Date
  updatedAt: Date
  views: number
  slug?: string
}

export interface Inquiry {
  _id?: string
  id?: string
  propertyId?: string
  name: string
  email: string
  phone: string
  message: string
  type: 'property' | 'general'
  status: 'new' | 'contacted' | 'resolved'
  createdAt: Date
  propertyTitle?: string
}

export interface User {
  _id?: string
  id?: string
  email: string
  password: string
  name: string
  role: 'admin'
  createdAt: Date
  lastLogin: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface DashboardStats {
  totalProperties: number
  totalBlogs: number
  totalInquiries: number
  newInquiries: number
  totalViews: number
  monthlyRevenue: number
}

// Form interfaces
export interface PropertyFormData {
  title: string
  description: string
  price: number
  location: string
  category: string
  status: string
  bedrooms: number
  bathrooms: number
  area: number
  yearBuilt?: number
  parking?: number
  furnished: boolean
  petFriendly: boolean
  featured: boolean
  video?: string
}

export interface BlogFormData {
  title: string
  content: string
  excerpt: string
  author: string
  category: string
  featured: boolean
  published: boolean
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  propertyInterest: string
  message: string
}

export interface InquiryFormData {
  name: string
  email: string
  phone: string
  message: string
  propertyId?: string
  propertyTitle?: string
  type: 'property' | 'general'
}