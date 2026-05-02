import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Customer from '@/lib/models/Customer'

export async function GET() {
  try {
    await connectDB()
    const customers = await Customer.find().sort({ createdAt: -1 })
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body       = await request.json()
    const customerId = `C${Date.now().toString().slice(-4)}`
    const joined     = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })

    const customer = await Customer.create({
      customerId,
      name:   body.name,
      email:  body.email,
      phone:  body.phone || null,
      city:   body.city  || null,
      orders: 0,
      spent:  '$0.00',
      joined,
      status: 'Active',
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}