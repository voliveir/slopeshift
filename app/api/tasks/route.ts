import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tasks - List all tasks
export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      assignedStaff: true,
      asset: true,
      workOrderLogs: true,
    },
  })
  return NextResponse.json(tasks)
}

// POST /api/tasks - Create new task (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const task = await prisma.task.create({ data })
  return NextResponse.json(task, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 