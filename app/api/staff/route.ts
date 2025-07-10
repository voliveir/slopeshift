import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/staff?clientId=abc - List all staff for a client
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  // Check module access
  const hasAccess = await checkModuleAccess(clientId, 'Staff')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const staff = await prisma.staff.findMany({
    where: { clientId },
    include: {
      assignedTasks: true,
      shifts: true,
      housingResidencies: true,
    },
  })
  return NextResponse.json(staff)
}

// POST /api/staff - Create new staff for a client
export async function POST(req: NextRequest) {
  // extractClientId will also parse body if needed
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  // Check module access
  const hasAccess = await checkModuleAccess(clientId, 'Staff')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Parse body and ensure clientId is set
  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  // TODO: Add input validation and error handling
  const staff = await prisma.staff.create({ data })
  return NextResponse.json(staff, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 