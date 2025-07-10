import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/forms - List all form templates and responses
export async function GET() {
  const templates = await prisma.formTemplate.findMany({
    include: { responses: true },
  })
  const responses = await prisma.formResponse.findMany({
    include: { template: true, guest: true },
  })
  return NextResponse.json({ templates, responses })
}

// POST /api/forms - Create new form template or response (basic, TODO: validation, error handling, distinguish type)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add logic to distinguish between template and response creation
  // For now, assume template creation
  const template = await prisma.formTemplate.create({ data })
  return NextResponse.json(template, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 