import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/forms - List all form templates and responses
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Forms')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const templates = await prisma.formTemplate.findMany({
    where: { clientId },
    include: { responses: true },
  })
  const responses = await prisma.formResponse.findMany({
    where: { clientId },
    include: { template: true, guest: true },
  })
  return NextResponse.json({ templates, responses })
}

// POST /api/forms - Create new form template or response
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Forms')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  // TODO: Add logic to distinguish between template and response creation
  // For now, assume template creation
  const template = await prisma.formTemplate.create({ data })
  return NextResponse.json(template, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 