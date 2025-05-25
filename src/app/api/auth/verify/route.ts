// src/app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)

    if (!user) {
      console.log('Token verification failed: No user found')
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log('Token verification successful for user:', user.email)

    // Get complete user data from database
    try {
      const db = await getDatabase()
      const fullUser = await db.collection('users').findOne(
        { _id: new ObjectId(user.userId) },
        { projection: { password: 0 } } // Exclude password field
      )

      if (!fullUser) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        user: {
          id: fullUser._id.toString(),
          email: fullUser.email,
          name: fullUser.name || null,
          role: fullUser.role,
        },
      })
    } catch (dbError) {
      console.error("Database error in verify route:", dbError)
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 }
    )
  }
}