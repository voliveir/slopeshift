import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/dashboard - List all dashboard snapshots
export async function GET() {
  const snapshots = await prisma.opsDashboardSnapshot.findMany()
  return NextResponse.json(snapshots)
}

// POST /api/dashboard - Create new dashboard snapshot (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const snapshot = await prisma.opsDashboardSnapshot.create({ data })
  return NextResponse.json(snapshot, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 