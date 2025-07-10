import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/forecasting - List all forecasting suggestions
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Forecasting')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const suggestions = await prisma.forecastingSuggestion.findMany({ where: { clientId } })
  return NextResponse.json(suggestions)
}

// POST /api/forecasting - Create new suggestion
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Forecasting')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const suggestion = await prisma.forecastingSuggestion.create({ data })
  return NextResponse.json(suggestion, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 