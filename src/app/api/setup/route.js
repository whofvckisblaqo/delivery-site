import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Admin from '@/lib/models/Admin'

export async function GET() {
  try {
    await connectDB()

    // Force delete ALL admins first
    const deleted = await Admin.deleteMany({})
    console.log('Deleted:', deleted.deletedCount)

    // Create fresh admin with new password
    const admin = await Admin.create({
      username: 'admin',
      password: 'richlife1',
    })

    return NextResponse.json({
      message: 'Done! Login with password: richlife1',
      deleted: deleted.deletedCount,
      created: admin.username,
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}