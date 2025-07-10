import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/rentals - List all rental transactions
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Rentals')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const rentals = await prisma.rentalTransaction.findMany({
    where: { clientId },
    include: {
      guest: true,
      item: true,
      staff: true,
    },
  })
  return NextResponse.json(rentals)
}

// POST /api/rentals - Create new rental transaction
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Rentals')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const rental = await prisma.rentalTransaction.create({ data })
  return NextResponse.json(rental, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 