import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextRequest } from 'next/server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Extracts clientId from query, body, or header.
 * Returns null if not found.
 */
export async function extractClientId(req: NextRequest): Promise<string | null> {
  // Try query param
  const urlClientId = req.nextUrl?.searchParams?.get('clientId')
  if (urlClientId) return urlClientId

  // Try header
  const headerClientId = req.headers.get('x-client-id')
  if (headerClientId) return headerClientId

  // Try body (if POST/PUT)
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const body = await req.json()
      if (body && body.clientId) return body.clientId
    } catch (e) {
      // ignore
    }
  }
  return null
}

/**
 * Checks if the client has access to the given module name.
 * Returns true if access is granted, false otherwise.
 */
export async function checkModuleAccess(clientId: string, moduleName: string): Promise<boolean> {
  if (!clientId || !moduleName) return false
  const access = await prisma.clientModule.findFirst({
    where: { clientId, module: { name: moduleName } },
    include: { module: true },
  })
  return !!access
} 