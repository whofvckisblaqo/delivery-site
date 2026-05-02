import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Tracking from '@/lib/models/Tracking'
import Order from '@/lib/models/Order'
import { Resend } from 'resend'
import { trackingEmailTemplate, messageEmailTemplate } from '@/lib/emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    await connectDB()
    const records = await Tracking.find().sort({ createdAt: -1 })
    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { order_id, status } = body

    if (!order_id || !status) {
      return NextResponse.json({ error: 'order_id and status required' }, { status: 400 })
    }

    const record = await Tracking.findOne({ orderId: order_id })
    if (!record) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const statusStep = {
      'Pending': 0, 'Picked Up': 1, 'In Transit': 2,
      'Out for Delivery': 3, 'Delivered': 4,
    }

    const currentIndex = statusStep[status] ?? 0

    const timeNow = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    })

    const existingSteps = Array.isArray(record.steps) ? record.steps : []

    const steps = [
      { label: 'Order Placed',     desc: 'Your order has been received and confirmed.' },
      { label: 'Picked Up',        desc: 'Driver has collected your package.' },
      { label: 'In Transit',       desc: 'Your package is on its way.' },
      { label: 'Out for Delivery', desc: 'Driver is heading to you now.' },
      { label: 'Delivered',        desc: 'Package delivered successfully.' },
    ].map((s, i) => ({
      label:  s.label,
      desc:   s.desc,
      done:   i < currentIndex,
      active: i === currentIndex,
      time:   i < currentIndex
        ? existingSteps[i]?.time || timeNow
        : i === currentIndex ? timeNow : 'Pending',
    }))

    const estimateMap = {
      'Pending': 'Awaiting pickup', 'Picked Up': 'In progress',
      'In Transit': 'Expected tomorrow', 'Out for Delivery': 'Today by end of day',
      'Delivered': 'Delivered',
    }
    const estimate = estimateMap[status] || ''

    const updated = await Tracking.findOneAndUpdate(
      { orderId: order_id },
      { status, steps, estimate },
      { new: true }
    )

    await Order.findOneAndUpdate({ orderId: order_id }, { status })

    let emailSent = false
    if (record.customerEmail) {
      try {
        const html = trackingEmailTemplate({
          customerName: record.customer,
          orderId:      order_id,
          status, from: record.fromLocation,
          to:           record.toLocation,
          estimate, steps,
          trackingCode: order_id,
        })

        const emoji = { 'Pending':'📋','Picked Up':'📦','In Transit':'🚛','Out for Delivery':'🚚','Delivered':'✅' }[status] || '📦'

        await resend.emails.send({
          from:    'FastDropExpress <onboarding@resend.dev>',
          to:      record.customerEmail,
          subject: `${emoji} Order #${order_id} is now "${status}" — FastDropExpress`,
          html,
        })

        if (process.env.ADMIN_EMAIL) {
          await resend.emails.send({
            from:    'FastDropExpress <onboarding@resend.dev>',
            to:      process.env.ADMIN_EMAIL,
            subject: `[Admin] Order #${order_id} → "${status}"`,
            html,
          })
        }
        emailSent = true
      } catch (e) {
        console.error('Email error:', e.message)
      }
    }

    return NextResponse.json({ success: true, data: updated, emailSent })
  } catch (error) {
    console.error('PATCH /api/tracking error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { order_id, message } = body

    if (!order_id || !message) {
      return NextResponse.json({ error: 'order_id and message required' }, { status: 400 })
    }

    const record = await Tracking.findOne({ orderId: order_id })
    if (!record) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (!record.customerEmail) return NextResponse.json({ error: 'No email on file' }, { status: 400 })

    const html = messageEmailTemplate({
      customerName: record.customer,
      orderId:      order_id,
      message,
      from:         record.fromLocation,
      to:           record.toLocation,
      status:       record.status,
    })

    await resend.emails.send({
      from:    'FastDropExpress <onboarding@resend.dev>',
      to:      record.customerEmail,
      subject: `📬 Update about your order #${order_id} — FastDropExpress`,
      html,
    })

    if (process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from:    'FastDropExpress <onboarding@resend.dev>',
        to:      process.env.ADMIN_EMAIL,
        subject: `[Admin Copy] Message to ${record.customer} re: #${order_id}`,
        html,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}