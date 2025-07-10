import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/client-modules - List enabled modules for a client
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const clientModules = await prisma.clientModule.findMany({
    where: { clientId },
    include: { module: true },
  })
  const modules = clientModules.map(cm => cm.module?.name).filter(Boolean)
  return NextResponse.json({ modules })
} 