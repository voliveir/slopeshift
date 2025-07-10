"use client"

import React, { useState, useEffect } from 'react'
import { Mountain } from 'lucide-react'

const ADMIN_PASSWORD = 'password'; // Change this for your team

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuthed(localStorage.getItem('isSlopeShiftAdmin') === 'true')
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('isSlopeShiftAdmin', 'true')
      setIsAuthed(true)
      setError('')
      window.location.reload()
    } else {
      setError('Incorrect password')
    }
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-primary-alpine/10 dark:from-secondary-950 dark:via-secondary-900 dark:to-primary-alpine/10">
        <div className="bg-white dark:bg-secondary-900 p-8 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100 dark:border-secondary-800">
          <h2 className="text-2xl font-bold mb-4 text-center text-primary-alpine flex items-center justify-center gap-2">
            <Mountain className="h-7 w-7 text-primary-alpine" /> SlopeShift Admin Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-alpine focus:outline-none"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-primary-alpine text-white py-2 rounded-full font-semibold shadow-soft hover:bg-primary-alpine/90 transition-all">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-alpine/10 dark:from-secondary-950 dark:via-secondary-900 dark:to-primary-alpine/10">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-gray-100 dark:border-secondary-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-4">
          <Mountain className="h-8 w-8 text-primary-alpine" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">SlopeShift Admin</span>
        </div>
      </header>
      <main className="flex justify-center py-12 px-2 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-5xl bg-white dark:bg-secondary-900 rounded-2xl shadow-xl border border-gray-100 dark:border-secondary-800 p-8 md:p-12 mt-4">
          {children}
        </div>
      </main>
    </div>
  )
} 