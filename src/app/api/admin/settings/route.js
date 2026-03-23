import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req) {
  try {
    const { current, new: newPassword } = await req.json()

    // 1. Get the admin (assuming only one exists)
    const admin = await prisma.admin.findFirst()

    if (!admin) {
      // If no admin exists yet, we create the first one
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: newPassword
        }
      })
      return NextResponse.json({ message: 'Admin created and password set!' })
    }

    // 2. Check if current password matches
    if (admin.password !== current) {
      return NextResponse.json({ message: 'Current password is wrong' }, { status: 401 })
    }

    // 3. Update to the new password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: newPassword }
    })

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Database error' }, { status: 500 })
  }
}