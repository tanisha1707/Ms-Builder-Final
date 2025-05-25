// src/app/api/setup/admin/route.ts
import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword } from "@/lib/auth"

export async function POST() {
  try {
    const db = await getDatabase()
    
    // Check if admin user already exists
    const existingAdmin = await db.collection('users').findOne({ 
      email: 'admin@msbuilders.com' 
    })
    
    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists!',
        user: {
          email: existingAdmin.email,
          role: existingAdmin.role,
          createdAt: existingAdmin.createdAt
        }
      })
    }
    
    // Create admin user
    const hashedPassword = await hashPassword('admin123456')
    
    const adminUser = {
      email: 'admin@msbuilders.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    }
    
    const result = await db.collection('users').insertOne(adminUser)
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      user: {
        id: result.insertedId,
        email: 'admin@msbuilders.com',
        role: 'admin',
        createdAt: adminUser.createdAt
      }
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to create admin user',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}