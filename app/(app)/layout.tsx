'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { ToastProvider } from '@/components/toast'
import { CommandPaletteProvider } from '@/components/command-palette'
import { useAllowedModules } from '@/hooks/useAllowedModules'

const CLIENT_ID = typeof window !== 'undefined' ? localStorage.getItem('clientId') : null

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/shifts': 'Shift Schedule',
  '/staff': 'Staff Management',
  '/housing': 'Housing Management',
  '/certifications': 'Certifications',
  '/settings/general': 'General Settings',
  '/settings/roles': 'Roles & Permissions',
  '/settings/integrations': 'Integrations',
  '/settings/billing': 'Billing',
}

function getTitle(pathname: string) {
  if (routeTitles[pathname]) return routeTitles[pathname]
  if (pathname.startsWith('/settings/')) {
    const key = Object.keys(routeTitles).find(k => pathname.startsWith(k))
    if (key) return routeTitles[key]
    return 'Settings'
  }
  return routeTitles['/dashboard']
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const title = getTitle(pathname)
  const { modules: allowedModules } = useAllowedModules(CLIENT_ID)

  // Impersonation banner logic
  const [impersonating, setImpersonating] = useState<string | null>(null)
  const [impersonatedClientName, setImpersonatedClientName] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem('clientId')
      setImpersonating(cid)
      if (cid) {
        // Try to get the client name from allowedModules or fetch from API
        fetch(`/api/admin/clients/${cid}`)
          .then(res => res.json())
          .then(data => setImpersonatedClientName(data.client?.name || cid))
          .catch(() => setImpersonatedClientName(cid))
      } else {
        setImpersonatedClientName(null)
      }
    }
  }, [CLIENT_ID])

  const handleStopImpersonate = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clientId')
      window.location.href = '/admin'
    }
  }

  return (
    <CommandPaletteProvider>
      <ToastProvider>
        <div className="flex h-screen bg-secondary-50 dark:bg-secondary-950">
          {/* Sidebar */}
          <Sidebar className="hidden md:flex" allowedModules={allowedModules} />
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Impersonation Banner */}
            {impersonating && impersonatedClientName && (
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border-b border-yellow-400 dark:border-yellow-700 flex items-center justify-between shadow">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-yellow-800 dark:text-yellow-200">Impersonating:</span>
                  <span className="font-semibold text-yellow-900 dark:text-yellow-100">{impersonatedClientName}</span>
                </div>
                <button
                  onClick={handleStopImpersonate}
                  className="ml-4 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 font-semibold"
                >
                  Stop Impersonating
                </button>
              </div>
            )}
            {/* Top Bar with animated title */}
            <TopBar
              title={
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="block"
                  >
                    {title}
                  </motion.span>
                </AnimatePresence>
              }
            />
            {/* Page Content */}
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </CommandPaletteProvider>
  )
} 