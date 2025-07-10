import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/modules - List all modules
export async function GET(req: NextRequest) {
  const modules = await prisma.module.findMany()
  return NextResponse.json({ modules })
} 