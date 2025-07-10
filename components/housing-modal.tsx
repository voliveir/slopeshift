'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, MapPin, Users, DollarSign, Save, Loader2, Wifi, Car, Dumbbell } from 'lucide-react'
import { createHousing, updateHousing } from '@/lib/data/housing'
import { Housing } from '@/types'

interface HousingModalProps {
  isOpen: boolean
  onClose: () => void
  onHousingCreated: (housing: Housing) => void
  housing?: Housing | null
}

const housingTypes = ['apartment', 'dorm', 'cabin', 'hotel']
const housingStatuses = ['available', 'full', 'maintenance', 'reserved']
const availableAmenities = [
  'WiFi',
  'Kitchen',
  'Laundry',
  'Common Room',
  'Balcony',
  'Parking',
  'Fireplace',
  'Deck',
  'Hot Tub',
  'Daily Housekeeping',
  'Gym',
  'Restaurant',
  'Air Conditioning',
  'Heating',
  'Cable TV',
  'Internet'
]

export function HousingModal({ isOpen, onClose, onHousingCreated, housing }: HousingModalProps) {
  const [formData, setFormData] = useState({
    name: housing?.name || '',
    type: housing?.type || '',
    capacity: housing?.capacity?.toString() || '',
    location: housing?.location || '',
    status: housing?.status || 'available',
    monthlyRate: housing?.monthlyRate?.toString() || '',
    amenities: housing?.amenities || [],
    maintenanceNotes: housing?.maintenanceNotes || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormData({
      name: housing?.name || '',
      type: housing?.type || '',
      capacity: housing?.capacity?.toString() || '',
      location: housing?.location || '',
      status: housing?.status || 'available',
      monthlyRate: housing?.monthlyRate?.toString() || '',
      amenities: housing?.amenities || [],
      maintenanceNotes: housing?.maintenanceNotes || '',
    })
    setValidationErrors([])
    setError(null)
  }, [isOpen, housing])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (validationErrors.length > 0) setValidationErrors([])
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const validate = () => {
    const errors: string[] = []
    if (!formData.name) errors.push('Name is required')
    if (!formData.type) errors.push('Type is required')
    if (!formData.capacity || isNaN(Number(formData.capacity))) errors.push('Capacity is required and must be a number')
    if (!formData.location) errors.push('Location is required')
    if (!formData.status) errors.push('Status is required')
    if (!formData.monthlyRate || isNaN(Number(formData.monthlyRate))) errors.push('Monthly rate is required and must be a number')
    if (Number(formData.capacity) <= 0) errors.push('Capacity must be greater than 0')
    if (Number(formData.monthlyRate) < 0) errors.push('Monthly rate cannot be negative')
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors = validate()
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const housingData: Partial<Housing> = {
        name: formData.name,
        type: formData.type as Housing['type'],
        capacity: Number(formData.capacity),
        occupied: housing?.occupied || 0,
        location: formData.location,
        status: formData.status as Housing['status'],
        amenities: formData.amenities,
        monthlyRate: Number(formData.monthlyRate),
        maintenanceNotes: formData.maintenanceNotes || undefined,
      }
      let result: Housing
      if (housing && housing.id) {
        result = await updateHousing(housing.id, housingData)
      } else {
        result = await createHousing(housingData)
      }
      onHousingCreated(result)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save housing.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
                  <Home className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Add Housing Unit
                  </h2>
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
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {validationErrors.length > 0 && (
                <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-lg">
                  <div className="text-sm font-medium text-error-800 dark:text-error-200 mb-2">
                    Please fix the following errors:
                  </div>
                  <ul className="text-sm text-error-700 dark:text-error-300 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-error-600 dark:text-error-400 mr-2">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {error && (
                <div className="p-3 bg-error-50 border border-error-200 rounded text-error-700 mb-2">{error}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <Home className="h-4 w-4 inline mr-2" /> Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={e => handleInputChange('type', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select type</option>
                    {housingTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <Users className="h-4 w-4 inline mr-2" /> Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={e => handleInputChange('capacity', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" /> Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => handleInputChange('location', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => handleInputChange('status', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {housingStatuses.map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-2" /> Monthly Rate
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.monthlyRate}
                    onChange={e => handleInputChange('monthlyRate', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableAmenities.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        formData.amenities.includes(amenity)
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border-secondary-300 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
              {/* Maintenance Notes */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Maintenance Notes (Optional)
                </label>
                <textarea
                  value={formData.maintenanceNotes}
                  onChange={e => handleInputChange('maintenanceNotes', e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Add any maintenance notes or special instructions..."
                />
              </div>
              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary-200 dark:border-secondary-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Add Housing</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 