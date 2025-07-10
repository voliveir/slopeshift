import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/admin/modules - List all modules
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
  const isAdmin = await checkModuleAccess(clientId, 'Admin')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const modules = await prisma.module.findMany()
  return NextResponse.json({ modules })
} 