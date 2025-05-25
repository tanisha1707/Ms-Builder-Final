// src/app/api/inquiries/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") || ""
    const type = searchParams.get("type") || ""

    const db = await getDatabase()
    const collection = db.collection("inquiries")

    // Build filter
    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (type) filter.type = type

    // Get total count
    const total = await collection.countDocuments(filter)

    // Get inquiries with pagination
    const inquiries = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get inquiries error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const inquiryData = await request.json()

    const { name, email, phone, message, propertyId, propertyTitle, type } = inquiryData

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection("inquiries")

    const inquiry = {
      name,
      email,
      phone: phone || "",
      message,
      propertyId: propertyId || null,
      propertyTitle: propertyTitle || null,
      type: type || "general",
      status: "new",
      createdAt: new Date(),
    }

    const result = await collection.insertOne(inquiry)

    return NextResponse.json({
      success: true,
      data: { ...inquiry, _id: result.insertedId },
      message: "Inquiry submitted successfully",
    })
  } catch (error) {
    console.error("Create inquiry error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}