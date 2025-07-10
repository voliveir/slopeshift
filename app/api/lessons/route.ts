import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/lessons - List all lessons
export async function GET() {
  const lessons = await prisma.lesson.findMany({
    include: {
      instructor: true,
      group: true,
    },
  })
  return NextResponse.json(lessons)
}

// POST /api/lessons - Create new lesson (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const lesson = await prisma.lesson.create({ data })
  return NextResponse.json(lesson, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 