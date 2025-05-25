// scripts/create-admin.ts
import { getDatabase } from '@/lib/mongodb'
import { hashPassword } from '@/lib/auth'

async function createAdminUser() {
  try {
    const db = await getDatabase()
    
    // Check if admin user already exists
    const existingAdmin = await db.collection('users').findOne({ 
      email: 'admin@msbuilders.com' 
    })
    
    if (existingAdmin) {
      console.log('Admin user already exists!')
      return
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
    
    console.log('Admin user created successfully!')
    console.log('User ID:', result.insertedId)
    console.log('Email: admin@msbuilders.com')
    console.log('Password: admin123456')
    
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }
}

createAdminUser()