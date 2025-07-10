import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/incidents - List all incident reports
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Incidents')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const incidents = await prisma.incidentReport.findMany({
    where: { clientId },
    include: {
      staffRefs: true,
    },
  })
  return NextResponse.json(incidents)
}

// POST /api/incidents - Create new incident report
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Incidents')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const incident = await prisma.incidentReport.create({ data })
  return NextResponse.json(incident, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 