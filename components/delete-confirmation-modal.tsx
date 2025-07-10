'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemName?: string
  isDeleting?: boolean
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  itemName,
  isDeleting = false 
}: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md mx-4 bg-white dark:bg-secondary-900 rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-error-100 dark:bg-error-900/30 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-error-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    {title}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-secondary-700 dark:text-secondary-300 mb-4">
                {message}
              </p>
              {itemName && (
                <div className="p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg mb-4">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {itemName}
                  </p>
                </div>
              )}
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-6">
                This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="px-4 py-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-error-600 hover:bg-error-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 