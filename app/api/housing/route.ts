import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/housing - List all housing units
export async function GET() {
  const housing = await prisma.housing.findMany({
    include: {
      residents: true,
      moveIns: true,
      moveOuts: true,
      issues: true,
    },
  })
  return NextResponse.json(housing)
}

// POST /api/housing - Create new housing unit (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const housing = await prisma.housing.create({ data })
  return NextResponse.json(housing, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 