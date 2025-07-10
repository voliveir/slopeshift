"use client";

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Table,
  AlertTriangle
} from 'lucide-react'
import { getStaff, deleteStaff, updateStaff } from '@/lib/data/staff'
import { getCertifications } from '@/lib/data/certifications';
import { getInitials, formatDate } from '@/lib/utils'
import { SearchBar } from '@/components/search-bar'
import { StatusPill } from '@/components/status-pill'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/button'
import { useToast } from '@/components/toast'
import { SkeletonCard } from '@/components/skeleton'
import { StaffModal } from '@/components/staff-modal'
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal'
import { Staff } from '@/types'
import { StaffDetailDrawer } from '@/components/staff-detail-drawer'
import { saveAs } from 'file-saver'

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [staff, setStaff] = useState<Staff[]>([])
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [view, setView] = useState<'card' | 'table'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('staffView') as 'card' | 'table') || 'card';
    }
    return 'card';
  });
  const [selectedStaffDetail, setSelectedStaffDetail] = useState<Staff | null>(null);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [bulkStatus, setBulkStatus] = useState('active');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [certifications, setCertifications] = useState<any[]>([]);

  const departments = ['all', ...Array.from(new Set(staff.map(staff => staff.department)))]
  const statuses = ['all', 'active', 'inactive', 'on_leave']

  const filteredStaff = staff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'inactive':
        return 'status-inactive'
      case 'on_leave':
        return 'status-pending'
      default:
        return 'status-inactive'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'inactive':
        return 'Inactive'
      case 'on_leave':
        return 'On Leave'
      default:
        return 'Unknown'
    }
  }

  const { addToast } = useToast()

  const normalizeStaff = (staff: any): Staff => ({
    ...staff,
    hireDate: staff.hireDate || staff.hire_date || '',
    hourlyRate: staff.hourlyRate || staff.hourly_rate || '',
    emergencyContactName: staff.emergencyContactName || staff.emergency_contact_name || '',
    emergencyContactPhone: staff.emergencyContactPhone || staff.emergency_contact_phone || '',
    emergencyContactRelationship: staff.emergencyContactRelationship || staff.emergency_contact_relationship || '',
  });

  const handleStaffCreated = (newStaff: any) => {
    setEditingStaff(null)
    setIsStaffModalOpen(false)
    // Refresh staff list after add/edit
    setLoading(true)
    getStaff()
      .then(data => setStaff(data))
      .catch(() => setStaff([]))
      .finally(() => setLoading(false))
    addToast({
      title: editingStaff ? 'Staff Updated' : 'Staff Added',
      message: `Successfully ${editingStaff ? 'updated' : 'added'} ${newStaff.name}`,
      variant: 'success',
    })
  }

  const handleDeleteClick = (staff: Staff) => {
    setDeletingStaff(staff)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingStaff) return
    setIsDeleting(true)
    try {
      await deleteStaff(deletingStaff.id)
      setIsDeleteModalOpen(false)
      setDeletingStaff(null)
      // Refresh staff list
      setLoading(true)
      getStaff()
        .then(data => setStaff(data))
        .catch(() => setStaff([]))
        .finally(() => setLoading(false))
      addToast({
        title: 'Staff Deleted',
        message: `Successfully deleted ${deletingStaff.name}`,
        variant: 'success',
      })
    } catch (err: any) {
      addToast({
        title: 'Delete Failed',
        message: err.message || 'Failed to delete staff member.',
        variant: 'error',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    getStaff()
      .then(data => setStaff(data))
      .catch(err => {
        setStaff([])
        // Optionally show error toast
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem('staffView', view);
  }, [view]);

  // Fetch certifications on mount
  useEffect(() => {
    getCertifications()
      .then(setCertifications)
      .catch(() => setCertifications([]));
  }, []);
  // Map staffId to expiring certs
  const expiringCertsByStaff: Record<string, any[]> = {};
  const now = new Date();
  certifications.forEach(cert => {
    const expiry = new Date(cert.expiryDate || cert.expiry_date);
    const days = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (days >= 0 && days <= 30) {
      if (!expiringCertsByStaff[cert.staffId || cert.staff_id]) expiringCertsByStaff[cert.staffId || cert.staff_id] = [];
      expiringCertsByStaff[cert.staffId || cert.staff_id].push(cert);
    }
  });

  function exportStaffToCSV(staffList: Staff[]) {
    if (!staffList.length) return;
    const headers = [
      'Name', 'Email', 'Phone', 'Position', 'Department', 'Hire Date', 'Hourly Rate', 'Status'
    ];
    const rows = staffList.map(s => [
      s.name, s.email, s.phone, s.position, s.department, s.hireDate, s.hourlyRate, s.status
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'staff.csv');
  }

  async function handleBulkStatusUpdate() {
    setIsBulkUpdating(true);
    try {
      await Promise.all(selectedStaffIds.map(id => updateStaff(id, { status: bulkStatus as Staff['status'] })));
      setSelectedStaffIds([]);
      setLoading(true);
      getStaff()
        .then(data => setStaff(data))
        .catch(() => setStaff([]))
        .finally(() => setLoading(false));
      addToast({
        title: 'Status Updated',
        message: `Updated status for ${selectedStaffIds.length} staff member(s)`,
        variant: 'success',
      });
    } catch (err: any) {
      addToast({
        title: 'Bulk Update Failed',
        message: err.message || 'Failed to update staff status.',
        variant: 'error',
      });
    } finally {
      setIsBulkUpdating(false);
    }
  }

  return (
    <div id="main-content" className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Staff Management
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Manage your ski resort staff members, their roles, and information.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-secondary-900 rounded-xl p-6 shadow-soft">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search staff by name, email, or position..."
              ariaLabel="Search staff"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-secondary-400" />
            <label htmlFor="departmentFilter" className="sr-only">Department Filter</label>
            <select
              id="departmentFilter"
              aria-label="Filter by department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="statusFilter" className="sr-only">Status Filter</label>
            <select
              id="statusFilter"
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Add Staff Button */}
          <Button icon={Plus} size="md" aria-label="Add staff member" onClick={() => setIsStaffModalOpen(true)}>
            Add Staff
          </Button>
        </div>
      </div>

      {/* Toggle View Button */}
      <div className="flex justify-end mb-4">
        <button
          className={`px-3 py-1 rounded-l border ${view === 'card' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white'}`}
          onClick={() => setView('card')}
          aria-label="Card View"
        >
          Cards
        </button>
        <button
          className={`px-3 py-1 rounded-r border-l-0 border ${view === 'table' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white'}`}
          onClick={() => setView('table')}
          aria-label="Table View"
        >
          <Table className="inline h-4 w-4 mr-1" /> Table
        </button>
      </div>

      {/* Add Export to CSV button above the view toggle */}
      <div className="flex justify-between items-center mb-4">
        <div></div>
        <button
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
          onClick={() => exportStaffToCSV(filteredStaff)}
        >
          Export to CSV
        </button>
      </div>

      {/* Staff Grid or Table */}
      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredStaff.map((staff, index) => (
                <motion.div
                  key={staff.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white dark:bg-secondary-900 rounded-xl p-6 shadow-soft card-hover cursor-pointer ${expiringCertsByStaff[staff.id] ? 'border border-warning-500' : ''}`}
                  onClick={() => setSelectedStaffDetail(normalizeStaff(staff))}
                >
                  {/* Staff Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
                        {staff.avatar ? (
                          <img src={staff.avatar} alt={staff.name} className="h-12 w-12 rounded-full" />
                        ) : (
                          getInitials(staff.name)
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary-900 dark:text-white">
                          {staff.name}
                          {expiringCertsByStaff[staff.id] && (
                            <span className="ml-2 inline-flex items-center text-warning-600" title="Expiring certifications soon">
                              <AlertTriangle className="h-4 w-4" />
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {staff.position}
                        </p>
                      </div>
                    </div>
                    <StatusPill status={staff.status}>
                      {getStatusText(staff.status)}
                    </StatusPill>
                  </div>

                  {/* Staff Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <Mail className="h-4 w-4" />
                      <span>{staff.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <Phone className="h-4 w-4" />
                      <span>{staff.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <MapPin className="h-4 w-4" />
                      <span>{staff.department}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <Calendar className="h-4 w-4" />
                      <span>Hired {formatDate(staff.hireDate)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <DollarSign className="h-4 w-4" />
                      <span>${staff.hourlyRate}/hr</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-secondary-200 dark:border-secondary-800">
                    <Button variant="ghost" size="sm" aria-label={`View details for ${staff.name}`}>
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" aria-label={`Edit ${staff.name}`} onClick={() => { setEditingStaff(normalizeStaff(staff)); setIsStaffModalOpen(true); }}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" aria-label={`Delete ${staff.name}`} onClick={() => handleDeleteClick(staff)}>
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ))}
        </div>
      ) : (
        <>
          {selectedStaffIds.length > 0 && (
            <div className="flex items-center gap-4 mb-2 p-3 bg-primary-50 dark:bg-secondary-800 rounded">
              <span>{selectedStaffIds.length} selected</span>
              <select
                value={bulkStatus}
                onChange={e => setBulkStatus(e.target.value)}
                className="px-2 py-1 rounded border border-secondary-300 dark:border-secondary-700"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
              <button
                className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                onClick={handleBulkStatusUpdate}
                disabled={isBulkUpdating}
              >
                {isBulkUpdating ? 'Updating...' : 'Update Status'}
              </button>
              <button
                className="ml-auto text-sm text-secondary-500 hover:underline"
                onClick={() => setSelectedStaffIds([])}
              >
                Clear Selection
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      ref={selectAllRef}
                      checked={selectedStaffIds.length === filteredStaff.length && filteredStaff.length > 0}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedStaffIds(filteredStaff.map(s => s.id));
                        } else {
                          setSelectedStaffIds([]);
                        }
                      }}
                      aria-label="Select all staff"
                    />
                  </th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Position</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Hire Date</th>
                  <th className="px-4 py-2 text-left">Hourly Rate</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Expiring Certs</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(staff => (
                  <tr key={staff.id} className="border-b border-secondary-200 dark:border-secondary-700 cursor-pointer" onClick={e => {
                    if ((e.target as HTMLElement).tagName === 'INPUT') return;
                    setSelectedStaffDetail(normalizeStaff(staff));
                  }}>
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedStaffIds.includes(staff.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedStaffIds(ids => [...ids, staff.id]);
                          } else {
                            setSelectedStaffIds(ids => ids.filter(id => id !== staff.id));
                          }
                        }}
                        onClick={e => e.stopPropagation()}
                        aria-label={`Select ${staff.name}`}
                      />
                    </td>
                    <td className="px-4 py-2">{staff.name}</td>
                    <td className="px-4 py-2">{staff.position}</td>
                    <td className="px-4 py-2">{staff.department}</td>
                    <td className="px-4 py-2">{formatDate(staff.hireDate)}</td>
                    <td className="px-4 py-2">${staff.hourlyRate}</td>
                    <td className="px-4 py-2"><StatusPill status={staff.status}>{getStatusText(staff.status)}</StatusPill></td>
                    <td className="px-4 py-2">
                      {expiringCertsByStaff[staff.id] && (
                        <span className="inline-flex items-center text-warning-600" title="Expiring certifications soon">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="ml-1 text-xs">{expiringCertsByStaff[staff.id].length}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <Button variant="ghost" size="sm" aria-label={`Edit ${staff.name}`} onClick={() => { setEditingStaff(normalizeStaff(staff)); setIsStaffModalOpen(true); }}>Edit</Button>
                      <Button variant="ghost" size="sm" aria-label={`Delete ${staff.name}`} onClick={() => handleDeleteClick(staff)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Empty State */}
      {filteredStaff.length === 0 && (
        <EmptyState
          icon={Users}
          title="No staff members found"
          description="Try adjusting your search or filters to find what you're looking for."
          actionLabel="Add New Staff Member"
          onAction={() => { setIsStaffModalOpen(true); setEditingStaff(null); }}
        />
      )}

      {/* Add Staff Modal */}
      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => { setIsStaffModalOpen(false); setEditingStaff(null); }}
        onStaffCreated={handleStaffCreated}
        staff={editingStaff ? normalizeStaff(editingStaff) : null}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingStaff(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member?"
        itemName={deletingStaff?.name}
        isDeleting={isDeleting}
      />

      {/* Staff Detail Drawer */}
      <StaffDetailDrawer open={!!selectedStaffDetail} onClose={() => setSelectedStaffDetail(null)} staff={selectedStaffDetail} />
    </div>
  )
} 