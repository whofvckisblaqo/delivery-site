// app/api/send-general/route.js
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { to, subject, message } = await request.json()

    if (!to || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const data = await resend.emails.send({
      from: 'FastDropExpress <onboarding@resend.dev>', // Or your verified domain
      to: to,
      subject: subject || 'Message from FastDropExpress',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #F97316;">FastDropExpress</h2>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is a direct message from the FastDropExpress Admin team.</p>
        </div>
      `,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}