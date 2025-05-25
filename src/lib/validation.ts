/* eslint-disable @typescript-eslint/no-explicit-any */

import { isValidEmail } from "./utils";

// src/lib/validations.ts - Validation Schemas
export const propertyValidation = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 200,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
  price: {
    required: true,
    min: 0,
    max: 100000000,
  },
  location: {
    required: true,
    minLength: 3,
    maxLength: 200,
  },
  category: {
    required: true,
    enum: ['Residential', 'Commercial', 'Apartment', 'Villa', 'Office'],
  },
  status: {
    required: true,
    enum: ['Available', 'Sold', 'Rented', 'Pending'],
  },
  bedrooms: {
    required: true,
    min: 0,
    max: 20,
  },
  bathrooms: {
    required: true,
    min: 0,
    max: 20,
  },
  area: {
    required: true,
    min: 1,
    max: 100000,
  },
}

export const blogValidation = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 200,
  },
  content: {
    required: true,
    minLength: 100,
    maxLength: 50000,
  },
  author: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  category: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
}

export const inquiryValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
  },
}

export function validateProperty(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Title validation
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long')
  }
  if (data.title && data.title.length > 200) {
    errors.push('Title must not exceed 200 characters')
  }

  // Price validation
  if (!data.price || data.price < 0) {
    errors.push('Price must be a positive number')
  }

  // Location validation
  if (!data.location || data.location.trim().length < 3) {
    errors.push('Location must be at least 3 characters long')
  }

  // Category validation
  if (!data.category || !propertyValidation.category.enum.includes(data.category)) {
    errors.push('Invalid property category')
  }

  // Status validation
  if (!data.status || !propertyValidation.status.enum.includes(data.status)) {
    errors.push('Invalid property status')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateBlog(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Title validation
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long')
  }

  // Content validation
  if (!data.content || data.content.trim().length < 100) {
    errors.push('Content must be at least 100 characters long')
  }

  // Author validation
  if (!data.author || data.author.trim().length < 2) {
    errors.push('Author name must be at least 2 characters long')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateInquiry(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  // Email validation
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please provide a valid email address')
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}