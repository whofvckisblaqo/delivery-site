import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Admin from '@/lib/models/Admin'

export async function GET() {
  try {
    await connectDB()

    await Admin.deleteMany({})

    await Admin.create({
      username: 'admin',
      password: 'richlife1',
    })

    return NextResponse.json({ message: 'Admin created!' })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}