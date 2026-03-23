import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req) {
  try {
    // 1. Get the password sent from the login form
    const { password } = await req.json()

    // 2. Look for the Admin in your MySQL database
    const admin = await prisma.admin.findFirst()

    // 3. HANDLE THE "FIRST TIME" LOGIN
    // If the database table is empty (no admin yet), 
    // we allow the default password to create the first record.
    if (!admin) {
      if (password === 'fastdrop2024') {
        // Create the admin record automatically so it's ready for future changes
        await prisma.admin.create({
          data: {
            username: 'admin',
            password: 'fastdrop2024'
          }
        })
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 })
    }

    // 4. THE EFFECTIVE CHECK
    // Compare what the user typed with what is stored in the database
    if (admin.password === password) {
      return NextResponse.json({ success: true })
    }

    // If it doesn't match, block access
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })

  } catch (error) {
    console.error("Login API Error:", error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}