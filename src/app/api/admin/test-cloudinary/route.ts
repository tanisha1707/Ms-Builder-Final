// src/app/api/admin/test-cloudinary/route.ts
import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { validateCloudinaryConfig } from "@/lib/cloudinary"
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { test } = await request.json()

    switch (test) {
      case 'env':
        return testEnvironmentVariables()
      
      case 'connection':
        return testCloudinaryConnection()
      
      default:
        return NextResponse.json(
          { message: "Invalid test type" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Cloudinary test error:", error)
    return NextResponse.json(
      { message: "Internal server error", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function testEnvironmentVariables() {
  const requiredEnvVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ]

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar])

  if (missingVars.length > 0) {
    return NextResponse.json({
      success: false,
      message: `Missing environment variables: ${missingVars.join(', ')}`,
      data: {
        required: requiredEnvVars,
        missing: missingVars,
        configured: requiredEnvVars.filter(envVar => process.env[envVar])
      }
    })
  }

  // Validate that the config is properly set
  const isValid = validateCloudinaryConfig()

  return NextResponse.json({
    success: isValid,
    message: isValid ? 'All environment variables are configured' : 'Environment validation failed',
    data: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key_configured: !!process.env.CLOUDINARY_API_KEY,
      api_secret_configured: !!process.env.CLOUDINARY_API_SECRET,
    }
  })
}

async function testCloudinaryConnection() {
  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Test the connection by pinging the API
    const result = await cloudinary.api.ping()

    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful',
      data: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        status: result.status,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Cloudinary connection test failed:', error)
    
    let errorMessage = 'Unknown connection error'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json({
      success: false,
      message: 'Cloudinary connection failed',
      error: errorMessage,
      data: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        timestamp: new Date().toISOString()
      }
    })
  }
}