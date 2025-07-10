import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tickets - List all tickets
export async function GET() {
  const tickets = await prisma.ticket.findMany({
    include: {
      guest: true,
      pass: true,
    },
  })
  return NextResponse.json(tickets)
}

// POST /api/tickets - Create new ticket (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const ticket = await prisma.ticket.create({ data })
  return NextResponse.json(ticket, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 