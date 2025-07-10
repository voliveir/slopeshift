import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/time-entries - List all time entries
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'TimeEntries')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const entries = await prisma.timeEntry.findMany({
    where: { clientId },
    include: {
      staff: true,
      shift: true,
    },
  })
  return NextResponse.json(entries)
}

// POST /api/time-entries - Create new time entry
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'TimeEntries')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const entry = await prisma.timeEntry.create({ data })
  return NextResponse.json(entry, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 