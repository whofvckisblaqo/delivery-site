// Handles all order-related API requests
// GET    /api/orders  → fetch all orders for admin table
// POST   /api/orders  → create order + tracking record + send email with tracking code
// PATCH  /api/orders  → update order status only

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'
import { trackingEmailTemplate } from '@/lib/emailTemplates'

// One Resend instance reused for all email sends in this file
const resend = new Resend(process.env.RESEND_API_KEY)

// ─── GET: Fetch all orders ─────────────────────────────────────────────────────
// Called when the admin orders page loads
// Returns all orders from database sorted newest first
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }, // Newest orders appear at the top
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// ─── POST: Create a new order ──────────────────────────────────────────────────
// Called when admin fills in the Create Order form and clicks submit
// What this does step by step:
// 1. Auto-generates a unique tracking code like FD847392
// 2. Saves the order to the orders table in MySQL
// 3. Creates a tracking record in the tracking table
// 4. Sends a confirmation email to the customer with their tracking code
export async function POST(request) {
  try {
    // Parse the JSON body sent from the Create Order form
    const body = await request.json()

    // ── Validate required fields ─────────────────────────────────────────────
    // These fields must exist before we save anything to the database
    if (!body.customer || !body.customerEmail || !body.phone || !body.fromLocation || !body.toLocation || !body.amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ── Generate unique tracking code ─────────────────────────────────────────
    // Format: FD + 6 random digits e.g. FD847392
    // This becomes the customer's tracking code
    const orderId = `FD${Math.floor(100000 + Math.random() * 900000)}`

    // ── Get current time for Order Placed step ────────────────────────────────
    // Formats like "2:45 PM"
    const placedTime = new Date().toLocaleTimeString('en-US', {
      hour:   '2-digit',
      minute: '2-digit',
    })

    // ── Build the initial 5-step delivery timeline ────────────────────────────
    // Order Placed is immediately marked as done=true since it just happened
    // All other steps start as pending — they update as admin changes status
    const steps = [
      {
        label:  'Order Placed',
        desc:   'Your delivery was booked successfully.',
        done:   true,   // Already happened — mark green
        active: false,
        time:   placedTime, // Show actual time order was placed
      },
      {
        label:  'Picked Up',
        desc:   'Driver picked up your package.',
        done:   false,
        active: false,
        time:   'Pending', // Not happened yet
      },
      {
        label:  'In Transit',
        desc:   'Your package is on its way.',
        done:   false,
        active: false,
        time:   'Pending',
      },
      {
        label:  'Out for Delivery',
        desc:   'Your driver is heading to you now.',
        done:   false,
        active: false,
        time:   'Pending',
      },
      {
        label:  'Delivered',
        desc:   'Package has been delivered.',
        done:   false,
        active: false,
        time:   'Pending',
      },
    ]

    // ── Get readable date string for the orders table ─────────────────────────
    // Formats like "Jan 15, 2:45 PM"
    const date = new Date().toLocaleString('en-US', {
      month:  'short',
      day:    'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    })

    // ── Step 1: Save order to the orders table ────────────────────────────────
    // All fields from the Create Order form are saved here
    const order = await prisma.order.create({
      data: {
        orderId,                          // Auto-generated like FD847392
        customer:      body.customer,     // Receiver name
        phone:         body.phone,        // Receiver phone number
        fromLocation:  body.fromLocation, // Pickup address
        toLocation:    body.toLocation,   // Destination address
        service:       body.service,      // Same-Day, Express, or Scheduled
        status:        'Pending',         // All new orders start as Pending
        amount:        body.amount,       // Delivery price
        date,                             // Human readable date
        customerEmail: body.customerEmail,// Email address for notifications
      },
    })

    // ── Step 2: Create tracking record in tracking table ─────────────────────
    // This is what the public /tracking page reads from
    // The customer will enter the orderId (FD847392) to see this record
    await prisma.tracking.create({
      data: {
        orderId,                            // Same code as the order
        customer:      body.customer,       // Customer name shown on tracking page
        customerEmail: body.customerEmail,  // Email for future status notifications
        fromLocation:  body.fromLocation,   // Shown on tracking page
        toLocation:    body.toLocation,     // Shown on tracking page
        status:        'Pending',           // Initial status
        estimate:      'Awaiting pickup',   // Initial ETA shown to customer
        driver:        null,                // No driver assigned yet
        steps,                              // Initial 5-step timeline
      },
    })

    // ── Step 3: Send confirmation email to customer ───────────────────────────
    // The email contains the tracking code the customer needs to track their order
    if (body.customerEmail) {

      // Build the branded HTML email using our template
      const emailHtml = trackingEmailTemplate({
        customerName: body.customer,
        orderId,
        status:       'Order Placed',    // First status
        from:         body.fromLocation,
        to:           body.toLocation,
        estimate:     'Awaiting pickup',
        steps,
        trackingCode: orderId,           // Big bold code shown in the email
      })

      // Send the confirmation email to the customer
      // They will see their tracking code FD847392 in the email
      await resend.emails.send({
        from:    'FastDropExpress <onboarding@resend.dev>',
        to:      body.customerEmail,
        subject: `📋 Your Order is Confirmed! Tracking: ${orderId} — FastDropExpress`,
        html:    emailHtml,
      })

      // Also send an admin copy so admin can see what was sent to the customer
      if (process.env.ADMIN_EMAIL) {
        await resend.emails.send({
          from:    'FastDropExpress <onboarding@resend.dev>',
          to:      process.env.ADMIN_EMAIL,
          subject: `[Admin] New order #${orderId} created for ${body.customer}`,
          html:    emailHtml,
        })
      }
    }

    // ── Return the created order to the frontend ──────────────────────────────
    // The admin orders page uses this to add the new row to the table immediately
    // without needing to refresh
    return NextResponse.json(order, { status: 201 })

  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// ─── PATCH: Update order status ────────────────────────────────────────────────
// Called when admin changes the status dropdown on any order row
// Only updates the status field — does not send email
// Email is sent separately from the tracking route when status changes
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { orderId, status } = body

    // Both fields are required
    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'orderId and status are required' },
        { status: 400 }
      )
    }

    // Update only the status field for this specific order
    // where matches the unique orderId like FD847392
    const updated = await prisma.order.update({
      where: { orderId }, // Find by unique order ID
      data:  { status },  // Only change the status field
    })

    return NextResponse.json(updated)

  } catch (error) {
    console.error('PATCH /api/orders error:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
}