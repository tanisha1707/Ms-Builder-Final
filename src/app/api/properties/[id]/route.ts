// src/app/api/properties/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { authenticateRequest } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const collection = db.collection("properties")

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid property ID" },
        { status: 400 }
      )
    }

    const property = await collection.findOne({ _id: new ObjectId(id) })

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      )
    }

    // Increment view count
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: property,
    })
  } catch (error) {
    console.error("Get property error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request)

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const updateData = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid property ID" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection("properties")

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      )
    }

    const updatedProperty = await collection.findOne({
      _id: new ObjectId(id),
    })

    return NextResponse.json({
      success: true,
      data: updatedProperty,
    })
  } catch (error) {
    console.error("Update property error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request)

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid property ID" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection("properties")

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    })
  } catch (error) {
    console.error("Delete property error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}