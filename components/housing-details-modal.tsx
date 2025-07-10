'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, MapPin, Users, DollarSign, Wifi, Car, Dumbbell, Calendar, Phone } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface HousingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  housing: any
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'apartment':
      return Home
    case 'dorm':
      return Users
    case 'cabin':
      return Home
    case 'hotel':
      return Home
    default:
      return Home
  }
}

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case 'wifi':
      return Wifi
    case 'kitchen':
      return Home
    case 'parking':
      return Car
    case 'gym':
      return Dumbbell
    default:
      return Home
  }
}

export function HousingDetailsModal({ isOpen, onClose, housing }: HousingDetailsModalProps) {
  if (!housing) return null

  const TypeIcon = getTypeIcon(housing.type)
  const occupancyRate = housing.capacity > 0 ? (housing.occupied / housing.capacity) * 100 : 0

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
            className="relative w-full max-w-2xl mx-4 bg-white dark:bg-secondary-900 rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <TypeIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    {housing.name}
                  </h2>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {housing.type.charAt(0).toUpperCase() + housing.type.slice(1)} • {housing.location}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Home className="h-5 w-5 text-secondary-400" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">Type</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {housing.type.charAt(0).toUpperCase() + housing.type.slice(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-secondary-400" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">Location</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">{housing.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-secondary-400" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">Monthly Rate</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {formatCurrency(housing.monthlyRate)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-secondary-400" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">Occupancy</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {housing.occupied} / {housing.capacity} ({occupancyRate.toFixed(0)}%)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 rounded-full bg-secondary-400" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">Status</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {housing.status.charAt(0).toUpperCase() + housing.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  
                  {housing.assignedStaff && housing.assignedStaff.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-secondary-400" />
                      <div>
                        <p className="text-sm font-medium text-secondary-900 dark:text-white">Assigned Staff</p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {housing.assignedStaff.length} staff member{housing.assignedStaff.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amenities */}
              {housing.amenities && housing.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {housing.amenities.map((amenity: string) => {
                      const AmenityIcon = getAmenityIcon(amenity)
                      return (
                        <div key={amenity} className="flex items-center space-x-2 p-2 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                          <AmenityIcon className="h-4 w-4 text-secondary-400" />
                          <span className="text-sm text-secondary-700 dark:text-secondary-300">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Maintenance Notes */}
              {housing.maintenanceNotes && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Maintenance Notes</h3>
                  <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                    <p className="text-sm text-secondary-700 dark:text-secondary-300">{housing.maintenanceNotes}</p>
                  </div>
                </div>
              )}

              {/* Occupancy Progress */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">Occupancy Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600 dark:text-secondary-400">Occupancy Rate</span>
                    <span className="text-secondary-900 dark:text-white font-medium">{occupancyRate.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        occupancyRate >= 90 ? 'bg-error-500' :
                        occupancyRate >= 75 ? 'bg-warning-500' :
                        'bg-success-500'
                      }`}
                      style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-secondary-500 dark:text-secondary-400">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-secondary-200 dark:border-secondary-800">
              <button
                onClick={onClose}
                className="px-4 py-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 