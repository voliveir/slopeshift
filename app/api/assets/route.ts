import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/assets - List all assets
export async function GET() {
  const assets = await prisma.asset.findMany({
    include: {
      maintenanceLogs: true,
      tasks: true,
      telemetryPings: true,
    },
  })
  return NextResponse.json(assets)
}

// POST /api/assets - Create new asset (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const asset = await prisma.asset.create({ data })
  return NextResponse.json(asset, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 