import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/admin/clients/[id] - Get client details
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
  const isAdmin = await checkModuleAccess(clientId, 'Admin')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const client = await prisma.client.findUnique({ where: { id: params.id } })
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  return NextResponse.json({ client })
}

// PUT /api/admin/clients/[id] - Update client info
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
  const isAdmin = await checkModuleAccess(clientId, 'Admin')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const data = await req.json()
  const updated = await prisma.client.update({ where: { id: params.id }, data })
  return NextResponse.json({ client: updated })
} 