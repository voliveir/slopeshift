import React from 'react';
import { X, Calendar, User, FileText, Building, Hash } from 'lucide-react';
import { Certification } from '@/types';
import { formatDate } from '@/lib/utils';

interface CertificationDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  certification: (Certification & {
    issuing_authority?: string;
    certificate_number?: string;
    issue_date?: string;
    expiry_date?: string;
    staff_name?: string;
  }) | null;
}

export const CertificationDetailDrawer: React.FC<CertificationDetailDrawerProps> = ({ open, onClose, certification }) => {
  if (!open || !certification) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white dark:bg-secondary-900 shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Certification Details</h2>
          <button onClick={onClose} aria-label="Close drawer" className="p-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800">
            <X className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="text-lg font-semibold">{certification.name}</div>
          <div className="text-secondary-600 dark:text-secondary-400">{certification.type}</div>
          <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-300">
            <User className="h-4 w-4" />
            <span>Staff: {certification.staffName || certification.staff_name}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-300">
            <Building className="h-4 w-4" />
            <span>Issuing Authority: {certification.issuingAuthority || certification.issuing_authority}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-300">
            <Hash className="h-4 w-4" />
            <span>Certificate #: {certification.certificateNumber || certification.certificate_number}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-300">
            <Calendar className="h-4 w-4" />
            <span>Issued: {formatDate((certification.issueDate || certification.issue_date) ?? '')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-300">
            <Calendar className="h-4 w-4" />
            <span>Expires: {formatDate((certification.expiryDate || certification.expiry_date) ?? '')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-300">
            <span>Status: {certification.status}</span>
          </div>
          {certification.notes && (
            <div className="mt-4 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {certification.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 