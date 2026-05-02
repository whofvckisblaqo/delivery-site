import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Admin from '@/lib/models/Admin'

export async function GET() {
  try {
    await connectDB()

    // Show all admins in database
    const admins = await Admin.find({})

    return NextResponse.json({
      count: admins.length,
      admins: admins.map(a => ({
        username: a.username,
        password: a.password,
      }))
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}