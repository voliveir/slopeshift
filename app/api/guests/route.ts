import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/guests - List all guests
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Guests')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const guests = await prisma.guest.findMany({
    where: { clientId },
    include: {
      tickets: true,
      passes: true,
      rentalTransactions: true,
      forms: true,
      groupBookings: true,
    },
  })
  return NextResponse.json(guests)
}

// POST /api/guests - Create new guest
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Guests')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const guest = await prisma.guest.create({ data })
  return NextResponse.json(guest, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 