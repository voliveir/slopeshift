import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/passes - List all passes
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Passes')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const passes = await prisma.pass.findMany({
    where: { clientId },
    include: {
      guest: true,
      tickets: true,
    },
  })
  return NextResponse.json(passes)
}

// POST /api/passes - Create new pass
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Passes')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const pass = await prisma.pass.create({ data })
  return NextResponse.json(pass, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 