'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, MapPin, Users, User, Building, Save, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { createShift, updateShift } from '@/lib/data/shifts'
import { Shift } from '@/types'
import { getStaff } from '@/lib/data/staff';
import { Staff } from '@/types';
import { useRef } from 'react';

interface ShiftModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  onShiftCreated: (shift: Shift) => void
  existingShifts?: Shift[]
  shift?: Shift | null
}

interface ShiftFormData {
  staffId: string
  position: string
  department: string
  startTime: string
  endTime: string
  location: string
  notes: string
  template?: string
  isRecurring: boolean
  recurringPattern: {
    frequency: 'daily' | 'weekly' | 'monthly'
    interval: number
    endDate?: string
    daysOfWeek?: number[]
  }
}

const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30'
]

const locations = [
  'Main Lodge',
  'North Peak',
  'South Peak', 
  'Base Camp',
  'Equipment Rental',
  'Ski School',
  'Food Court',
  'Parking Lot',
  'Medical Center',
  'Security Office'
]

const departments = [
  'Ski Patrol',
  'Lift Operations',
  'Food & Beverage',
  'Equipment Rental',
  'Ski School',
  'Security',
  'Maintenance',
  'Administration',
  'Medical',
  'Guest Services'
]

const positions = [
  'Ski Patroller',
  'Lift Operator',
  'Cashier',
  'Cook',
  'Server',
  'Equipment Technician',
  'Ski Instructor',
  'Security Guard',
  'Maintenance Worker',
  'Administrative Assistant',
  'EMT',
  'Guest Service Representative'
]

// Shift Templates
const shiftTemplates = [
  {
    id: 'morning-lift',
    name: 'Morning Lift Operations',
    description: 'Early morning lift setup and operation',
    startTime: '06:00',
    endTime: '14:00',
    position: 'Lift Operator',
    department: 'Lift Operations',
    location: 'Main Lodge'
  },
  {
    id: 'afternoon-lift',
    name: 'Afternoon Lift Operations',
    description: 'Afternoon lift operation and closing',
    startTime: '14:00',
    endTime: '22:00',
    position: 'Lift Operator',
    department: 'Lift Operations',
    location: 'Main Lodge'
  },
  {
    id: 'ski-patrol',
    name: 'Ski Patrol',
    description: 'Full day ski patrol coverage',
    startTime: '08:00',
    endTime: '16:00',
    position: 'Ski Patroller',
    department: 'Ski Patrol',
    location: 'North Peak'
  },
  {
    id: 'food-service',
    name: 'Food Service',
    description: 'Lunch and dinner service',
    startTime: '10:00',
    endTime: '18:00',
    position: 'Server',
    department: 'Food & Beverage',
    location: 'Food Court'
  },
  {
    id: 'equipment-rental',
    name: 'Equipment Rental',
    description: 'Equipment rental and fitting',
    startTime: '08:00',
    endTime: '16:00',
    position: 'Equipment Technician',
    department: 'Equipment Rental',
    location: 'Equipment Rental'
  },
  {
    id: 'ski-school',
    name: 'Ski School',
    description: 'Ski instruction and lessons',
    startTime: '09:00',
    endTime: '17:00',
    position: 'Ski Instructor',
    department: 'Ski School',
    location: 'Ski School'
  }
]

