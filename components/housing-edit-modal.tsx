'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Home, MapPin, Users, DollarSign, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/button'
import { toast } from '@/components/toast'

interface HousingEditModalProps {
  isOpen: boolean
  onClose: () => void
  housing: any
  onSave: (updatedHousing: any) => void
}

const housingTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'dorm', label: 'Dormitory' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'hotel', label: 'Hotel Room' }
]

const housingStatuses = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Under Maintenance' },
  { value: 'reserved', label: 'Reserved' }
]

const commonAmenities = ['WiFi', 'Kitchen', 'Parking', 'Gym', 'Laundry', 'Air Conditioning', 'Heating', 'Balcony']

export function HousingEditModal({ isOpen, onClose, housing, onSave }: HousingEditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'apartment',
    capacity: 1,
    occupied: 0,
    location: '',
    status: 'available',
    amenities: [] as string[],
    monthlyRate: 0,
    maintenanceNotes: ''
  })
  const [newAmenity, setNewAmenity] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (housing) {
      setFormData({
        name: housing.name || '',
        type: housing.type || 'apartment',
        capacity: housing.capacity || 1,
        occupied: housing.occupied || 0,
        location: housing.location || '',
        status: housing.status || 'available',
        amenities: housing.amenities || [],
        monthlyRate: housing.monthlyRate || 0,
        maintenanceNotes: housing.maintenanceNotes || ''
      })
    }
  }, [housing])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1'
    }
    if (formData.occupied > formData.capacity) {
      newErrors.occupied = 'Occupied cannot exceed capacity'
    }
    if (formData.monthlyRate < 0) {
      newErrors.monthlyRate = 'Monthly rate cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const updatedHousing = {
      ...housing,
      ...formData
    }

    onSave(updatedHousing)
    toast.success('Housing unit updated successfully')
    onClose()
  }

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }))
      setNewAmenity('')
    }
  }

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }))
  }

  const addCommonAmenity = (amenity: string) => {
    if (!formData.amenities.includes(amenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenity]
      }))
    }
  }

  const isMaintenance = formData.status === 'maintenance';

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
            className="relative w-full max-w-2xl mx-4 bg-white dark:bg-secondary-900 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <Home className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Edit Housing Unit
                  </h2>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Update housing unit details
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={`px-3 py-1 rounded bg-warning-100 text-warning-800 text-xs font-semibold border border-warning-300 hover:bg-warning-200 ${isMaintenance ? 'ring-2 ring-warning-400' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, status: 'maintenance' }))}
                  disabled={isMaintenance}
                >
                  Mark as Under Maintenance
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.name ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white`}
                      placeholder="Enter housing unit name"
                    />
                    {errors.name && <p className="text-sm text-error-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                    >
                      {housingTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.location ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white`}
                      placeholder="Enter location"
                    />
                    {errors.location && <p className="text-sm text-error-500 mt-1">{errors.location}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.capacity ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white`}
                    />
                    {errors.capacity && <p className="text-sm text-error-500 mt-1">{errors.capacity}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Currently Occupied
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={formData.capacity}
                      value={formData.occupied}
                      onChange={(e) => setFormData(prev => ({ ...prev, occupied: parseInt(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.occupied ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white`}
                    />
                    {errors.occupied && <p className="text-sm text-error-500 mt-1">{errors.occupied}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                    >
                      {housingStatuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Monthly Rate ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.monthlyRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, monthlyRate: parseFloat(e.target.value) || 0 }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.monthlyRate ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-600'
                      } bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white`}
                      placeholder="0.00"
                    />
                    {errors.monthlyRate && <p className="text-sm text-error-500 mt-1">{errors.monthlyRate}</p>}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Amenities
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      className="flex-1 px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white"
                      placeholder="Add custom amenity"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    />
                    <Button
                      type="button"
                      onClick={addAmenity}
                      className="px-4 py-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Common Amenities */}
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-2">
                      {commonAmenities.map(amenity => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => addCommonAmenity(amenity)}
                          disabled={formData.amenities.includes(amenity)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            formData.amenities.includes(amenity)
                              ? 'bg-secondary-100 dark:bg-secondary-700 text-secondary-400 border-secondary-200 dark:border-secondary-600'
                              : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border-secondary-300 dark:border-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Amenities */}
                  {formData.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map(amenity => (
                        <div
                          key={amenity}
                          className="flex items-center space-x-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                        >
                          <span className="text-sm">{amenity}</span>
                          <button
                            type="button"
                            onClick={() => removeAmenity(amenity)}
                            className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Maintenance Notes Field (always visible, highlighted if maintenance) */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isMaintenance ? 'text-warning-700' : 'text-secondary-700 dark:text-secondary-300'}`}>
                  Maintenance Notes {isMaintenance && <span className="ml-1 text-xs text-warning-700">(Required for maintenance)</span>}
                </label>
                <textarea
                  value={formData.maintenanceNotes}
                  onChange={e => setFormData(prev => ({ ...prev, maintenanceNotes: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${isMaintenance ? 'border-warning-500 bg-warning-50' : 'border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800'} text-secondary-900 dark:text-white`}
                  placeholder="Enter maintenance notes, issues, or expected completion date"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-secondary-200 dark:border-secondary-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 