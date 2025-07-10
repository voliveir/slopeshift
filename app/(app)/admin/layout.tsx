"use client"

import React, { useState, useEffect } from 'react'

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50 dark:bg-secondary-950">
        <div className="bg-white dark:bg-secondary-900 p-8 rounded shadow max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4">SlopeShift Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <header className="py-4 px-8 bg-primary-700 text-white font-bold text-2xl shadow">
        SlopeShift Admin
      </header>
      <main className="p-8">{children}</main>
    </div>
  )
} 