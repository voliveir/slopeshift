import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/telemetry - List all telemetry pings
export async function GET() {
  const pings = await prisma.telemetryPing.findMany({
    include: { asset: true },
  })
  return NextResponse.json(pings)
}

// POST /api/telemetry - Create new telemetry ping (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const ping = await prisma.telemetryPing.create({ data })
  return NextResponse.json(ping, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 