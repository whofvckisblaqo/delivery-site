import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import Tracking from '@/lib/models/Tracking'
import { Resend } from 'resend'
import { trackingEmailTemplate } from '@/lib/emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find().sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()

    const orderId = `FD${Math.floor(100000 + Math.random() * 900000)}`

    const placedTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    })

    const steps = [
      { label: 'Order Placed',     desc: 'Your delivery has been booked successfully.', done: true,  active: false, time: placedTime },
      { label: 'Picked Up',        desc: 'Driver has collected your package.',           done: false, active: false, time: 'Pending' },
      { label: 'In Transit',       desc: 'Your package is on its way.',                 done: false, active: false, time: 'Pending' },
      { label: 'Out for Delivery', desc: 'Driver is heading to you now.',               done: false, active: false, time: 'Pending' },
      { label: 'Delivered',        desc: 'Package delivered successfully.',             done: false, active: false, time: 'Pending' },
    ]

    const date = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

    const order = await Order.create({
      orderId,
      customer:      body.customer,
      phone:         body.phone        || null,
      fromLocation:  body.fromLocation,
      toLocation:    body.toLocation,
      service:       body.service,
      status:        'Pending',
      amount:        body.amount,
      date,
      customerEmail: body.customerEmail,
      description:   body.description  || null,
    })

    await Tracking.create({
      orderId,
      customer:      body.customer,
      customerEmail: body.customerEmail,
      fromLocation:  body.fromLocation,
      toLocation:    body.toLocation,
      status:        'Pending',
      estimate:      'Awaiting pickup',
      driver:        null,
      steps,
    })

    if (body.customerEmail) {
      const emailHtml = trackingEmailTemplate({
        customerName: body.customer,
        orderId,
        status:       'Order Placed',
        from:         body.fromLocation,
        to:           body.toLocation,
        estimate:     'Awaiting pickup',
        steps,
        trackingCode: orderId,
      })

      await resend.emails.send({
        from:    'FastDropExpress <onboarding@resend.dev>',
        to:      body.customerEmail,
        subject: `📋 Order Confirmed #${orderId} — FastDropExpress`,
        html:    emailHtml,
      })

      if (process.env.ADMIN_EMAIL) {
        await resend.emails.send({
          from:    'FastDropExpress <onboarding@resend.dev>',
          to:      process.env.ADMIN_EMAIL,
          subject: `[Admin] New order #${orderId} for ${body.customer}`,
          html:    emailHtml,
        })
      }
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 })
    }

    const updated = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    )

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}