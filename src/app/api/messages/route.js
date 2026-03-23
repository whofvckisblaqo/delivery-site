import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET: Load all messages for the list
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST: Save a record of a manually sent email
export async function POST(request) {
  try {
    const body = await request.json()
    
    const newMessage = await prisma.message.create({
      data: {
        messageId: `MSG${Math.floor(100000 + Math.random() * 900000)}`,
        name: "Admin (Direct)",
        email: body.to,
        subject: body.subject || "No Subject",
        message: body.message,
        read: true, 
        time: new Date().toLocaleString('en-US', { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        }),
      }
    })
    return NextResponse.json(newMessage)
  } catch (error) {
    return NextResponse.json({ error: 'Database save failed' }, { status: 500 })
  }
}

// DELETE: Remove a message from the database
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    await prisma.message.delete({
      where: { messageId: id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

// PATCH: Mark as read
export async function PATCH(request) {
  const { messageId } = await request.json()
  await prisma.message.update({
    where: { messageId },
    data: { read: true }
  })
  return NextResponse.json({ success: true })
}