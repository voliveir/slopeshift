import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/admin/clients - List all clients
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
  const isAdmin = await checkModuleAccess(clientId, 'Admin')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const clients = await prisma.client.findMany()
  return NextResponse.json({ clients })
} 