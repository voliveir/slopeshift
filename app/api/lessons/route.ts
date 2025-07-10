import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { extractClientId, checkModuleAccess } from '../../../lib/utils'

const prisma = new PrismaClient()

// GET /api/lessons - List all lessons
export async function GET(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Lessons')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const lessons = await prisma.lesson.findMany({
    where: { clientId },
    include: {
      instructor: true,
      group: true,
    },
  })
  return NextResponse.json(lessons)
}

// POST /api/lessons - Create new lesson
export async function POST(req: NextRequest) {
  const clientId = await extractClientId(req)
  if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 })

  const hasAccess = await checkModuleAccess(clientId, 'Lessons')
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let data = {}
  try {
    data = await req.json()
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  data = { ...data, clientId }

  const lesson = await prisma.lesson.create({ data })
  return NextResponse.json(lesson, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 