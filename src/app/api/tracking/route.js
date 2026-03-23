import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Resend } from 'resend'
import { trackingEmailTemplate, messageEmailTemplate } from '@/lib/emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)

// ─── GET: All tracking records for admin dashboard ─────────────────────────
export async function GET() {
  try {
    const records = await prisma.tracking.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(records)
  } catch (error) {
    console.error('GET /api/tracking error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// ─── PATCH: Admin updates status → saves to DB + emails customer ───────────
export async function PATCH(request) {
  try {
    const body = await request.json()
    const { order_id, status } = body

    if (!order_id || !status) {
      return NextResponse.json(
        { error: 'order_id and status are required' },
        { status: 400 }
      )
    }

    // Find the tracking record
    const record = await prisma.tracking.findUnique({
      where: { orderId: order_id },
    })

    if (!record) {
      return NextResponse.json(
        { error: `Order ${order_id} not found` },
        { status: 404 }
      )
    }

    // Map status to step index
    const statusStep = {
      'Pending':          0,
      'Picked Up':        1,
      'In Transit':       2,
      'Out for Delivery': 3,
      'Delivered':        4,
    }

    const currentIndex = statusStep[status] ?? 0

    const timeNow = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    })

    // Build steps array
    const stepDefs = [
      { label: 'Order Placed',     desc: 'Your order has been received and confirmed.' },
      { label: 'Picked Up',        desc: 'Driver has collected your package.' },
      { label: 'In Transit',       desc: 'Your package is on its way.' },
      { label: 'Out for Delivery', desc: 'Driver is near you with your package.' },
      { label: 'Delivered',        desc: 'Package delivered successfully.' },
    ]

    // Get old steps to preserve timestamps
    let oldSteps = []
    if (Array.isArray(record.steps)) {
      oldSteps = record.steps
    } else if (typeof record.steps === 'string') {
      try { oldSteps = JSON.parse(record.steps) } catch { oldSteps = [] }
    }

    const steps = stepDefs.map((s, i) => ({
      label:  s.label,
      desc:   s.desc,
      done:   i < currentIndex,
      active: i === currentIndex,
      time:   i < currentIndex
        ? oldSteps[i]?.time || timeNow
        : i === currentIndex
        ? timeNow
        : 'Pending',
    }))

    // ETA based on status
    const estimateMap = {
      'Pending':          'Awaiting pickup',
      'Picked Up':        'In progress',
      'In Transit':       'Expected tomorrow',
      'Out for Delivery': 'Today by end of day',
      'Delivered':        'Delivered',
    }
    const estimate = estimateMap[status] || ''

    // Save updated status + steps to tracking table
    const updated = await prisma.tracking.update({
      where: { orderId: order_id },
      data:  { status, steps, estimate },
    })

    // Sync status to orders table too
    await prisma.order.update({
      where: { orderId: order_id },
      data:  { status },
    })

    // Send email to customer
    let emailSent = false
    if (record.customerEmail) {
      try {
        const html = trackingEmailTemplate({
          customerName: record.customer,
          orderId:      order_id,
          status,
          from:         record.fromLocation,
          to:           record.toLocation,
          estimate,
          steps,
          trackingCode: order_id,
        })

        const emoji = {
          'Pending': '📋', 'Picked Up': '📦',
          'In Transit': '🚛', 'Out for Delivery': '🚚', 'Delivered': '✅',
        }[status] || '📦'

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
        console.log(`✅ Email sent to ${record.customerEmail}`)
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

// ─── POST: Admin sends custom message to customer ──────────────────────────
export async function POST(request) {
  try {
    const body = await request.json()
    const { order_id, message } = body

    if (!order_id || !message) {
      return NextResponse.json(
        { error: 'order_id and message are required' },
        { status: 400 }
      )
    }

    const record = await prisma.tracking.findUnique({
      where: { orderId: order_id },
    })

    if (!record) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!record.customerEmail) {
      return NextResponse.json(
        { error: 'No customer email on file' },
        { status: 400 }
      )
    }

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
        subject: `[Admin Copy] Message sent to ${record.customer} re: #${order_id}`,
        html,
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('POST /api/tracking error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}