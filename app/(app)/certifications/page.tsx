"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  Award, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { getCertifications, deleteCertification } from '@/lib/data/certifications'
import { formatDate } from '@/lib/utils'
import { Certification } from '@/types'
import { SearchBar } from '@/components/search-bar'
import { StatusPill } from '@/components/status-pill'
import { EmptyState } from '@/components/empty-state'
import { Button } from '@/components/button'
import { SkeletonCard } from '@/components/skeleton'
import { CertificationModal } from '@/components/certification-modal'
import { DeleteConfirmationModal } from '@/components/delete-confirmation-modal'
import { CertificationDetailDrawer } from '@/components/certification-detail-drawer';
import { saveAs } from 'file-saver';

type FilterableCertification = Certification & {
  issuing_authority?: string;
  certificate_number?: string;
  issue_date?: string;
  expiry_date?: string;
  staff_name?: string;
};

export default function CertificationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [deletingCertification, setDeletingCertification] = useState<Certification | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [selectedCertificationDetail, setSelectedCertificationDetail] = useState<Certification | null>(null);
  const [staffFilter, setStaffFilter] = useState('all');
  const [authorityFilter, setAuthorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('expiry');

  const types = ['all', ...Array.from(new Set(certifications.map(cert => cert.type)))]
  const statuses = ['all', 'active', 'expired', 'expiring_soon', 'pending']

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch =
      (cert.staff_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (cert.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (cert.type?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || cert.type === typeFilter;
    return matchesSearch && matchesType;
  })

  const staffOptions = ['all', ...Array.from(new Set((certifications as FilterableCertification[]).map(cert => cert.staffName || cert.staff_name).filter(Boolean)))];
  const authorityOptions = ['all', ...Array.from(new Set((certifications as FilterableCertification[]).map(cert => cert.issuingAuthority || cert.issuing_authority).filter(Boolean)))];

  const sortedFilteredCertifications = [...(filteredCertifications as FilterableCertification[])]
    .filter(cert => staffFilter === 'all' || (cert.staffName || cert.staff_name) === staffFilter)
    .filter(cert => authorityFilter === 'all' || (cert.issuingAuthority || cert.issuing_authority) === authorityFilter)
    .sort((a, b) => {
      if (sortBy === 'expiry') {
        return new Date(a.expiryDate || a.expiry_date || '').getTime() - new Date(b.expiryDate || b.expiry_date || '').getTime();
      } else if (sortBy === 'staff') {
        return ((a.staffName || a.staff_name) || '').localeCompare((b.staffName || b.staff_name) || '');
      } else if (sortBy === 'type') {
        return (a.type || '').localeCompare(b.type || '');
      }
      return 0;
    });

  useEffect(() => {
    setLoading(true)
    getCertifications()
      .then(data => setCertifications(data))
      .catch(err => {
        setCertifications([])
        // Optionally show error toast
      })
      .finally(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'expired':
        return 'status-expired'
      case 'expiring_soon':
        return 'status-pending'
      case 'pending':
        return 'status-inactive'
      default:
        return 'status-inactive'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'expired':
        return 'Expired'
      case 'expiring_soon':
        return 'Expiring Soon'
      case 'pending':
        return 'Pending'
      default:
        return 'Unknown'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle
      case 'expired':
        return XCircle
      case 'expiring_soon':
        return AlertTriangle
      case 'pending':
        return Clock
      default:
        return Clock
    }
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getExpiryColor = (days: number) => {
    if (days < 0) return 'text-error-600'
    if (days <= 30) return 'text-warning-600'
    if (days <= 90) return 'text-accent-600'
    return 'text-success-600'
  }

  const getExpiryBadge = (days: number) => {
    if (days < 0) return <span className="ml-2 px-2 py-0.5 rounded bg-error-100 text-error-700 text-xs font-semibold">Expired</span>;
    if (days <= 30) return <span className="ml-2 px-2 py-0.5 rounded bg-warning-100 text-warning-800 text-xs font-semibold">Expiring Soon</span>;
    return null;
  };

  const handleCreateCertification = async (certificationData: Omit<Certification, 'id'>) => {
    // In a real app, this would be an API call
    // For now, we'll just log the data and show a success message
    console.log('Creating certification:', certificationData)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // You would typically update the mock data here or make an API call
    // For demo purposes, we'll just show a success message
    alert('Certification created successfully!')
  }

  const normalizeCertification = (cert: any): Certification => ({
    ...cert,
    staffId: cert.staffId || cert.staff_id || '',
    staffName: cert.staffName || cert.staff_name || '',
    issueDate: cert.issueDate || cert.issue_date || '',
    expiryDate: cert.expiryDate || cert.expiry_date || '',
    issuingAuthority: cert.issuingAuthority || cert.issuing_authority || '',
    certificateNumber: cert.certificateNumber || cert.certificate_number || '',
  });

  const handleCertificationSubmit = (cert: Certification) => {
    setEditingCertification(null)
    setIsModalOpen(false)
    setLoading(true)
    getCertifications()
      .then(data => setCertifications(data))
      .catch(() => setCertifications([]))
      .finally(() => setLoading(false))
    // Optionally show toast here
  }

  const handleEditClick = (cert: Certification) => {
    setEditingCertification(normalizeCertification(cert))
    setIsModalOpen(true)
  }

  const handleDeleteClick = (cert: Certification) => {
    setDeletingCertification(cert)
    setIsDeleteModalOpen(true)
  }

  const handleRenewClick = (cert: Certification) => {
    const today = new Date().toISOString().split('T')[0];
    setEditingCertification({
      ...normalizeCertification(cert),
      issueDate: today,
      expiryDate: '',
      status: 'pending',
      certificateNumber: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCertification) return
    setIsDeleting(true)
    try {
      await deleteCertification(deletingCertification.id)
      setIsDeleteModalOpen(false)
      setDeletingCertification(null)
      setLoading(true)
      getCertifications()
        .then(data => setCertifications(data))
        .catch(() => setCertifications([]))
        .finally(() => setLoading(false))
      // Optionally show toast here
    } catch (err: any) {
      // Optionally show error toast here
    } finally {
      setIsDeleting(false)
    }
  }

  function exportCertsToCSV(certList: FilterableCertification[]) {
    if (!certList.length) return;
    const headers = [
      'Name', 'Staff', 'Type', 'Issuing Authority', 'Certificate #', 'Issue Date', 'Expiry Date', 'Status', 'Notes'
    ];
    const rows = certList.map(c => [
      c.name, c.staffName || c.staff_name, c.type, c.issuingAuthority || c.issuing_authority, c.certificateNumber || c.certificate_number, c.issueDate || c.issue_date, c.expiryDate || c.expiry_date, c.status, c.notes || ''
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'certifications.csv');
  }
  async function handleBulkDelete() {
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedCertIds.map(id => deleteCertification(id)));
      setSelectedCertIds([]);
      setLoading(true);
      getCertifications()
        .then(data => setCertifications(data))
        .catch(() => setCertifications([]))
        .finally(() => setLoading(false));
    } finally {
      setIsBulkDeleting(false);
    }
  }

  return (
    <div id="main-content" className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          Certifications
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Track staff certifications, expiry dates, and compliance status.
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
              placeholder="Search certifications by staff name or type..."
              ariaLabel="Search certifications"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-secondary-400" />
            <label htmlFor="typeFilter" className="sr-only">Type Filter</label>
            <select
              id="typeFilter"
              aria-label="Filter by certification type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label htmlFor="statusFilter" className="sr-only">Status Filter</label>
            <select
              id="statusFilter"
              aria-label="Filter by certification status"
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

          {/* Add Certification Button */}
          <Button 
            icon={Plus} 
            size="md" 
            onClick={() => setIsModalOpen(true)}
            aria-label="Add certification"
          >
            Add Certification
          </Button>
        </div>
      </div>

      {/* Advanced Filters and Sorting */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium mb-1">Staff</label>
          <select value={staffFilter} onChange={e => setStaffFilter(e.target.value)} className="px-2 py-1 rounded border">
            {staffOptions.map(staff => <option key={staff} value={staff}>{staff === 'all' ? 'All Staff' : staff}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Authority</label>
          <select value={authorityFilter} onChange={e => setAuthorityFilter(e.target.value)} className="px-2 py-1 rounded border">
            {authorityOptions.map(auth => <option key={auth} value={auth}>{auth === 'all' ? 'All Authorities' : auth}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Sort By</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-2 py-1 rounded border">
            <option value="expiry">Expiry Date</option>
            <option value="staff">Staff</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedCertIds.length > 0 && (
        <div className="flex items-center gap-4 mb-4 p-3 bg-primary-50 dark:bg-secondary-800 rounded">
          <span>{selectedCertIds.length} selected</span>
          <button
            className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
            onClick={() => exportCertsToCSV(certifications.filter(c => selectedCertIds.includes(c.id)))}
          >
            Export Selected
          </button>
          <button
            className="px-3 py-1 bg-error-600 text-white rounded hover:bg-error-700 disabled:opacity-50"
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
          <button
            className="ml-auto text-sm text-secondary-500 hover:underline"
            onClick={() => setSelectedCertIds([])}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Certifications List */}
      <div className="space-y-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : sortedFilteredCertifications.map((cert, index) => {
              const StatusIcon = getStatusIcon(cert.status)
              const daysUntilExpiry = getDaysUntilExpiry(cert.expiryDate)
              const expiryColor = getExpiryColor(daysUntilExpiry)
              
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-white dark:bg-secondary-900 rounded-xl p-6 shadow-soft card-hover"
                >
                  <div className="absolute left-4 top-4">
                    <input
                      type="checkbox"
                      checked={selectedCertIds.includes(cert.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCertIds(ids => [...ids, cert.id]);
                        } else {
                          setSelectedCertIds(ids => ids.filter(id => id !== cert.id));
                        }
                      }}
                      onClick={e => e.stopPropagation()}
                      aria-label={`Select ${cert.name}`}
                      className="mr-2"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Status Icon */}
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                        <StatusIcon className="h-6 w-6 text-primary-600" />
                      </div>

                      {/* Certification Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                            {cert.name}
                            {getExpiryBadge(daysUntilExpiry)}
                          </h3>
                          <StatusPill status={cert.status}>
                            {getStatusText(cert.status)}
                          </StatusPill>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-secondary-500 dark:text-secondary-400">Staff Member</p>
                            <p className="font-medium text-secondary-900 dark:text-white">{cert.staffName}</p>
                          </div>
                          <div>
                            <p className="text-secondary-500 dark:text-secondary-400">Type</p>
                            <p className="font-medium text-secondary-900 dark:text-white">{cert.type}</p>
                          </div>
                          <div>
                            <p className="text-secondary-500 dark:text-secondary-400">Issuing Authority</p>
                            <p className="font-medium text-secondary-900 dark:text-white">{cert.issuingAuthority}</p>
                          </div>
                          <div>
                            <p className="text-secondary-500 dark:text-secondary-400">Certificate #</p>
                            <p className="font-medium text-secondary-900 dark:text-white">{cert.certificateNumber}</p>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center space-x-6 mt-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-secondary-400" />
                            <span className="text-secondary-500 dark:text-secondary-400">Issued:</span>
                            <span className="font-medium text-secondary-900 dark:text-white">
                              {formatDate(cert.issueDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-secondary-400" />
                            <span className="text-secondary-500 dark:text-secondary-400">Expires:</span>
                            <span className={`font-medium ${expiryColor}`}>
                              {formatDate(cert.expiryDate)}
                              {daysUntilExpiry >= 0 && (
                                <span className="ml-1">
                                  ({daysUntilExpiry} days)
                                </span>
                              )}
                              {daysUntilExpiry < 0 && (
                                <span className="ml-1">
                                  (Expired {Math.abs(daysUntilExpiry)} days ago)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Notes */}
                        {cert.notes && (
                          <div className="mt-4 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">
                              {cert.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button variant="ghost" size="sm" aria-label={`View details for ${cert.name}`} onClick={() => setSelectedCertificationDetail(cert)}>
                        View Details
                      </Button>
                      <Button variant="ghost" size="sm" aria-label={`Edit ${cert.name}`} onClick={() => handleEditClick(cert)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" aria-label={`Renew ${cert.name}`} onClick={() => handleRenewClick(cert)}>
                        Renew
                      </Button>
                      <Button variant="ghost" size="sm" aria-label={`Delete ${cert.name}`} onClick={() => handleDeleteClick(cert)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
      </div>

      {/* Empty State */}
      {sortedFilteredCertifications.length === 0 && (
        <EmptyState
          icon={Award}
          title="No certifications found"
          description="Try adjusting your search or filters to find what you're looking for."
          actionLabel="Add New Certification"
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Certification Modal */}
      <CertificationModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCertification(null); }}
        onSubmit={handleCertificationSubmit}
        certification={editingCertification ? normalizeCertification(editingCertification) : null}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeletingCertification(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Certification"
        message="Are you sure you want to delete this certification?"
        itemName={deletingCertification?.name}
        isDeleting={isDeleting}
      />

      {/* Certification Detail Drawer */}
      <CertificationDetailDrawer open={!!selectedCertificationDetail} onClose={() => setSelectedCertificationDetail(null)} certification={selectedCertificationDetail} />
    </div>
  )
} 