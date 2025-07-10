import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/rentals - List all rental transactions
export async function GET() {
  const rentals = await prisma.rentalTransaction.findMany({
    include: {
      guest: true,
      item: true,
      staff: true,
    },
  })
  return NextResponse.json(rentals)
}

// POST /api/rentals - Create new rental transaction (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const rental = await prisma.rentalTransaction.create({ data })
  return NextResponse.json(rental, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 