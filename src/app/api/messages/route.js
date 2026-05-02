import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Message from '@/lib/models/Message'

export async function GET() {
  try {
    await connectDB()
    const messages = await Message.find().sort({ createdAt: -1 })
    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()
    const body      = await request.json()
    const messageId = `M${Date.now()}`
    const time      = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

    const message = await Message.create({
      messageId,
      name:    body.name,
      email:   body.email,
      phone:   body.phone   || null,
      subject: body.subject || null,
      message: body.message,
      read:    false,
      time,
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { messageId } = body

    if (!messageId) {
      return NextResponse.json({ error: 'messageId required' }, { status: 400 })
    }

    const updated = await Message.findOneAndUpdate(
      { messageId },
      { read: true },
      { new: true }
    )

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}