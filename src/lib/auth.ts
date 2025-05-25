// src/lib/auth.ts (Fixed version without errors)
import { NextRequest } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import { getDatabase } from './mongodb'
import { ObjectId } from 'mongodb'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-here'
)

export interface User {
  _id: string
  email: string
  role: 'admin' | 'user'
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthenticatedUser {
  userId: string
  email: string
  role: 'admin' | 'user'
}

interface DatabaseUser {
  _id: ObjectId
  email: string
  role: 'admin' | 'user'
  name?: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(token, JWT_SECRET)
  return payload
}

export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get token from headers or cookies
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('auth-token')?.value

    if (!token) {
      return null
    }

    // Verify the token
    const payload = await verifyToken(token)
    
    if (!payload.userId || typeof payload.userId !== 'string') {
      return null
    }

    // Get user from database to ensure they still exist
    try {
      const db = await getDatabase()
      const user = await db.collection('users').findOne({ 
        _id: new ObjectId(payload.userId) 
      }) as DatabaseUser | null
      
      if (!user) {
        return null
      }

      return {
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      }
    } catch (dbError) {
      console.error('Database error in authenticateRequest:', dbError)
      return null
    }
  } catch (authError) {
    console.error('Authentication error:', authError)
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const db = await getDatabase()
    const user = await db.collection('users').findOne({ email }) as DatabaseUser | null

    if (!user) {
      return null
    }

    const isValid = await verifyPassword(password, user.password)
    
    if (!isValid) {
      return null
    }

    // Return user without password
    return {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  } catch (authError) {
    console.error('Authentication error:', authError)
    return null
  }
}

export async function createUser(
  email: string, 
  password: string, 
  role: 'admin' | 'user' = 'user',
  name?: string
): Promise<User> {
  const db = await getDatabase()
  
  // Check if user already exists
  const existingUser = await db.collection('users').findOne({ email })
  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await hashPassword(password)
  
  const newUser = {
    email,
    password: hashedPassword,
    role,
    name,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await db.collection('users').insertOne(newUser)
  
  // Return user without password
  return {
    _id: result.insertedId.toString(),
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt
  }
}