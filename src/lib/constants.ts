// src/lib/constants.ts - Application Constants
export const APP_CONFIG = {
  name: "MSBUILDER'S",
  description: "Premium Real Estate Company",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  email: "info@msbuilders.com",
  phone: "+1 (555) 123-4567",
  address: "123 Real Estate Avenue, Building District, City 10001",
  social: {
    facebook: "https://facebook.com/msbuilders",
    instagram: "https://instagram.com/msbuilders",
    twitter: "https://twitter.com/msbuilders",
    linkedin: "https://linkedin.com/company/msbuilders",
  },
}

export const PROPERTY_CATEGORIES = [
  "Residential",
  "Commercial", 
  "Apartment",
  "Villa",
  "Office",
] as const

export const PROPERTY_STATUSES = [
  "Available",
  "Sold",
  "Rented", 
  "Pending",
] as const

export const BLOG_CATEGORIES = [
  "Real Estate",
  "Market Trends",
  "Investment Tips",
  "Home Buying",
  "Property Management",
  "Legal Advice",
  "Lifestyle",
  "News",
] as const

export const INQUIRY_TYPES = [
  "property",
  "general",
] as const

export const INQUIRY_STATUSES = [
  "new",
  "contacted",
  "resolved",
] as const

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 12,
  maxLimit: 100,
}

export const IMAGE_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  dimensions: {
    property: {
      width: 1200,
      height: 800,
    },
    blog: {
      width: 1200,
      height: 630,
    },
    thumbnail: {
      width: 400,
      height: 300,
    },
  },
}

export const API_ENDPOINTS = {
  properties: "/api/properties",
  blogs: "/api/blogs",
  inquiries: "/api/inquiries",
  upload: "/api/upload",
  auth: {
    login: "/api/auth/login",
    verify: "/api/auth/verify",
  },
  admin: {
    dashboard: "/api/admin/dashboard",
  },
}

export const ROUTES = {
  home: "/",
  properties: "/properties",
  blogs: "/blogs",
  categories: "/categories",
  contact: "/contact",
  admin: {
    dashboard: "/admin",
    login: "/admin/login",
    properties: "/admin/properties",
    blogs: "/admin/blogs",
    inquiries: "/admin/inquiries",
  },
}

export const SEO_DEFAULTS = {
  title: "MSBUILDER'S - Premium Real Estate",
  description: "Discover premium properties with MSBUILDER'S real estate company. Find your perfect home, investment property, or commercial space.",
  keywords: "real estate, properties, homes, apartments, villas, commercial, MSBUILDER'S",
  image: "/images/og-image.jpg",
}