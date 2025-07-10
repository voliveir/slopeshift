import React from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <header className="py-4 px-8 bg-primary-700 text-white font-bold text-2xl shadow">
        SlopeShift Admin
      </header>
      <main className="p-8">{children}</main>
    </div>
  )
} 