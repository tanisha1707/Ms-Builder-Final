// src/app/api/inquiries/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { authenticateRequest } from "@/lib/auth"
import { ObjectId } from "mongodb"

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
    const { status } = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid inquiry ID" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection("inquiries")

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry status updated",
    })
  } catch (error) {
    console.error("Update inquiry error:", error)
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
        { message: "Invalid inquiry ID" },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection("inquiries")

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    })
  } catch (error) {
    console.error("Delete inquiry error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}