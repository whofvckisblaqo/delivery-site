// This file fills your database with starter data
// Run it with: node prisma/seed.js

const { PrismaClient } = require('@prisma/client')

// Create Prisma client to talk to the database
const prisma = new PrismaClient()

// ─── Helper: build the 5-step timeline based on current status ───────────────
// Returns an array of step objects showing which steps are done/active/pending
function buildSteps(currentStatus) {
  // The order statuses progress through from start to finish
  const statusOrder = [
    'Pending',
    'Picked Up',
    'In Transit',
    'Out for Delivery',
    'Delivered',
  ]

  // The label and description for each step
  const stepDefs = [
    { label: 'Order Placed',      desc: 'Your delivery was booked successfully.' },
    { label: 'Picked Up',         desc: 'Driver picked up your package.' },
    { label: 'In Transit',        desc: 'Your package is on its way.' },
    { label: 'Out for Delivery',  desc: 'Your driver is heading to you now.' },
    { label: 'Delivered',         desc: 'Package has been delivered successfully.' },
  ]

  // Find which index the current status is at
  const currentIndex = statusOrder.indexOf(currentStatus)

  // Build each step with done/active flags
  return stepDefs.map((step, i) => ({
    label: step.label,
    desc: step.desc,
    done: i < currentIndex,      // All steps before current are done (green)
    active: i === currentIndex,  // Current step is active (orange pulsing)
    time: i < currentIndex ? '—' : i === currentIndex ? 'Now' : 'Pending',
  }))
}

