// Handles admin authentication
// POST /api/admin → check password against database

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ─── POST: Verify admin password ──────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json()
    const { password } = body

    // Reject if no password was sent
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    // Look for an admin row with this exact password
    // findFirst returns null if nothing matches
    const admin = await prisma.admin.findFirst({
      where: { password },
    })

    // No match found — wrong password
    if (!admin) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Password matched — send success back
    return NextResponse.json({ success: true, username: admin.username })

  } catch (error) {
    console.error('POST /api/admin error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}