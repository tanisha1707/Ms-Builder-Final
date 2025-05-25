// src/app/api/properties/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const status = searchParams.get("status") || ""
    const featured = searchParams.get("featured") === "true"
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const bedrooms = searchParams.get("bedrooms")
    const bathrooms = searchParams.get("bathrooms")
    const location = searchParams.get("location") || ""

    const db = await getDatabase()
    const collection = db.collection("properties")

    // Build filter query
    const filter: Record<string, unknown> = {}

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ]
    }

    if (category) filter.category = category
    if (status) filter.status = status
    if (featured) filter.featured = true
    if (location) filter.location = { $regex: location, $options: "i" }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) (filter.price as Record<string, number>).$gte = parseInt(minPrice)
      if (maxPrice) (filter.price as Record<string, number>).$lte = parseInt(maxPrice)
    }

    if (bedrooms && bedrooms !== "Any") {
      if (bedrooms === "5+") {
        filter.bedrooms = { $gte: 5 }
      } else {
        filter.bedrooms = parseInt(bedrooms)
      }
    }

    if (bathrooms && bathrooms !== "Any") {
      if (bathrooms === "4+") {
        filter.bathrooms = { $gte: 4 }
      } else {
        filter.bathrooms = parseInt(bathrooms)
      }
    }

    // Build sort query
    const sort: Record<string, 1 | -1> = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    // Get total count
    const total = await collection.countDocuments(filter)

    // Get properties with pagination
    const properties = await collection
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get properties error:", error)
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

    const propertyData = await request.json()

    const db = await getDatabase()
    const collection = db.collection("properties")

    const property = {
      ...propertyData,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(property)

    return NextResponse.json({
      success: true,
      data: { ...property, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Create property error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}