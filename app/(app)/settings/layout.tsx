'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const settingsNav = [
  { name: 'General', href: '/settings/general' },
  { name: 'Roles & Permissions', href: '/settings/roles' },
  { name: 'Integrations', href: '/settings/integrations' },
  { name: 'Billing', href: '/settings/billing' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="flex gap-8">
      <aside className="w-64 pt-8">
        <nav className="flex flex-col gap-2">
          {settingsNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                pathname === item.href
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="flex-1 pt-8">{children}</section>
    </div>
  )
} 