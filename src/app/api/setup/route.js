import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Admin from '@/lib/models/Admin'

export async function GET() {
  try {
    await connectDB()

    // Check if admin already exists
    const existing = await Admin.findOne({ username: 'admin' })
    if (existing) {
      return NextResponse.json({ message: 'Admin already exists' })
    }

    // Create admin
    await Admin.create({
      username: 'admin',
      password: 'richlife1',
    })

    return NextResponse.json({ message: 'Admin created successfully! You can now login with password: fastdrop2024' })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}