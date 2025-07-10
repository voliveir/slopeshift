import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/admin/clients/[id]/modules - List enabled modules for a client
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
  const isAdmin = await checkModuleAccess(clientId, 'Admin')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const clientModules = await prisma.clientModule.findMany({
    where: { clientId: params.id },
    include: { module: true },
  })
  const modules = clientModules.map(cm => cm.module?.name).filter(Boolean)
  return NextResponse.json({ modules })
}

// PUT /api/admin/clients/[id]/modules - Update enabled modules for a client
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })
  const isAdmin = await checkModuleAccess(clientId, 'Admin')
  if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { modules } = await req.json() // modules: string[]
  if (!Array.isArray(modules)) return NextResponse.json({ error: 'Invalid modules' }, { status: 400 })

  // Remove all current modules for the client
  await prisma.clientModule.deleteMany({ where: { clientId: params.id } })
  // Add new modules
  const moduleRecords = await prisma.module.findMany({ where: { name: { in: modules } } })
  await prisma.clientModule.createMany({
    data: moduleRecords.map(m => ({ clientId: params.id, moduleId: m.id })),
    skipDuplicates: true,
  })
  return NextResponse.json({ success: true })
} 