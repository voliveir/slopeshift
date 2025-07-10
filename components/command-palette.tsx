"use client"
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandPaletteContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined)

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext)
  if (!ctx) throw new Error('useCommandPalette must be used within CommandPaletteProvider')
  return ctx
}

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Shifts', href: '/shifts' },
  { label: 'Staff', href: '/staff' },
  { label: 'Housing', href: '/housing' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Settings', href: '/settings/general' },
]

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(NAV_LINKS)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10)
    } else {
      setQuery('')
      setResults(NAV_LINKS)
    }
  }, [open])

  // Fuzzy search (simple)
  useEffect(() => {
    if (!query) {
      setResults(NAV_LINKS)
    } else {
      setResults(
        NAV_LINKS.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        )
      )
    }
  }, [query])

  // Handle navigation
  const handleSelect = useCallback((href: string) => {
    setOpen(false)
    router.push(href)
  }, [router])

  // Trap focus in modal
  useEffect(() => {
    if (!open) return
    const focusable = document.querySelectorAll(
      '.command-palette-modal button, .command-palette-modal input'
    )
    const first = focusable[0] as HTMLElement
    const last = focusable[focusable.length - 1] as HTMLElement
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [open])

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className="command-palette-modal mt-32 w-full max-w-lg bg-white dark:bg-secondary-900 rounded-xl shadow-large p-4"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              role="document"
            >
              <div className="flex items-center mb-2">
                <Search className="h-5 w-5 text-secondary-400 mr-2" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Jump to..."
                  aria-label="Command palette search"
                  className="flex-1 bg-transparent outline-none text-lg text-secondary-900 dark:text-white placeholder-secondary-400"
                />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close command palette"
                  className="ml-2 p-1 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ul className="max-h-64 overflow-y-auto divide-y divide-secondary-100 dark:divide-secondary-800">
                {results.length === 0 && (
                  <li className="py-4 text-center text-secondary-400">No results</li>
                )}
                {results.map((item) => (
                  <li key={item.href}>
                    <button
                      className="w-full text-left px-3 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded flex items-center text-secondary-900 dark:text-white focus:bg-primary-100 dark:focus:bg-primary-900/30 focus:outline-none"
                      onClick={() => handleSelect(item.href)}
                      tabIndex={0}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-xs text-secondary-400 text-right">
                <kbd className="px-1 py-0.5 bg-secondary-100 dark:bg-secondary-800 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-secondary-100 dark:bg-secondary-800 rounded">K</kbd> or <kbd className="px-1 py-0.5 bg-secondary-100 dark:bg-secondary-800 rounded">⌘</kbd> + <kbd className="px-1 py-0.5 bg-secondary-100 dark:bg-secondary-800 rounded">K</kbd>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CommandPaletteContext.Provider>
  )
} 