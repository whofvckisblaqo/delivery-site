// Prisma client singleton
// We export ONE instance and reuse it everywhere
// Without this, Next.js would open a new DB connection
// on every hot reload during development — causing errors

import { PrismaClient } from '@prisma/client'

// Attach to global object so the instance survives hot reloads
const globalForPrisma = globalThis

// Reuse existing instance if it exists, otherwise create a new one
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'], // Only log database errors, not every query
})

// Save to global in development so hot reloads reuse it
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export the single instance for use in all API routes
export default prisma