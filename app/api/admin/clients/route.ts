import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/admin/clients - List all clients
export async function GET(req: NextRequest) {
  const clients = await prisma.client.findMany()
  return NextResponse.json({ clients })
} 