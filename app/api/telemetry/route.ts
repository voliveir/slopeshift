import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/telemetry - List all telemetry pings
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Telemetry')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const pings = await prisma.telemetryPing.findMany({
    where: { clientId },
    include: { asset: true },
  })
  return NextResponse.json(pings)
}

// POST /api/telemetry - Create new telemetry ping
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Telemetry')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const ping = await prisma.telemetryPing.create({ data })
  return NextResponse.json(ping, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 