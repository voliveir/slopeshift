'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  ChevronDown
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface TopBarProps {
  title: React.ReactNode
  className?: string
}

export function TopBar({ title, className }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const { theme, setTheme } = useTheme()

  const user = {
    name: 'Admin User',
    email: 'admin@slopeshift.com',
    avatar: null
  }

  const notifications = [
    {
      id: '1',
      title: 'New shift assigned',
      message: 'You have a new shift scheduled for tomorrow',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: '2',
      title: 'Certification expiring',
      message: 'CPR certification expires in 30 days',
      time: '1 hour ago',
      unread: true
    }
  ]

  return (
    <div className={cn(
      "bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-800 px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-secondary-900 dark:text-white">
            {title}
          </h1>
        </div>

        {/* Right side - Search, Notifications, User */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
            ) : (
              <Moon className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <Bell className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-secondary-900 rounded-lg shadow-large border border-secondary-200 dark:border-secondary-800 z-50"
                >
                  <div className="p-4 border-b border-secondary-200 dark:border-secondary-800">
                    <h3 className="font-semibold text-secondary-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer",
                          notification.unread && "bg-primary-50 dark:bg-primary-900/20"
                        )}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <p className="font-medium text-secondary-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="h-2 w-2 bg-primary-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {user.email}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-secondary-400" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-secondary-900 rounded-lg shadow-large border border-secondary-200 dark:border-secondary-800 z-50"
                >
                  <div className="p-4 border-b border-secondary-200 dark:border-secondary-800">
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors">
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
} 