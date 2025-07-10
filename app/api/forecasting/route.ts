import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/forecasting - List all forecasting suggestions
export async function GET() {
  const suggestions = await prisma.forecastingSuggestion.findMany()
  return NextResponse.json(suggestions)
}

// POST /api/forecasting - Create new suggestion (basic, TODO: validation, error handling)
export async function POST(req: NextRequest) {
  const data = await req.json()
  // TODO: Add input validation and error handling
  const suggestion = await prisma.forecastingSuggestion.create({ data })
  return NextResponse.json(suggestion, { status: 201 })
}

// TODO: Add PUT, DELETE, and advanced filtering as needed 