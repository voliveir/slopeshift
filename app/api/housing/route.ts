import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/housing - List all housing units
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Housing')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const housing = await prisma.housing.findMany({
    where: { clientId },
    include: {
      residents: true,
      moveIns: true,
      moveOuts: true,
      issues: true,
    },
  })
  return NextResponse.json(housing)
}

// POST /api/housing - Create new housing unit
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Housing')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const housing = await prisma.housing.create({ data })
  return NextResponse.json(housing, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 