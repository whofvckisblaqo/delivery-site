// Handles customer data
// GET  /api/customers → fetch all customers
// POST /api/customers → create a new customer

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// ─── GET: Fetch all customers ─────────────────────────────────────────────────
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }, // Newest first
    })
    return NextResponse.json(customers)
  } catch (error) {
    console.error('GET /api/customers error:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

// ─── POST: Create a new customer ─────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json()

    // Generate customer ID like C + timestamp suffix
    const customerId = `C${Date.now().toString().slice(-4)}`

    // Get current month and year for joined field
    const joined = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })

    const customer = await prisma.customer.create({
      data: {
        customerId,
        name:   body.name,
        email:  body.email,
        phone:  body.phone  || null,
        city:   body.city   || null,
        orders: 0,             // New customer has 0 orders
        spent:  '$0.00',       // New customer has spent nothing
        joined,
        status: 'Active',      // New customers start as Active
      },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('POST /api/customers error:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}