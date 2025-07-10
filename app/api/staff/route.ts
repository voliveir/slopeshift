import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/staff - List all staff
export async function GET() {
  const staff = await prisma.staff.findMany({
    include: {
      assignedTasks: true,
      shifts: true,
      housingResidencies: true,
    },
  })
  return NextResponse.json(staff)
}

// POST /api/staff - Create new staff (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const staff = await prisma.staff.create({ data })
  return NextResponse.json(staff, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 