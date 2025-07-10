'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, Building, Calendar, DollarSign, Save, Loader2, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { createStaff, updateStaff } from '@/lib/data/staff'
import { Staff } from '@/types'

interface StaffModalProps {
  isOpen: boolean
  onClose: () => void
  onStaffCreated: (staff: Staff) => void
  staff?: Staff | null
}

const departments = [
  'Ski School',
  'Mountain Operations',
  'Food & Beverage',
  'Lodging',
  'Security',
  'Medical',
  'Administration',
  'Maintenance',
  'Guest Services',
]

const positions = [
  'Ski Instructor',
  'Lift Operator',
  'Food Service Manager',
  'Snow Groomer',
  'Security Guard',
  'EMT',
  'Front Desk',
  'Housekeeper',
  'Maintenance Worker',
  'Manager',
]

const statuses = ['active', 'inactive', 'on_leave']

export function StaffModal({ isOpen, onClose, onStaffCreated, staff }: StaffModalProps) {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
    position: staff?.position || '',
    department: staff?.department || '',
    hireDate: staff?.hireDate || '',
    hourlyRate: staff?.hourlyRate?.toString() || '',
    status: staff?.status || 'active',
    emergencyContactName: staff?.emergency_contact_name || '',
    emergencyContactPhone: staff?.emergency_contact_phone || '',
    emergencyContactRelationship: staff?.emergency_contact_relationship || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormData({
      name: staff?.name || '',
      email: staff?.email || '',
      phone: staff?.phone || '',
      position: staff?.position || '',
      department: staff?.department || '',
      hireDate: staff?.hireDate || '',
      hourlyRate: staff?.hourlyRate?.toString() || '',
      status: staff?.status || 'active',
      emergencyContactName: staff?.emergency_contact_name || '',
      emergencyContactPhone: staff?.emergency_contact_phone || '',
      emergencyContactRelationship: staff?.emergency_contact_relationship || '',
    })
    setValidationErrors([])
    setError(null)
  }, [isOpen, staff])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (validationErrors.length > 0) setValidationErrors([])
  }

  const validate = () => {
    const errors: string[] = []
    if (!formData.name) errors.push('Name is required')
    if (!formData.email) errors.push('Email is required')
    if (!formData.phone) errors.push('Phone is required')
    if (!formData.position) errors.push('Position is required')
    if (!formData.department) errors.push('Department is required')
    if (!formData.hireDate) errors.push('Hire date is required')
    if (!formData.hourlyRate || isNaN(Number(formData.hourlyRate))) errors.push('Hourly rate is required and must be a number')
    if (!formData.status) errors.push('Status is required')
    if (!formData.emergencyContactName) errors.push('Emergency contact name is required')
    if (!formData.emergencyContactPhone) errors.push('Emergency contact phone is required')
    if (!formData.emergencyContactRelationship) errors.push('Emergency contact relationship is required')
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
      const staffData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        hire_date: formData.hireDate,
        hourly_rate: Number(formData.hourlyRate),
        status: formData.status as Staff['status'],
        avatar: staff?.avatar,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        emergency_contact_relationship: formData.emergencyContactRelationship,
      }
      let result: Staff
      if (staff && staff.id) {
        result = await updateStaff(staff.id, staffData)
      } else {
        result = await createStaff(staffData)
      }
      onStaffCreated(result)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save staff member.')
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
            className="relative w-full max-w-lg mx-4 bg-white dark:bg-secondary-900 rounded-xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-800">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Add Staff Member
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
                    <User className="h-4 w-4 inline mr-2" /> Name
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
                    <Mail className="h-4 w-4 inline mr-2" /> Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" /> Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <Building className="h-4 w-4 inline mr-2" /> Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => handleInputChange('department', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={e => handleInputChange('position', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" /> Hire Date
                  </label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={e => handleInputChange('hireDate', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <DollarSign className="h-4 w-4 inline mr-2" /> Hourly Rate
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hourlyRate}
                    onChange={e => handleInputChange('hourlyRate', e.target.value)}
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
                    {statuses.map(status => (
                      <option key={status} value={status}>{status.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={e => handleInputChange('emergencyContactName', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactPhone}
                    onChange={e => handleInputChange('emergencyContactPhone', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Emergency Contact Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactRelationship}
                    onChange={e => handleInputChange('emergencyContactRelationship', e.target.value)}
                    className="w-full p-3 border border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
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
                      <span>Add Staff</span>
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