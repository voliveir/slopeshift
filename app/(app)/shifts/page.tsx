'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Trash2,
  MoreVertical,
  AlertTriangle
} from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { useToast } from '@/components/toast'
import { ShiftModal } from '@/components/shift-modal'
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal'
import { getShifts, deleteShift, updateShift } from '@/lib/data/shifts'
import { Shift } from '@/types'
import { SearchBar } from '@/components/search-bar';
import { saveAs } from 'file-saver';

// Helper to detect conflicts for a shift
function hasConflict(shift: Shift, allShifts: Shift[]): boolean {
  return allShifts.some(other =>
    other.id !== shift.id &&
    other.staffName === shift.staffName &&
    other.date === shift.date &&
    // Overlap logic: startA < endB && endA > startB
    (shift.startTime < other.endTime && shift.endTime > other.startTime)
  );
}

// Department color palette
const departmentColors: Record<string, string> = {
  all: 'bg-secondary-400',
  ski: 'bg-blue-500',
  lift: 'bg-green-500',
  patrol: 'bg-red-500',
  food: 'bg-yellow-500',
  rental: 'bg-purple-500',
  housekeeping: 'bg-pink-500',
  // Add more as needed
};
function getDepartmentColor(department: string) {
  return departmentColors[department?.toLowerCase()] || 'bg-secondary-400';
}