// Validation functions
const validateShift = (formData: ShiftFormData, existingShifts: any[], selectedDate: Date | undefined) => {
  const errors: string[] = []
  
  // Basic validation
  if (!formData.staffId) errors.push('Staff member is required')
  if (!formData.position) errors.push('Position is required')
  if (!formData.department) errors.push('Department is required')
  if (!formData.location) errors.push('Location is required')
  
  // Time validation
  const startTime = new Date(`2000-01-01T${formData.startTime}`)
  const endTime = new Date(`2000-01-01T${formData.endTime}`)
  
  if (startTime >= endTime) {
    errors.push('End time must be after start time')
  }
  
  const shiftDuration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  if (shiftDuration > 12) {
    errors.push('Shift duration cannot exceed 12 hours')
  }
  
  // Conflict detection
  if (selectedDate && formData.staffId) {
    const dateString = selectedDate.toISOString().split('T')[0]
    const staffShifts = existingShifts.filter(shift => 
      shift.staffId === formData.staffId && shift.date === dateString
    )
    
    for (const existingShift of staffShifts) {
      const existingStart = new Date(`2000-01-01T${existingShift.startTime}`)
      const existingEnd = new Date(`2000-01-01T${existingShift.endTime}`)
      
      // Check for overlap
      if (
        (startTime < existingEnd && endTime > existingStart) ||
        (existingStart < endTime && existingEnd > startTime)
      ) {
        errors.push(`Conflict with existing shift: ${existingShift.staffName} (${existingShift.startTime}-${existingShift.endTime})`)
        break
      }
    }
  }
  
  // Recurring validation
  if (formData.isRecurring) {
    if (formData.recurringPattern.frequency === 'weekly' && formData.recurringPattern.daysOfWeek?.length === 0) {
      errors.push('Please select at least one day of the week for recurring shifts')
    }
    if (formData.recurringPattern.interval < 1) {
      errors.push('Recurring interval must be at least 1')
    }
  }
  
  return errors
}

