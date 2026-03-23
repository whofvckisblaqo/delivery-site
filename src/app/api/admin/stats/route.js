import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const totalOrders = await prisma.order.count()
    const totalMessages = await prisma.message.count({ where: { read: false } })
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
    const orders = await prisma.order.findMany({ select: { amount: true } })
    const totalRevenue = orders.reduce((sum, order) => {
      const val = parseFloat(order.amount.replace(/[^0-9.-]+/g,"")) || 0
      return sum + val
    }, 0)

    return NextResponse.json({
      totalOrders,
      totalMessages,
      totalRevenue,
      recentOrders
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}