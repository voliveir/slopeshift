import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/tasks - List all tasks
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Tasks')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const tasks = await prisma.task.findMany({
    where: { clientId },
    include: {
      assignedStaff: true,
      asset: true,
      workOrderLogs: true,
    },
  })
  return NextResponse.json(tasks)
}

// POST /api/tasks - Create new task
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Tasks')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const task = await prisma.task.create({ data })
  return NextResponse.json(task, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 