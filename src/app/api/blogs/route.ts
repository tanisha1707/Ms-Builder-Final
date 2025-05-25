/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { authenticateRequest } from "@/lib/auth"
import { calculateReadTime, generateExcerpt, slugify } from "@/lib/utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const featured = searchParams.get("featured") === "true"
    const published = searchParams.get("published") !== "false"

    const db = await getDatabase()
    const collection = db.collection("blogs")

    // Build filter
    const filter: any = { published }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ]
    }

    if (category) filter.category = category
    if (featured) filter.featured = true

    // Get total count
    const total = await collection.countDocuments(filter)

    // Get blogs with pagination
    const blogs = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get blogs error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const blogData = await request.json()

    const db = await getDatabase()
    const collection = db.collection("blogs")

    const blog = {
      ...blogData,
      slug: slugify(blogData.title),
      excerpt: blogData.excerpt || generateExcerpt(blogData.content),
      readTime: calculateReadTime(blogData.content),
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(blog)

    return NextResponse.json({
      success: true,
      data: { ...blog, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Create blog error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}