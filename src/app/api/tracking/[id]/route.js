import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request, context) {
  try {
    // Await params — required in newer Next.js versions
    const params = await context.params
    const id     = params?.id

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const cleanId = id.replace('#', '').trim().toUpperCase()

    const record = await prisma.tracking.findUnique({
      where: { orderId: cleanId },
    })

    if (!record) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const statusStep = {
      'Pending':          0,
      'Picked Up':        1,
      'In Transit':       2,
      'Out for Delivery': 3,
      'Delivered':        4,
    }

    const currentIndex = statusStep[record.status] ?? 0

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
    }))

    return NextResponse.json({
      orderId:      record.orderId,
      status:       record.status,
      fromLocation: record.fromLocation,
      toLocation:   record.toLocation,
      estimate:     record.estimate || '',
      driver:       record.driver   || '',
      steps,
    })

  } catch (err) {
    console.error('Tracking GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}