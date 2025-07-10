import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/incidents - List all incident reports
export async function GET() {
  const incidents = await prisma.incidentReport.findMany({
    include: {
      staffRefs: true,
    },
  })
  return NextResponse.json(incidents)
}

// POST /api/incidents - Create new incident report (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const incident = await prisma.incidentReport.create({ data })
  return NextResponse.json(incident, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 