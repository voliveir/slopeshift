'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Calendar, User, FileText, Building, Hash } from 'lucide-react'
import { Button } from '@/components/button'
import { Certification } from '@/types'
import { createCertification, updateCertification } from '@/lib/data/certifications'
import { getStaff } from '@/lib/data/staff'
import type { Staff } from '@/types'

interface CertificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (certification: Certification) => void
  certification?: Certification | null
}

const certificationTypes = [
  'Ski Instruction',
  'First Aid',
  'Equipment Operation',
  'Food Safety',
  'Safety Training',
  'Lift Operation',
  'Snow Grooming',
  'Guest Services',
  'Other'
]

const issuingAuthorities = [
  'PSIA',
  'Red Cross',
  'NSAA',
  'ServSafe',
  'State Department',
  'Local Authority',
  'Other'
]

export function CertificationModal({ isOpen, onClose, onSubmit, certification }: CertificationModalProps) {
  const [formData, setFormData] = useState({
    staffId: certification?.staffId || '',
    staffName: certification?.staffName || '',
    type: certification?.type || '',
    name: certification?.name || '',
    issueDate: certification?.issueDate || '',
    expiryDate: certification?.expiryDate || '',
    issuingAuthority: certification?.issuingAuthority || '',
    certificateNumber: certification?.certificateNumber || '',
    notes: certification?.notes || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [staffLoading, setStaffLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        staffId: certification?.staffId || '',
        staffName: certification?.staffName || '',
        type: certification?.type || '',
        name: certification?.name || '',
        issueDate: certification?.issueDate || '',
        expiryDate: certification?.expiryDate || '',
        issuingAuthority: certification?.issuingAuthority || '',
        certificateNumber: certification?.certificateNumber || '',
        notes: certification?.notes || ''
      })
      setErrors({})
      setError(null)
    }
  }, [isOpen, certification])

  useEffect(() => {
    setStaffLoading(true)
    getStaff()
      .then(data => setStaffList(data))
      .catch(() => setStaffList([]))
      .finally(() => setStaffLoading(false))
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.staffId) {
      newErrors.staffId = 'Staff member is required'
    }
    if (!formData.type) {
      newErrors.type = 'Certification type is required'
    }
    if (!formData.name) {
      newErrors.name = 'Certification name is required'
    }
    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required'
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    }
    if (!formData.issuingAuthority) {
      newErrors.issuingAuthority = 'Issuing authority is required'
    }
    if (!formData.certificateNumber) {
      newErrors.certificateNumber = 'Certificate number is required'
    }

    // Validate dates
    if (formData.issueDate && formData.expiryDate) {
      const issueDate = new Date(formData.issueDate)
      const expiryDate = new Date(formData.expiryDate)
      
      if (expiryDate <= issueDate) {
        newErrors.expiryDate = 'Expiry date must be after issue date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      // Calculate status based on expiry date
      const today = new Date()
      const expiryDate = new Date(formData.expiryDate)
      const diffTime = expiryDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      let status: 'active' | 'expired' | 'expiring_soon' | 'pending'
      if (diffDays < 0) {
        status = 'expired'
      } else if (diffDays <= 30) {
        status = 'expiring_soon'
      } else {
        status = 'active'
      }
      // Format dates as YYYY-MM-DD
      const formatDateString = (date: string) => date ? new Date(date).toISOString().split('T')[0] : '';
      const certData = {
        staff_id: formData.staffId,
        staff_name: formData.staffName,
        type: formData.type,
        name: formData.name,
        issue_date: formatDateString(formData.issueDate),
        expiry_date: formatDateString(formData.expiryDate),
        status,
        issuing_authority: formData.issuingAuthority,
        certificate_number: formData.certificateNumber,
        notes: formData.notes || undefined
      }
      let result: Certification
      if (certification && certification.id) {
        result = await updateCertification(certification.id, certData)
      } else {
        result = await createCertification(certData)
      }
      onSubmit(result)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save certification.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStaffChange = (staffId: string) => {
    setFormData(prev => ({
      ...prev,
      staffId,
      staffName: ''
    }))
    if (errors.staffId) {
      setErrors(prev => ({ ...prev, staffId: '' }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl mx-4 bg-white dark:bg-secondary-900 rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Award className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Add New Certification
                  </h2>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Create a new certification record for staff member
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Staff Selection */}
              <div>
                <label htmlFor="staffId" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Staff Member *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                  <select
                    id="staffId"
                    value={formData.staffId}
                    onChange={(e) => handleStaffChange(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 bg-secondary-50 dark:bg-secondary-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.staffId 
                        ? 'border-error-300 focus:border-error-500' 
                        : 'border-secondary-200 dark:border-secondary-700 focus:border-primary-500'
                    }`}
                    aria-describedby={errors.staffId ? 'staffId-error' : undefined}
                    disabled={staffLoading || staffList.length === 0}
                  >
                    <option value="">{staffLoading ? 'Loading staff...' : staffList.length === 0 ? 'No staff available' : 'Select a staff member'}</option>
                    {staffList.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name} - {staff.position}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.staffId && (
                  <p id="staffId-error" className="mt-1 text-sm text-error-600">
                    {errors.staffId}
                  </p>
                )}
              </div>

              {/* Certification Type and Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Certification Type *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 bg-secondary-50 dark:bg-secondary-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.type 
                          ? 'border-error-300 focus:border-error-500' 
                          : 'border-secondary-200 dark:border-secondary-700 focus:border-primary-500'
                      }`}
                      aria-describedby={errors.type ? 'type-error' : undefined}
                    >
                      <option value="">Select type</option>
                      {certificationTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.type && (
                    <p id="type-error" className="mt-1 text-sm text-error-600">
                      {errors.type}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., PSIA Level 2, CPR & First Aid"
                    className={`w-full px-3 py-2 bg-secondary-50 dark:bg-secondary-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.name 
                        ? 'border-error-300 focus:border-error-500' 
                        : 'border-secondary-200 dark:border-secondary-700 focus:border-primary-500'
                    }`}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-error-600">
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Issue and Expiry Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="issueDate" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Issue Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                    <input
                      type="date"
                      id="issueDate"
                      value={formData.issueDate}
                      onChange={(e) => handleInputChange('issueDate', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 bg-secondary-50 dark:bg-secondary-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.issueDate 
                          ? 'border-error-300 focus:border-error-500' 
                          : 'border-secondary-200 dark:border-secondary-700 focus:border-primary-500'
                      }`}
                      aria-describedby={errors.issueDate ? 'issueDate-error' : undefined}
                    />
                  </div>
                  {errors.issueDate && (
                    <p id="issueDate-error" className="mt-1 text-sm text-error-600">
                      {errors.issueDate}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Expiry Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                    <input
                      type="date"
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 bg-secondary-50 dark:bg-secondary-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.expiryDate 
                          ? 'border-error-300 focus:border-error-500' 
                          : 'border-secondary-200 dark:border-secondary-700 focus:border-primary-500'
                      }`}
                      aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
                    />
                  </div>
                  {errors.expiryDate && (
                    <p id="expiryDate-error" className="mt-1 text-sm text-error-600">
                      {errors.expiryDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Issuing Authority and Certificate Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="issuingAuthority" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Issuing Authority *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                    <select
                      id="issuingAuthority"
                      value={formData.issuingAuthority}
                      onChange={(e) => handleInputChange('issuingAuthority', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 bg-secondary-50 dark:bg-secondary-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.issuingAuthority 
                          ? 'border-error-300 focus:border-error-500' 
                          : 'border-secondary-200 dark:border-secondary-700 focus:border-primary-500'
                      }`}
                      aria-describedby={errors.issuingAuthority ? 'issuingAuthority-error' : undefined}
                    >
                      <option value="">Select authority</option>
                      {issuingAuthorities.map(authority => (
                        <option key={authority} value={authority}>
                          {authority}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.issuingAuthority && (
                    <p id="issuingAuthority-error" className="mt-1 text-sm text-error-600">
                      {errors.issuingAuthority}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="certificateNumber" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Certificate Number *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                    <input
                      type="text"
                      id="certificateNumber"
                      value={formData.certificateNumber}
                      onChange={(e) => handleInputChange('certificateNumber', e.target.value)}
                      placeholder="e.g., PSIA-2023-001"
                      className={`w-full pl-10 pr-3 py-2 bg-secondary-50 dark:bg-secondary-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.certificateNumber 
                          ? 'border-error-300 focus:border-error-500' 
                          : 'border-secondary-200 dark:border-secondary-700 focus:border-primary-500'
                      }`}
                      aria-describedby={errors.certificateNumber ? 'certificateNumber-error' : undefined}
                    />
                  </div>
                  {errors.certificateNumber && (
                    <p id="certificateNumber-error" className="mt-1 text-sm text-error-600">
                      {errors.certificateNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes about this certification..."
                  rows={3}
                  className="w-full px-3 py-2 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Certification'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 