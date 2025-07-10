import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/dashboard - List all dashboard snapshots
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Dashboard')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const snapshots = await prisma.opsDashboardSnapshot.findMany({
    where: { clientId },
  })
  return NextResponse.json(snapshots)
}

// POST /api/dashboard - Create new dashboard snapshot
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Dashboard')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const snapshot = await prisma.opsDashboardSnapshot.create({ data })
  return NextResponse.json(snapshot, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 