export function ShiftModal({ isOpen, onClose, selectedDate, onShiftCreated, existingShifts = [], shift }: ShiftModalProps) {
  const [formData, setFormData] = useState<ShiftFormData>({
    staffId: shift?.staffId || '',
    position: shift?.position || '',
    department: shift?.department || '',
    startTime: shift?.startTime || '08:00',
    endTime: shift?.endTime || '16:00',
    location: shift?.location || '',
    notes: shift?.notes || '',
    isRecurring: false,
    recurringPattern: {
      frequency: 'weekly',
      interval: 1,
      daysOfWeek: []
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showTemplates, setShowTemplates] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isStaffLoading, setIsStaffLoading] = useState(true);
  const [staffError, setStaffError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setFormData({
      staffId: shift?.staffId || '',
      position: shift?.position || '',
      department: shift?.department || '',
      startTime: shift?.startTime || '08:00',
      endTime: shift?.endTime || '16:00',
      location: shift?.location || '',
      notes: shift?.notes || '',
      isRecurring: false,
      recurringPattern: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: []
      }
    })
    setValidationErrors([])
    setError(null)
  }, [isOpen, shift])

  useEffect(() => {
    setIsStaffLoading(true);
    getStaff()
      .then(data => setStaffList(data))
      .catch(err => setStaffError(err.message || 'Failed to load staff'))
      .finally(() => setIsStaffLoading(false));
  }, []);

  // On mount or when staff/positions/departments/locations change, auto-select if only one option
  useEffect(() => {
    if (staffList.length === 1 && !formData.staffId) {
      setFormData(prev => ({ ...prev, staffId: staffList[0].id }));
    }
  }, [staffList]);
  useEffect(() => {
    if (positions.length === 1 && !formData.position) {
      setFormData(prev => ({ ...prev, position: positions[0] }));
    }
  }, []);
  useEffect(() => {
    if (departments.length === 1 && !formData.department) {
      setFormData(prev => ({ ...prev, department: departments[0] }));
    }
  }, []);
  useEffect(() => {
    if (locations.length === 1 && !formData.location) {
      setFormData(prev => ({ ...prev, location: locations[0] }));
    }
  }, []);

  const handleInputChange = (field: keyof ShiftFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation errors when user makes changes
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleTemplateSelect = (template: any) => {
    setFormData(prev => ({
      ...prev,
      position: template.position,
      department: template.department,
      startTime: template.startTime,
      endTime: template.endTime,
      location: template.location,
      template: template.id
    }))
    setShowTemplates(false)
  }

  const handleRecurringChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      recurringPattern: {
        ...prev.recurringPattern,
        [field]: value
      }
    }))
  }

  const handleDayToggle = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      recurringPattern: {
        ...prev.recurringPattern,
        daysOfWeek: prev.recurringPattern.daysOfWeek?.includes(dayIndex)
          ? prev.recurringPattern.daysOfWeek.filter(d => d !== dayIndex)
          : [...(prev.recurringPattern.daysOfWeek || []), dayIndex]
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate form
    const errors = validateShift(formData, existingShifts, selectedDate)
    setValidationErrors(errors)
    if (errors.length > 0) {
      // Scroll to first error
      setTimeout(() => {
        if (formRef.current) {
          const errorElem = formRef.current.querySelector('.field-error');
          if (errorElem) {
            (errorElem as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const dateString = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      const selectedStaff = staffList.find(s => s.id === formData.staffId);
      const shiftData: Omit<Shift, 'id'> = {
        staffId: formData.staffId,
        staffName: selectedStaff ? selectedStaff.name : '',
        position: formData.position,
        department: formData.department,
        date: dateString,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        notes: formData.notes,
        status: shift?.status || 'scheduled',
        hourlyRate: shift?.hourlyRate || 0
      }
      let result: Shift
      if (shift && shift.id) {
        result = await updateShift(shift.id, shiftData)
      } else {
        result = await createShift(shiftData)
      }
      onShiftCreated(result)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to save shift.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateRecurringShifts = (formData: ShiftFormData, selectedStaff: any, startDate: Date | undefined) => {
    if (!startDate) return []
    
    const shifts = []
    const baseDate = new Date(startDate)
    const endDate = formData.recurringPattern.endDate 
      ? new Date(formData.recurringPattern.endDate)
      : new Date(baseDate.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days default
    
    let currentDate = new Date(baseDate)
    let shiftCount = 0
    const maxShifts = 50 // Prevent infinite loops
    
    while (currentDate <= endDate && shiftCount < maxShifts) {
      if (formData.recurringPattern.frequency === 'weekly') {
        if (formData.recurringPattern.daysOfWeek?.includes(currentDate.getDay())) {
          shifts.push({
            id: `shift-${Date.now()}-${shiftCount}`,
            staffId: formData.staffId,
            staffName: selectedStaff?.name || 'Unknown Staff',
            position: formData.position,
            department: formData.department,
            date: currentDate.toISOString().split('T')[0],
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location,
            notes: formData.notes,
            status: 'scheduled',
            pending: false
          })
          shiftCount++
        }
        currentDate.setDate(currentDate.getDate() + formData.recurringPattern.interval)
      } else if (formData.recurringPattern.frequency === 'daily') {
        shifts.push({
          id: `shift-${Date.now()}-${shiftCount}`,
          staffId: formData.staffId,
          staffName: selectedStaff?.name || 'Unknown Staff',
          position: formData.position,
          department: formData.department,
          date: currentDate.toISOString().split('T')[0],
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          notes: formData.notes,
          status: 'scheduled',
          pending: false
        })
        shiftCount++
        currentDate.setDate(currentDate.getDate() + formData.recurringPattern.interval)
      }
    }
    
    return shifts
  }

  const isFormValid = formData.staffId && formData.position && formData.department && formData.location && validationErrors.length === 0

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
                  <Calendar className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
                    Create New Shift
                  </h2>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {selectedDate ? `For ${formatDate(selectedDate)}` : 'Select a date'}
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

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Templates */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Quick Templates
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    {showTemplates ? 'Hide' : 'Show'} Templates
                  </button>
                </div>
                
                {showTemplates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4"
                  >
                    {shiftTemplates.map(template => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(template)}
                        className="p-3 text-left border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                      >
                        <div className="font-medium text-secondary-900 dark:text-white">
                          {template.name}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400">
                          {template.description}
                        </div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                          {template.startTime} - {template.endTime} • {template.location}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Validation Errors */}
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

              {/* Staff Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Staff Member
                </label>
                <select
                  value={formData.staffId}
                  onChange={(e) => handleInputChange('staffId', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${!formData.staffId && validationErrors.some(e => e.toLowerCase().includes('staff')) ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-700'}`}
                  required
                  disabled={isStaffLoading || !!staffError}
                >
                  <option value="">{isStaffLoading ? 'Loading staff...' : staffError ? 'Failed to load staff' : 'Select a staff member'}</option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
                {!formData.staffId && validationErrors.some(e => e.toLowerCase().includes('staff')) && (
                  <div className="text-error-600 text-xs mt-1 field-error">Staff member is required</div>
                )}
                {staffError && <div className="text-error-600 text-xs mt-1">{staffError}</div>}
              </div>

              {/* Position and Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${!formData.position && validationErrors.some(e => e.toLowerCase().includes('position')) ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-700'}`}
                    required
                  >
                    <option value="">Select position</option>
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                  {!formData.position && validationErrors.some(e => e.toLowerCase().includes('position')) && (
                    <div className="text-error-600 text-xs mt-1 field-error">Position is required</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <Building className="h-4 w-4 inline mr-2" />
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${!formData.department && validationErrors.some(e => e.toLowerCase().includes('department')) ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-700'}`}
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {!formData.department && validationErrors.some(e => e.toLowerCase().includes('department')) && (
                    <div className="text-error-600 text-xs mt-1 field-error">Department is required</div>
                  )}
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Start Time
                  </label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${!formData.startTime && validationErrors.some(e => e.toLowerCase().includes('start time')) ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-700'}`}
                    required
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {!formData.startTime && validationErrors.some(e => e.toLowerCase().includes('start time')) && (
                    <div className="text-error-600 text-xs mt-1 field-error">Start time is required</div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    End Time
                  </label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className={`w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${!formData.endTime && validationErrors.some(e => e.toLowerCase().includes('end time')) ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-700'}`}
                    required
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {!formData.endTime && validationErrors.some(e => e.toLowerCase().includes('end time')) && (
                    <div className="text-error-600 text-xs mt-1 field-error">End time is required</div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${!formData.location && validationErrors.some(e => e.toLowerCase().includes('location')) ? 'border-error-500' : 'border-secondary-300 dark:border-secondary-700'}`}
                  required
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {!formData.location && validationErrors.some(e => e.toLowerCase().includes('location')) && (
                  <div className="text-error-600 text-xs mt-1 field-error">Location is required</div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Add any additional notes or special instructions..."
                />
              </div>

              {/* Recurring Options */}
              <div className="border-t border-secondary-200 dark:border-secondary-800 pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={formData.isRecurring}
                    onChange={(e) => handleInputChange('isRecurring', e.target.checked.toString())}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Make this a recurring shift
                  </label>
                </div>

                {formData.isRecurring && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Frequency
                        </label>
                        <select
                          value={formData.recurringPattern.frequency}
                          onChange={(e) => handleRecurringChange('frequency', e.target.value)}
                          className="w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Interval
                        </label>
                        <select
                          value={formData.recurringPattern.interval}
                          onChange={(e) => handleRecurringChange('interval', parseInt(e.target.value))}
                          className="w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value={1}>Every 1</option>
                          <option value={2}>Every 2</option>
                          <option value={3}>Every 3</option>
                          <option value={7}>Every 7</option>
                        </select>
                      </div>
                    </div>

                    {formData.recurringPattern.frequency === 'weekly' && (
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                          Days of the Week
                        </label>
                        <div className="grid grid-cols-7 gap-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleDayToggle(index)}
                              className={`p-2 text-sm rounded-lg border transition-colors ${
                                formData.recurringPattern.daysOfWeek?.includes(index)
                                  ? 'bg-primary-600 text-white border-primary-600'
                                  : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border-secondary-300 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        End Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.recurringPattern.endDate || ''}
                        onChange={(e) => handleRecurringChange('endDate', e.target.value)}
                        min={selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                        className="w-full p-3 border rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Leave empty for 30 days"
                      />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                        Leave empty to create shifts for the next 30 days
                      </p>
                    </div>
                  </motion.div>
                )}
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
                  disabled={!isFormValid || isSubmitting}
                  className="button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Shift</span>
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