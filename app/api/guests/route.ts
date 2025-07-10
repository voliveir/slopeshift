import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/guests - List all guests
export async function GET() {
  const guests = await prisma.guest.findMany({
    include: {
      tickets: true,
      passes: true,
      rentalTransactions: true,
      forms: true,
      groupBookings: true,
    },
  })
  return NextResponse.json(guests)
}

// POST /api/guests - Create new guest (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const guest = await prisma.guest.create({ data })
  return NextResponse.json(guest, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 