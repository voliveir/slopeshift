import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/time-entries - List all time entries
export async function GET() {
  const entries = await prisma.timeEntry.findMany({
    include: {
      staff: true,
      shift: true,
    },
  })
  return NextResponse.json(entries)
}

// POST /api/time-entries - Create new time entry (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const entry = await prisma.timeEntry.create({ data })
  return NextResponse.json(entry, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 