import React from 'react'
import { cn } from '@/lib/utils'

export interface StatusPillProps {
  status: 'active' | 'inactive' | 'on_leave' | 'pending' | 'expired' | 'expiring_soon' | 'full' | 'available' | 'maintenance' | 'reserved' | string
  children?: React.ReactNode
  className?: string
}

const statusColor: Record<string, string> = {
  active: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400',
  inactive: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400',
  on_leave: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
  pending: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
  expired: 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400',
  expiring_soon: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
  full: 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400',
  available: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400',
  maintenance: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
  reserved: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400',
}

export function StatusPill({ status, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium',
        statusColor[status] || statusColor['inactive'],
        className
      )}
    >
      {children || status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
  )
} 