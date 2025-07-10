'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { ToastProvider } from '@/components/toast'
import { CommandPaletteProvider } from '@/components/command-palette'
import { useAllowedModules } from '@/hooks/useAllowedModules'

// TODO: Replace this with actual clientId from auth/session
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
  // Try exact match, then partial for settings subroutes
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
  // Use the custom hook to fetch allowed modules
  const { modules: allowedModules } = useAllowedModules(CLIENT_ID)
  return (
    <CommandPaletteProvider>
      <ToastProvider>
        <div className="flex h-screen bg-secondary-50 dark:bg-secondary-950">
          {/* Sidebar */}
          <Sidebar className="hidden md:flex" allowedModules={allowedModules} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
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