import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET: Load all messages for the admin list
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error("GET Messages Error:", error)
    return NextResponse.json({ error: 'Failed to fetch inbox' }, { status: 500 })
  }
}

// POST: Save a record of a manually sent email from the Admin Panel
export async function POST(request) {
  try {
    const body = await request.json()
    
    // 1. Validation: Ensure required fields exist in the incoming request
    if (!body.to || !body.message) {
      return NextResponse.json({ error: 'Recipient (to) and message are required' }, { status: 400 })
    }

    // 2. Create the record in Prisma
    const newMessage = await prisma.message.create({
      data: {
        // Generating a unique ID to satisfy the @unique constraint in schema.prisma
        messageId: `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: body.name || "Admin (Direct)",
        email: body.to, // Mapping 'to' from frontend to 'email' in DB
        phone: body.phone || "N/A",
        subject: body.subject || "No Subject",
        message: body.message,
        read: true, 
        time: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
      }
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    // This logs the specific Prisma error to your VS Code terminal
    console.error("POST Message Error:", error)
    return NextResponse.json({ 
      error: 'Database save failed', 
      details: error.message 
    }, { status: 500 })
  }
}

// DELETE: Remove a message using its unique messageId
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    await prisma.message.delete({
      where: { messageId: id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE Message Error:", error)
    return NextResponse.json({ error: 'Delete operation failed' }, { status: 500 })
  }
}

// PATCH: Mark a specific message as read
export async function PATCH(request) {
  try {
    const { messageId } = await request.json()
    
    if (!messageId) {
      return NextResponse.json({ error: 'MessageId is required' }, { status: 400 })
    }

    const updated = await prisma.message.update({
      where: { messageId },
      data: { read: true }
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("PATCH Message Error:", error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}