export default function ShiftsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isAddingShift, setIsAddingShift] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalDate, setModalDate] = useState<Date | null>(null)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    shiftId: string | null
    shiftName: string
  }>({
    isOpen: false,
    shiftId: null,
    shiftName: ''
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const { addToast } = useToast()
  const [editingShift, setEditingShift] = useState<Shift | null>(null)
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedShiftIds, setSelectedShiftIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<'confirmed' | 'scheduled' | 'completed' | 'cancelled'>('confirmed');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isDnDLoading, setIsDnDLoading] = useState(false);

  useEffect(() => {
    getShifts()
      .then(data => setShifts(data))
      .catch(() => setShifts([]))
  }, [])

  const handleAddShift = async (date?: Date) => {
    const targetDate = date || selectedDate || new Date()
    setIsAddingShift(true)
    
    // Simulate a brief delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setModalDate(targetDate)
    setIsModalOpen(true)
    setIsAddingShift(false)
  }

  const handleShiftCreated = (newShift: Shift) => {
    setEditingShift(null)
    setIsModalOpen(false)
    getShifts()
      .then((data: Shift[]) => setShifts(data))
      .catch(() => setShifts([]))
    addToast({
      title: editingShift ? 'Shift Updated' : 'Shift Created',
      message: `Successfully ${editingShift ? 'updated' : 'created'} shift for ${newShift.staffName} on ${formatDate(newShift.date)}`,
      variant: 'success'
    })
  }

  const handleEditShift = (shift: Shift) => {
    setEditingShift(shift)
    setModalDate(new Date(shift.date))
    setIsModalOpen(true)
  }

  const handleDeleteShift = (shiftId: string, shiftName: string) => {
    setDeleteModal({
      isOpen: true,
      shiftId,
      shiftName
    })
  }

  const handleDeleteAllShifts = () => {
    if (!selectedDate || selectedDateShifts.length === 0) return
    
    setDeleteModal({
      isOpen: true,
      shiftId: 'all',
      shiftName: `${selectedDateShifts.length} shifts on ${formatDate(selectedDate)}`
    })
  }

  const confirmDeleteShift = async () => {
    if (!deleteModal.shiftId) return
    setIsDeleting(true)
    try {
      await deleteShift(deleteModal.shiftId)
      getShifts()
        .then((data: Shift[]) => setShifts(data))
        .catch(() => setShifts([]))
      addToast({
        title: 'Shift Deleted',
        message: `Successfully deleted shift for ${deleteModal.shiftName}`,
        variant: 'success'
      })
    } catch (err) {
      addToast({
        title: 'Delete Failed',
        message: (err as Error).message || 'Failed to delete shift.',
        variant: 'error'
      })
    } finally {
      setIsDeleting(false)
      setDeleteModal({ isOpen: false, shiftId: null, shiftName: '' })
    }
  }

  const cancelDeleteShift = () => {
    setDeleteModal({ isOpen: false, shiftId: null, shiftName: '' })
  }

  async function handleBulkStatusUpdate() {
    setIsBulkUpdating(true);
    try {
      // Assume updateShift is available from data lib
      await Promise.all(selectedShiftIds.map(id => updateShift(id, { status: bulkStatus })));
      setSelectedShiftIds([]);
      getShifts()
        .then(data => setShifts(data))
        .catch(() => setShifts([]));
    } finally {
      setIsBulkUpdating(false);
    }
  }
  async function handleBulkDelete() {
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedShiftIds.map(id => deleteShift(id)));
      setSelectedShiftIds([]);
      getShifts()
        .then(data => setShifts(data))
        .catch(() => setShifts([]));
    } finally {
      setIsBulkDeleting(false);
      setIsBulkDeleteConfirmOpen(false);
    }
  }

  function exportShiftsToCSV(shiftsToExport: Shift[]) {
    if (!shiftsToExport.length) return;
    const headers = [
      'Staff Name', 'Position', 'Department', 'Date', 'Start Time', 'End Time', 'Location', 'Status'
    ];
    const rows = shiftsToExport.map(s => [
      s.staffName, s.position, s.department, s.date, s.startTime, s.endTime, s.location, s.status
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'shifts.csv');
  }

  // Get current month's shifts
  const currentMonthShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date)
    return shiftDate.getMonth() === currentDate.getMonth() && 
           shiftDate.getFullYear() === currentDate.getFullYear()
  })

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getShiftsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return currentMonthShifts.filter(shift => shift.date === dateString)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400'
      case 'scheduled':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
      case 'completed':
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400'
      case 'cancelled':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400'
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed'
      case 'scheduled':
        return 'Scheduled'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date: Date) => {
    return selectedDate && 
           date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear()
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const [fromDate, fromShiftId] = result.draggableId.split('|')
    const toDate = result.destination.droppableId
    if (fromDate === toDate) return
    setIsDnDLoading(true);
    try {
      await updateShift(fromShiftId, { date: toDate });
      getShifts()
        .then(data => setShifts(data))
        .catch(() => setShifts([]));
    } finally {
      setIsDnDLoading(false);
    }
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-secondary-50 dark:bg-secondary-800/50"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateString = date.toISOString().split('T')[0]
      const dayShifts = getShiftsForDate(date)
      days.push(
        <Droppable droppableId={dateString} key={dateString}>
          {(provided, snapshot) => (
            <motion.div
              ref={provided.innerRef}
              {...provided.droppableProps}
              key={dateString}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: day * 0.01 }}
              className={`h-32 p-2 border border-secondary-200 dark:border-secondary-800 cursor-pointer transition-colors ${
                isToday(date) ? 'bg-primary-50 dark:bg-primary-900/20' :
                isSelected(date) ? 'bg-secondary-100 dark:bg-secondary-800' :
                snapshot.isDraggingOver ? 'bg-accent-50 dark:bg-accent-900/20' :
                'hover:bg-secondary-50 dark:hover:bg-secondary-800/50'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${
                  isToday(date) ? 'text-primary-600 dark:text-primary-400' :
                  isSelected(date) ? 'text-secondary-900 dark:text-white' :
                  'text-secondary-700 dark:text-secondary-300'
                }`}>
                  {day}
                </span>
                {dayShifts.length > 0 && (
                  <span className="text-xs bg-primary-600 text-white rounded-full px-1.5 py-0.5">
                    {dayShifts.length}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {dayShifts.slice(0, 2).map((shift, idx) => (
                  <Draggable draggableId={`${shift.date}|${shift.id}`} index={idx} key={shift.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`text-xs p-1 rounded truncate ${getStatusColor(shift.status)} ${snapshot.isDragging ? 'ring-2 ring-primary-500' : ''} ${hasConflict(shift, filteredShifts) ? 'border border-error-600 bg-error-50 dark:bg-error-900/30' : ''}`}
                        title={`${shift.staffName} - ${shift.startTime}-${shift.endTime}${hasConflict(shift, filteredShifts) ? ' (Conflict!)' : ''}`}
                      >
                        <div className="flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getDepartmentColor(shift.department)}`}></span>
                          {shift.staffName} ({shift.startTime})
                          {hasConflict(shift, filteredShifts) && (
                            <AlertTriangle className="inline h-3 w-3 text-error-600 ml-1 align-text-bottom" />
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {dayShifts.length > 2 && (
                  <div className="text-xs text-secondary-500 dark:text-secondary-400">
                    +{dayShifts.length - 2} more
                  </div>
                )}
                {provided.placeholder}
              </div>
            </motion.div>
          )}
        </Droppable>
      )
    }
    return days
  }

  const selectedDateShifts = selectedDate ? getShiftsForDate(selectedDate) : []

  const departments = ['all', ...Array.from(new Set(shifts.map(s => s.department).filter(Boolean)))];
  const statuses = ['all', 'confirmed', 'scheduled', 'completed', 'cancelled'];

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch =
      (shift.staffName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (shift.position?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (shift.department?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || shift.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || shift.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          Shift Schedule
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Manage and view staff shift schedules with interactive calendar.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by staff, position, or department..."
            ariaLabel="Search shifts"
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Department</label>
          <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="px-2 py-1 rounded border">
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep === 'all' ? 'All Departments' : dep}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-2 py-1 rounded border">
            {statuses.map(status => (
              <option key={status} value={status}>{status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedShiftIds.length > 0 && (
        <div className="flex items-center gap-4 mb-4 p-3 bg-primary-50 dark:bg-secondary-800 rounded">
          <span>{selectedShiftIds.length} selected</span>
          <button
            className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
            onClick={() => exportShiftsToCSV(filteredShifts.filter(s => selectedShiftIds.includes(s.id)))}
          >
            Export Selected
          </button>
          <select
            value={bulkStatus}
            onChange={e => setBulkStatus(e.target.value as 'confirmed' | 'scheduled' | 'completed' | 'cancelled')}
            className="px-2 py-1 rounded border border-secondary-300 dark:border-secondary-700"
          >
            <option value="confirmed">Confirmed</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
            onClick={handleBulkStatusUpdate}
            disabled={isBulkUpdating}
          >
            {isBulkUpdating ? 'Updating...' : 'Update Status'}
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            onClick={() => setIsBulkDeleteConfirmOpen(true)}
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
          <button
            className="ml-auto text-sm text-secondary-500 hover:underline"
            onClick={() => setSelectedShiftIds([])}
          >
            Clear Selection
          </button>
        </div>
      )}
      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-secondary-900 rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-2">Delete {selectedShiftIds.length} shift{selectedShiftIds.length > 1 ? 's' : ''}?</h2>
            <p className="mb-4 text-secondary-700 dark:text-secondary-300">This action cannot be undone. Are you sure you want to delete the selected shifts?</p>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 rounded border border-secondary-300 dark:border-secondary-700"
                onClick={() => setIsBulkDeleteConfirmOpen(false)}
                disabled={isBulkDeleting}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                onClick={handleBulkDelete}
                disabled={isBulkDeleting}
              >
                {isBulkDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Header */}
      <div className="bg-white dark:bg-secondary-900 rounded-xl p-6 shadow-soft relative">
        {isDnDLoading && (
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30 flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-white dark:bg-secondary-900 rounded shadow text-primary-600 font-semibold">Saving...</span>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
            </button>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
            </button>
          </div>
          <button 
            onClick={() => handleAddShift()}
            disabled={isAddingShift}
            className="button-primary flex items-center space-x-2"
          >
            <Plus className={`h-4 w-4 ${isAddingShift ? 'animate-spin' : ''}`} />
            <span>{isAddingShift ? 'Opening...' : 'Add Shift'}</span>
          </button>
        </div>

        {/* Calendar Grid with DnD */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-7 gap-px bg-secondary-200 dark:bg-secondary-700 rounded-lg overflow-hidden">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-secondary-50 dark:bg-secondary-800 p-3 text-center">
                <span className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                  {day}
                </span>
              </div>
            ))}
            {/* Calendar days */}
            {renderCalendar()}
          </div>
        </DragDropContext>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-secondary-900 rounded-xl p-6 shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Shifts for {formatDate(selectedDate)}
            </h3>
            <div className="flex items-center space-x-3">
              {selectedDateShifts.length > 0 && (
                <button 
                  onClick={handleDeleteAllShifts}
                  className="px-3 py-2 text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete All</span>
                </button>
              )}
              <button 
                onClick={() => handleAddShift(selectedDate)}
                disabled={isAddingShift}
                className="button-primary flex items-center space-x-2"
              >
                <Plus className={`h-4 w-4 ${isAddingShift ? 'animate-spin' : ''}`} />
                <span>{isAddingShift ? 'Opening...' : 'Add Shift'}</span>
              </button>
            </div>
          </div>

          {selectedDateShifts.length > 0 ? (
            <div className="space-y-4">
              {selectedDateShifts.map(shift => (
                <motion.div
                  key={shift.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg group border-l-4 ${getDepartmentColor(shift.department)} ${hasConflict(shift, filteredShifts) ? 'border-error-600 bg-error-50 dark:bg-error-900/30' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedShiftIds.includes(shift.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedShiftIds(ids => [...ids, shift.id]);
                        } else {
                          setSelectedShiftIds(ids => ids.filter(id => id !== shift.id));
                        }
                      }}
                      onClick={e => e.stopPropagation()}
                      aria-label={`Select shift for ${shift.staffName}`}
                      className="mr-2"
                    />
                    <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-secondary-900 dark:text-white">
                        {shift.staffName}
                        {hasConflict(shift, filteredShifts) && (
                          <AlertTriangle className="inline h-4 w-4 text-error-600 ml-1 align-text-bottom" />
                        )}
                      </h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {shift.position} • {shift.department}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <Clock className="h-4 w-4" />
                      <span>{shift.startTime} - {shift.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <MapPin className="h-4 w-4" />
                      <span>{shift.location}</span>
                    </div>
                    <span className={`status-pill ${getStatusColor(shift.status)}`}>
                      {getStatusText(shift.status)}
                    </span>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteShift(shift.id, shift.staffName)}
                      className="p-2 text-secondary-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={`Delete shift for ${shift.staffName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600 dark:text-secondary-400">
                No shifts scheduled for this date
              </p>
              <button 
                onClick={() => handleAddShift(selectedDate)}
                disabled={isAddingShift}
                className="button-primary mt-4"
              >
                {isAddingShift ? 'Opening...' : 'Schedule a Shift'}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Shift Creation Modal */}
      <ShiftModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingShift(null); }}
        onShiftCreated={handleShiftCreated}
        selectedDate={modalDate || undefined}
        shift={editingShift}
        existingShifts={shifts}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDeleteShift}
        onConfirm={confirmDeleteShift}
        title="Delete Shift"
        message="Are you sure you want to delete this shift?"
        itemName={deleteModal.shiftName}
        isDeleting={isDeleting}
      />
    </div>
  )
} 