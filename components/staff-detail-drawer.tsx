import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Staff } from '@/types';
import { getCertificationsByStaffId } from '@/lib/data/certifications';
import { getShiftsByStaffId } from '@/lib/data/shifts';
import { Certification, Shift } from '@/types';

interface StaffDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  staff: Staff | null;
}

export const StaffDetailDrawer: React.FC<StaffDetailDrawerProps> = ({ open, onClose, staff }) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);

  useEffect(() => {
    if (open && staff) {
      setLoadingCerts(true);
      setLoadingShifts(true);
      getCertificationsByStaffId(staff.id)
        .then(setCertifications)
        .catch(() => setCertifications([]))
        .finally(() => setLoadingCerts(false));
      getShiftsByStaffId(staff.id)
        .then(setShifts)
        .catch(() => setShifts([]))
        .finally(() => setLoadingShifts(false));
    } else {
      setCertifications([]);
      setShifts([]);
    }
  }, [open, staff]);

  if (!open || !staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-white dark:bg-secondary-900 shadow-xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Staff Details</h2>
          <button onClick={onClose} aria-label="Close drawer" className="p-2 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800">
            <X className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
          </button>
        </div>
        {/* Staff Info */}
        <div className="space-y-2 mb-6">
          <div className="font-semibold text-lg">{staff.name}</div>
          <div className="text-secondary-600 dark:text-secondary-400">{staff.position} - {staff.department}</div>
          <div className="text-sm text-secondary-500 dark:text-secondary-300">Email: {staff.email}</div>
          <div className="text-sm text-secondary-500 dark:text-secondary-300">Phone: {staff.phone}</div>
          <div className="text-sm text-secondary-500 dark:text-secondary-300">Status: {staff.status}</div>
          <div className="text-sm text-secondary-500 dark:text-secondary-300">Hire Date: {staff.hireDate}</div>
          <div className="text-sm text-secondary-500 dark:text-secondary-300">Hourly Rate: ${staff.hourlyRate}</div>
        </div>
        {/* Certifications */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Certifications</h3>
          {loadingCerts ? (
            <div className="text-secondary-500">Loading certifications...</div>
          ) : certifications.length === 0 ? (
            <div className="text-secondary-500">No certifications found.</div>
          ) : (
            <ul className="space-y-1">
              {certifications.map(cert => (
                <li key={cert.id} className="text-sm text-secondary-700 dark:text-secondary-200">
                  {cert.type}: {cert.name} ({cert.status}) - Expires {cert.expiryDate}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Shift History */}
        <div>
          <h3 className="font-semibold mb-2">Shift History</h3>
          {loadingShifts ? (
            <div className="text-secondary-500">Loading shifts...</div>
          ) : shifts.length === 0 ? (
            <div className="text-secondary-500">No shifts found.</div>
          ) : (
            <ul className="space-y-1">
              {shifts.map(shift => (
                <li key={shift.id} className="text-sm text-secondary-700 dark:text-secondary-200">
                  {shift.date}: {shift.position} ({shift.status})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}; 