async function main() {
  console.log('🌱 Seeding database...')

  // ── Clear all tables first so we start fresh ────────────────────────────────
  // Order matters because of foreign key relationships
  await prisma.tracking.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.message.deleteMany()
  await prisma.admin.deleteMany()
  console.log('🗑️  Cleared existing data')

  // ── Create admin login ───────────────────────────────────────────────────────
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: 'fastdrop2024', // Change this to something more secure
    },
  })
  console.log('✅ Admin created — password: fastdrop2024')

  // ── Create customers ─────────────────────────────────────────────────────────
  // NOTE: Replace these emails with real emails you can test with
  // On Resend free plan you can only send to verified email addresses
  await Promise.all([
    prisma.customer.create({ data: { customerId: 'C001', name: 'Sarah Mitchell',  email: 'sarah@email.com',   phone: '+1 (212) 555-0101', city: 'New York, NY',      orders: 12, spent: '$284.00', joined: 'Jan 2024', status: 'Active'   } }),
    prisma.customer.create({ data: { customerId: 'C002', name: 'James Carter',    email: 'james@email.com',   phone: '+1 (312) 555-0102', city: 'Chicago, IL',       orders: 8,  spent: '$96.00',  joined: 'Feb 2024', status: 'Active'   } }),
    prisma.customer.create({ data: { customerId: 'C003', name: 'Emily Rodriguez', email: 'emily@email.com',   phone: '+1 (713) 555-0103', city: 'Houston, TX',       orders: 5,  spent: '$65.00',  joined: 'Mar 2024', status: 'Active'   } }),
    prisma.customer.create({ data: { customerId: 'C004', name: 'Michael Reynolds',email: 'michael@email.com', phone: '+1 (602) 555-0104', city: 'Phoenix, AZ',       orders: 20, spent: '$240.00', joined: 'Jan 2024', status: 'Active'   } }),
    prisma.customer.create({ data: { customerId: 'C005', name: 'Jessica Parker',  email: 'jessica@email.com', phone: '+1 (206) 555-0105', city: 'Seattle, WA',       orders: 3,  spent: '$24.00',  joined: 'Apr 2024', status: 'Inactive' } }),
    prisma.customer.create({ data: { customerId: 'C006', name: 'Daniel Kim',      email: 'daniel@email.com',  phone: '+1 (213) 555-0106', city: 'Los Angeles, CA',   orders: 15, spent: '$375.00', joined: 'Jan 2024', status: 'Active'   } }),
    prisma.customer.create({ data: { customerId: 'C007', name: 'Ashley Thompson', email: 'ashley@email.com',  phone: '+1 (617) 555-0107', city: 'Boston, MA',        orders: 7,  spent: '$84.00',  joined: 'Feb 2024', status: 'Active'   } }),
    prisma.customer.create({ data: { customerId: 'C008', name: 'Ryan Johnson',    email: 'ryan@email.com',    phone: '+1 (404) 555-0108', city: 'Atlanta, GA',       orders: 9,  spent: '$72.00',  joined: 'Mar 2024', status: 'Inactive' } }),
  ])
  console.log('✅ 8 customers created')

  // ── Create orders ─────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.order.create({ data: { orderId: 'FD123456', customer: 'Sarah Mitchell',   phone: '+1 (212) 555-0101', fromLocation: 'Manhattan, NY',    toLocation: 'Brooklyn, NY',    service: 'Same-Day',  status: 'Out for Delivery', amount: '$25.00', date: 'Today, 2:45 PM',   customerEmail: 'sarah@email.com'   } }),
    prisma.order.create({ data: { orderId: 'FD789012', customer: 'James Carter',     phone: '+1 (312) 555-0102', fromLocation: 'Chicago, IL',       toLocation: 'Detroit, MI',     service: 'Express',   status: 'In Transit',       amount: '$12.00', date: 'Today, 11:30 AM',  customerEmail: 'james@email.com'   } }),
    prisma.order.create({ data: { orderId: 'FD345678', customer: 'Emily Rodriguez',  phone: '+1 (713) 555-0103', fromLocation: 'Houston, TX',       toLocation: 'Dallas, TX',      service: 'Same-Day',  status: 'Delivered',        amount: '$25.00', date: 'Today, 9:15 AM',   customerEmail: 'emily@email.com'   } }),
    prisma.order.create({ data: { orderId: 'FD901234', customer: 'Michael Reynolds', phone: '+1 (602) 555-0104', fromLocation: 'Phoenix, AZ',       toLocation: 'Las Vegas, NV',   service: 'Express',   status: 'Picked Up',        amount: '$12.00', date: 'Today, 8:00 AM',   customerEmail: 'michael@email.com' } }),
    prisma.order.create({ data: { orderId: 'FD567890', customer: 'Jessica Parker',   phone: '+1 (206) 555-0105', fromLocation: 'Seattle, WA',       toLocation: 'Portland, OR',    service: 'Scheduled', status: 'Pending',          amount: '$8.00',  date: 'Yesterday',        customerEmail: 'jessica@email.com' } }),
    prisma.order.create({ data: { orderId: 'FD234567', customer: 'Daniel Kim',       phone: '+1 (213) 555-0106', fromLocation: 'Los Angeles, CA',   toLocation: 'San Diego, CA',   service: 'Same-Day',  status: 'Delivered',        amount: '$25.00', date: 'Yesterday',        customerEmail: 'daniel@email.com'  } }),
    prisma.order.create({ data: { orderId: 'FD890123', customer: 'Ashley Thompson',  phone: '+1 (617) 555-0107', fromLocation: 'Boston, MA',        toLocation: 'Providence, RI',  service: 'Express',   status: 'Delivered',        amount: '$12.00', date: '2 days ago',       customerEmail: 'ashley@email.com'  } }),
    prisma.order.create({ data: { orderId: 'FD456789', customer: 'Ryan Johnson',     phone: '+1 (404) 555-0108', fromLocation: 'Atlanta, GA',       toLocation: 'Charlotte, NC',   service: 'Scheduled', status: 'Pending',          amount: '$8.00',  date: '2 days ago',       customerEmail: 'ryan@email.com'    } }),
  ])
  console.log('✅ 8 orders created')

  // ── Create tracking records ───────────────────────────────────────────────────
  // One tracking record per order — this is what gets updated when admin changes status
  await Promise.all([
    prisma.tracking.create({ data: { orderId: 'FD123456', customer: 'Sarah Mitchell',   customerEmail: 'sarah@email.com',   fromLocation: 'Manhattan, NY',  toLocation: 'Brooklyn, NY',   status: 'Out for Delivery', estimate: 'Today by 4:00 PM',     driver: 'Marcus D.',  steps: buildSteps('Out for Delivery') } }),
    prisma.tracking.create({ data: { orderId: 'FD789012', customer: 'James Carter',     customerEmail: 'james@email.com',   fromLocation: 'Chicago, IL',    toLocation: 'Detroit, MI',    status: 'In Transit',       estimate: 'Tomorrow by 12:00 PM', driver: 'Tyler R.',   steps: buildSteps('In Transit')       } }),
    prisma.tracking.create({ data: { orderId: 'FD345678', customer: 'Emily Rodriguez',  customerEmail: 'emily@email.com',   fromLocation: 'Houston, TX',    toLocation: 'Dallas, TX',     status: 'Delivered',        estimate: 'Delivered ✓',          driver: 'Carlos M.',  steps: buildSteps('Delivered')        } }),
    prisma.tracking.create({ data: { orderId: 'FD901234', customer: 'Michael Reynolds', customerEmail: 'michael@email.com', fromLocation: 'Phoenix, AZ',    toLocation: 'Las Vegas, NV',  status: 'Picked Up',        estimate: 'Today by end of day',  driver: 'Derek S.',   steps: buildSteps('Picked Up')        } }),
    prisma.tracking.create({ data: { orderId: 'FD567890', customer: 'Jessica Parker',   customerEmail: 'jessica@email.com', fromLocation: 'Seattle, WA',    toLocation: 'Portland, OR',   status: 'Pending',          estimate: 'Awaiting pickup',      driver: null,         steps: buildSteps('Pending')          } }),
    prisma.tracking.create({ data: { orderId: 'FD234567', customer: 'Daniel Kim',       customerEmail: 'daniel@email.com',  fromLocation: 'Los Angeles, CA',toLocation: 'San Diego, CA',  status: 'Delivered',        estimate: 'Delivered ✓',          driver: 'Jason L.',   steps: buildSteps('Delivered')        } }),
    prisma.tracking.create({ data: { orderId: 'FD890123', customer: 'Ashley Thompson',  customerEmail: 'ashley@email.com',  fromLocation: 'Boston, MA',     toLocation: 'Providence, RI', status: 'Delivered',        estimate: 'Delivered ✓',          driver: 'Mike T.',    steps: buildSteps('Delivered')        } }),
    prisma.tracking.create({ data: { orderId: 'FD456789', customer: 'Ryan Johnson',     customerEmail: 'ryan@email.com',    fromLocation: 'Atlanta, GA',    toLocation: 'Charlotte, NC',  status: 'Pending',          estimate: 'Awaiting pickup',      driver: null,         steps: buildSteps('Pending')          } }),
  ])
  console.log('✅ 8 tracking records created')

  // ── Create messages ───────────────────────────────────────────────────────────
  await Promise.all([
    prisma.message.create({ data: { messageId: 'M001', name: 'Sarah Mitchell',   email: 'sarah@email.com',   phone: '+1 (212) 555-0101', subject: 'Get a Quote',      message: 'Hi, I run a small online store and would love to discuss bulk delivery pricing for about 50 packages per week.',            read: false, time: 'Today, 3:12 PM'      } }),
    prisma.message.create({ data: { messageId: 'M002', name: 'James Carter',     email: 'james@email.com',   phone: '+1 (312) 555-0102', subject: 'Tracking Issue',   message: 'My package FD789012 has been showing In Transit for 2 days. Please update me.',                                            read: false, time: 'Today, 1:45 PM'      } }),
    prisma.message.create({ data: { messageId: 'M003', name: 'Emily Rodriguez',  email: 'emily@email.com',   phone: '+1 (713) 555-0103', subject: 'Delivery Support', message: 'The driver delivered my package to the wrong address. I need this resolved urgently.',                                       read: false, time: 'Today, 11:20 AM'     } }),
    prisma.message.create({ data: { messageId: 'M004', name: 'Michael Reynolds', email: 'michael@email.com', phone: '+1 (602) 555-0104', subject: 'Partnership',      message: 'We are a logistics company looking to partner with FastDropExpress for last-mile delivery in the Southwest.',               read: true,  time: 'Yesterday, 4:30 PM'  } }),
    prisma.message.create({ data: { messageId: 'M005', name: 'Jessica Parker',   email: 'jessica@email.com', phone: '+1 (206) 555-0105', subject: 'Get a Quote',      message: 'How much does it cost to send a package from Seattle to Portland on a Saturday morning?',                                   read: true,  time: 'Yesterday, 2:15 PM'  } }),
    prisma.message.create({ data: { messageId: 'M006', name: 'Daniel Kim',       email: 'daniel@email.com',  phone: '+1 (213) 555-0106', subject: 'Other',            message: 'Your service is excellent! My package arrived in perfect condition and the driver was very professional. 5 stars!',          read: true,  time: '2 days ago'          } }),
  ])
  console.log('✅ 6 messages created')

  console.log('🎉 Database seeded successfully!')
}

// Run main and always disconnect when done
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })