// src/app/api/admin/dashboard/route.ts (Fixed version)
import { NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateRequest(request)

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get database connection
    let db
    try {
      db = await getDatabase()
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 500 }
      )
    }

    // Get statistics with error handling for each query
    const stats = {
      totalProperties: 0,
      totalBlogs: 0,
      totalInquiries: 0,
      newInquiries: 0,
      totalViews: 0,
      monthlyRevenue: 0,
    }

    try {
      // Get properties count
      stats.totalProperties = await db.collection("properties").countDocuments()
    } catch (error) {
      console.error('Error counting properties:', error)
    }

    try {
      // Get blogs count
      stats.totalBlogs = await db.collection("blogs").countDocuments()
    } catch (error) {
      console.error('Error counting blogs:', error)
    }

    try {
      // Get inquiries count
      stats.totalInquiries = await db.collection("inquiries").countDocuments()
    } catch (error) {
      console.error('Error counting inquiries:', error)
    }

    try {
      // Get new inquiries count
      stats.newInquiries = await db.collection("inquiries").countDocuments({ status: "new" })
    } catch (error) {
      console.error('Error counting new inquiries:', error)
    }

    try {
      // Get total views
      const viewsResult = await db.collection("properties").aggregate([
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
      ]).toArray()
      
      stats.totalViews = viewsResult[0]?.totalViews || 0
    } catch (error) {
      console.error('Error aggregating views:', error)
    }

    try {
      // Calculate monthly revenue (mock calculation)
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      const currentYear = currentDate.getFullYear()
      
      const properties = await db.collection("properties")
        .find({ 
          status: "Sold",
          updatedAt: {
            $gte: new Date(currentYear, currentMonth, 1),
            $lt: new Date(currentYear, currentMonth + 1, 1)
          }
        })
        .toArray()
      
      stats.monthlyRevenue = properties.reduce((sum, property) => {
        return sum + (property.price * 0.03) // Assuming 3% commission
      }, 0)
      
      stats.monthlyRevenue = Math.round(stats.monthlyRevenue)
    } catch (error) {
      console.error('Error calculating monthly revenue:', error)
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}