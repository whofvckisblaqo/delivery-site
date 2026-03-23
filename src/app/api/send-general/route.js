import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const body = await request.json()
    const { to, subject, message, customerName, orderId } = body

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'to, subject and message are required' },
        { status: 400 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="utf-8"/></head>
      <body style="margin:0;padding:0;background:#060e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

          <!-- Logo -->
          <div style="text-align:center;margin-bottom:28px;">
            <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;">
              FastDrop<span style="color:#F97316;">Express</span>
            </h1>
            <p style="margin:6px 0 0;font-size:13px;color:#475569;">Fast. Reliable. Delivered.</p>
          </div>

          <!-- Greeting -->
          ${customerName ? `<p style="font-size:14px;color:#94a3b8;margin:0 0 20px;">Hi ${customerName},</p>` : ''}

          <!-- Order ID if provided -->
          ${orderId ? `
          <div style="background:#0d1f3c;border:1px solid #1e3a5f;border-radius:12px;padding:16px 20px;margin-bottom:20px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#F97316;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Order</p>
            <p style="margin:6px 0 0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:3px;">#${orderId}</p>
          </div>` : ''}

          <!-- Message box -->
          <div style="background:#0d1f3c;border:1px solid #1e3a5f;border-left:4px solid #F97316;border-radius:12px;padding:24px;margin-bottom:24px;">
            <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#F97316;text-transform:uppercase;letter-spacing:2px;">
              Message from FastDropExpress
            </p>
            <p style="margin:0;font-size:14px;color:#e2e8f0;line-height:1.7;">
              ${message}
            </p>
          </div>

          <!-- Track button -->
          <div style="text-align:center;margin-bottom:32px;">
            <a href="${siteUrl}/tracking" style="
              display:inline-block;background:#F97316;color:#ffffff;
              text-decoration:none;font-weight:700;font-size:15px;
              padding:14px 40px;border-radius:999px;
            ">Track Your Package →</a>
          </div>

          <!-- Footer -->
          <div style="text-align:center;border-top:1px solid #1e3a5f;padding-top:24px;">
            <p style="margin:0 0 6px;font-size:12px;color:#475569;">
              FastDropExpress • 123 Express Ave, New York, NY 10001
            </p>
            <p style="margin:0 0 6px;font-size:12px;color:#475569;">
              Call us: <a href="tel:+18003278376" style="color:#F97316;text-decoration:none;">+1 (800) 327-8376</a>
            </p>
            <p style="margin:8px 0 0;font-size:11px;color:#1e3a5f;">
              © ${new Date().getFullYear()} FastDropExpress. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `

    await resend.emails.send({
      from:    'FastDropExpress <onboarding@resend.dev>',
      to,
      subject,
      html,
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('POST /api/send-general error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}