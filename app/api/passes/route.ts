import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/passes - List all passes
export async function GET() {
  const passes = await prisma.pass.findMany({
    include: {
      guest: true,
      tickets: true,
    },
  })
  return NextResponse.json(passes)
}

// POST /api/passes - Create new pass (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const pass = await prisma.pass.create({ data })
  return NextResponse.json(pass, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 