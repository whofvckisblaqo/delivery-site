// ─── TRACKING STATUS EMAIL ─────────────────────────────────────────────────
// Sent to customer every time admin updates their order status
export function trackingEmailTemplate({
  customerName,
  orderId,
  status,
  from,
  to,
  estimate,
  steps,
  trackingCode,
}) {
  const statusColors = {
    'Pending':          '#64748b',
    'Picked Up':        '#a855f7',
    'In Transit':       '#3b82f6',
    'Out for Delivery': '#F97316',
    'Delivered':        '#22c55e',
  }

  const statusEmojis = {
    'Pending':          '📋',
    'Picked Up':        '📦',
    'In Transit':       '🚛',
    'Out for Delivery': '🚚',
    'Delivered':        '✅',
  }

  const color = statusColors[status] || '#F97316'
  const emoji = statusEmojis[status] || '📦'

  // Parse steps safely — handles both array and string from MySQL
  let parsedSteps = steps
  if (typeof steps === 'string') {
    try { parsedSteps = JSON.parse(steps) } catch (e) { parsedSteps = [] }
  }
  if (!Array.isArray(parsedSteps)) parsedSteps = []

  // Build HTML rows for each step in the timeline
  const stepsHtml = parsedSteps.map((step) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #1e3a5f;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <!-- Colored dot showing step state -->
            <td width="20" valign="top" style="padding-top:3px;">
              <div style="
                width:10px;height:10px;border-radius:50%;
                background:${step.done ? '#22c55e' : step.active ? color : '#1e3a5f'};
              "></div>
            </td>
            <!-- Step name and description -->
            <td style="padding-left:10px;">
              <p style="
                margin:0;font-size:13px;
                font-weight:${step.active ? '700' : '500'};
                color:${step.active ? color : step.done ? '#ffffff' : '#64748b'};
              ">${step.label || ''}</p>
              <p style="margin:2px 0 0;font-size:11px;color:#475569;">
                ${step.desc || ''}
              </p>
            </td>
            <!-- Step time on the right -->
            <td align="right" valign="top">
              <p style="margin:0;font-size:11px;color:#475569;white-space:nowrap;">
                ${step.time || 'Pending'}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  // Site URL for the Track button in email
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <title>FastDropExpress — Order Update</title>
    </head>
    <body style="margin:0;padding:0;background:#060e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

        <!-- Logo -->
        <div style="text-align:center;margin-bottom:28px;">
          <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;">
            FastDrop<span style="color:#F97316;">Express</span>
          </h1>
          <p style="margin:6px 0 0;font-size:13px;color:#475569;">
            Fast. Reliable. Delivered.
          </p>
        </div>

        <!-- Greeting -->
        <p style="font-size:14px;color:#94a3b8;margin:0 0 20px;">
          Hi ${customerName},
        </p>

        <!-- Status Banner -->
        <div style="
          background:linear-gradient(135deg,${color}22,${color}11);
          border:1px solid ${color}55;
          border-radius:16px;
          padding:28px 24px;
          text-align:center;
          margin-bottom:24px;
        ">
          <div style="font-size:48px;margin-bottom:10px;">${emoji}</div>
          <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#ffffff;">
            ${status}
          </h2>
          <p style="margin:0;font-size:14px;color:#94a3b8;">
            Your order <strong style="color:#ffffff;">#${orderId}</strong> has been updated
          </p>
          ${estimate ? `
          <div style="
            display:inline-block;margin-top:14px;
            background:${color}22;border:1px solid ${color}44;
            border-radius:999px;padding:6px 18px;
            color:${color};font-size:13px;font-weight:600;
          ">🕐 ${estimate}</div>` : ''}
        </div>

        <!-- Tracking Code Box -->
        <div style="
          background:#0d1f3c;
          border:2px solid #F97316;
          border-radius:16px;
          padding:20px 24px;
          text-align:center;
          margin-bottom:20px;
        ">
          <p style="
            margin:0 0 8px;font-size:11px;font-weight:700;
            color:#F97316;text-transform:uppercase;letter-spacing:2px;
          ">Your Tracking Number</p>
          <!-- Big bold tracking code -->
          <p style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:4px;">
            ${trackingCode || orderId}
          </p>
          <p style="margin:8px 0 0;font-size:12px;color:#64748b;">
            Use this code to check your delivery status anytime
          </p>
        </div>

        <!-- Order Details -->
        <div style="
          background:#0d1f3c;border:1px solid #1e3a5f;
          border-radius:16px;padding:24px;margin-bottom:20px;
        ">
          <p style="
            margin:0 0 14px;font-size:11px;font-weight:700;
            color:#F97316;text-transform:uppercase;letter-spacing:2px;
          ">Order Details</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#64748b;">Order ID</td>
              <td align="right" style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;font-weight:700;color:#fff;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#64748b;">Customer</td>
              <td align="right" style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#fff;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#64748b;">From</td>
              <td align="right" style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#fff;">${from}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#64748b;">To</td>
              <td align="right" style="padding:8px 0;font-size:13px;color:#fff;">${to}</td>
            </tr>
          </table>
        </div>

        <!-- Delivery Timeline -->
        <div style="
          background:#0d1f3c;border:1px solid #1e3a5f;
          border-radius:16px;padding:24px;margin-bottom:28px;
        ">
          <p style="
            margin:0 0 14px;font-size:11px;font-weight:700;
            color:#F97316;text-transform:uppercase;letter-spacing:2px;
          ">Delivery Timeline</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${stepsHtml}
          </table>
        </div>

        <!-- Track Button -->
        <div style="text-align:center;margin-bottom:32px;">
          <a href="${siteUrl}/tracking" style="
            display:inline-block;background:#F97316;color:#ffffff;
            text-decoration:none;font-weight:700;font-size:15px;
            padding:14px 40px;border-radius:999px;
          ">Track Your Package →</a>
          <p style="margin:10px 0 0;font-size:12px;color:#475569;">
            Or visit:
            <a href="${siteUrl}/tracking" style="color:#F97316;text-decoration:none;">
              ${siteUrl}/tracking
            </a>
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align:center;border-top:1px solid #1e3a5f;padding-top:24px;">
          <p style="margin:0 0 6px;font-size:12px;color:#475569;">
            FastDropExpress • 123 Express Ave, New York, NY 10001
          </p>
          <p style="margin:0 0 6px;font-size:12px;color:#475569;">
            Call us:
            <a href="tel:+18003278376" style="color:#F97316;text-decoration:none;">
              +1 (800) 327-8376
            </a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#1e3a5f;">
            © ${new Date().getFullYear()} FastDropExpress. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// ─── MESSAGE EMAIL ─────────────────────────────────────────────────────────
// Sent when admin sends a custom message to the customer
// e.g. "Your package is delayed due to weather"
export function messageEmailTemplate({
  customerName,  // Customer full name
  orderId,       // Order ID like FD847392
  message,       // The custom message admin typed
  from,          // Pickup location
  to,            // Delivery destination
  status,        // Current order status
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
      <title>FastDropExpress — Message About Your Order</title>
    </head>
    <body style="margin:0;padding:0;background:#060e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

        <!-- Logo -->
        <div style="text-align:center;margin-bottom:28px;">
          <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;">
            FastDrop<span style="color:#F97316;">Express</span>
          </h1>
          <p style="margin:6px 0 0;font-size:13px;color:#475569;">
            Fast. Reliable. Delivered.
          </p>
        </div>

        <!-- Greeting -->
        <p style="font-size:14px;color:#94a3b8;margin:0 0 20px;">
          Hi ${customerName},
        </p>

        <!-- Message Banner -->
        <div style="
          background:linear-gradient(135deg,#F9731622,#F9731611);
          border:1px solid #F9731655;
          border-radius:16px;
          padding:28px 24px;
          text-align:center;
          margin-bottom:24px;
        ">
          <div style="font-size:48px;margin-bottom:10px;">📬</div>
          <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#ffffff;">
            Message About Your Order
          </h2>
          <p style="margin:0;font-size:14px;color:#94a3b8;">
            Order <strong style="color:#ffffff;">#${orderId}</strong>
          </p>
        </div>

        <!-- Message Box — the actual message from admin -->
        <div style="
          background:#0d1f3c;
          border:1px solid #F97316;
          border-left:4px solid #F97316;
          border-radius:16px;
          padding:24px;
          margin-bottom:24px;
        ">
          <p style="
            margin:0 0 10px;font-size:11px;font-weight:700;
            color:#F97316;text-transform:uppercase;letter-spacing:2px;
          ">Message from FastDropExpress</p>
          <!-- The message admin typed -->
          <p style="
            margin:0;font-size:15px;color:#e2e8f0;
            line-height:1.7;font-style:italic;
          ">"${message}"</p>
        </div>

        <!-- Order Summary -->
        <div style="
          background:#0d1f3c;border:1px solid #1e3a5f;
          border-radius:16px;padding:24px;margin-bottom:28px;
        ">
          <p style="
            margin:0 0 14px;font-size:11px;font-weight:700;
            color:#F97316;text-transform:uppercase;letter-spacing:2px;
          ">Order Summary</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#64748b;">Order ID</td>
              <td align="right" style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;font-weight:700;color:#fff;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#64748b;">Current Status</td>
              <td align="right" style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#F97316;font-weight:600;">${status}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#64748b;">From</td>
              <td align="right" style="padding:8px 0;border-bottom:1px solid #1e3a5f;font-size:13px;color:#fff;">${from}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#64748b;">To</td>
              <td align="right" style="padding:8px 0;font-size:13px;color:#fff;">${to}</td>
            </tr>
          </table>
        </div>

        <!-- Track Button -->
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
            Call us:
            <a href="tel:+18003278376" style="color:#F97316;text-decoration:none;">
              +1 (800) 327-8376
            </a>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#1e3a5f;">
            © ${new Date().getFullYear()} FastDropExpress. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}