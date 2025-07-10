'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Home, 
  Award, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Mountain
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Shifts', href: '/shifts', icon: Calendar },
  { name: 'Staff', href: '/staff', icon: Users },
  { name: 'Housing', href: '/housing', icon: Home },
  { name: 'Certifications', href: '/certifications', icon: Award },
  { name: 'Settings', href: '/settings/general', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      className={cn(
        "bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800 flex flex-col h-full",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-800">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: collapsed ? 0 : 1 }}
          className="flex items-center space-x-2"
        >
          <Mountain className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-secondary-900 dark:text-white">
            SlopeShift
          </span>
        </motion.div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href.replace('/general', '')) && item.href.startsWith('/settings')
            ? pathname.startsWith('/settings')
            : pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group",
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                  : "text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: collapsed ? 0 : 1 }}
                className="font-medium"
              >
                {item.name}
              </motion.span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-800">
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: collapsed ? 0 : 1 }}
          className="text-xs text-secondary-500 dark:text-secondary-400 text-center"
        >
          v1.0.0
        </motion.div>
      </div>
    </motion.div>
  )
} 