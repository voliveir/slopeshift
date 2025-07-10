import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/shifts - List all shifts
export async function GET() {
  const shifts = await prisma.shift.findMany({
    include: {
      staff: true,
      timeEntries: true,
    },
  })
  return NextResponse.json(shifts)
}

// POST /api/shifts - Create new shift (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const shift = await prisma.shift.create({ data })
  return NextResponse.json(shift, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 