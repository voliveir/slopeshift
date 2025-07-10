'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mountain, Menu, X } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Integrations', href: '#integrations' },
    { name: 'Resources', href: '#resources' },
    { name: 'About', href: '#about' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-2"
          >
            <Mountain className="h-8 w-8 text-primary-alpine" />
            <span className="text-xl font-bold text-gray-900">SlopeShift</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ scale: 1.05 }}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {link.name}
              </motion.a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Login
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-primary-alpine text-white px-6 py-2 rounded-full shadow-soft hover:shadow-medium transition-all duration-200"
            >
              Request a Demo
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <a href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-2 block">
                  Login
                </a>
                <button className="bg-primary-alpine text-white px-6 py-2 rounded-full shadow-soft hover:shadow-medium transition-all duration-200 w-full">
                  Request a Demo
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
} 