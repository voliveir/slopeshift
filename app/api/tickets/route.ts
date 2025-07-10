import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/tickets - List all tickets
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Tickets')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const tickets = await prisma.ticket.findMany({
    where: { clientId },
    include: {
      guest: true,
      pass: true,
    },
  })
  return NextResponse.json(tickets)
}

// POST /api/tickets - Create new ticket
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Tickets')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const ticket = await prisma.ticket.create({ data })
  return NextResponse.json(ticket, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 