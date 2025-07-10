import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Search } from 'lucide-react';
import { getStaff } from '@/lib/data/staff';
import type { Staff } from '@/types';

interface HousingAssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignedStaff: string[];
  onSave: (newAssigned: string[]) => void;
}

export function HousingAssignStaffModal({ isOpen, onClose, assignedStaff, onSave }: HousingAssignStaffModalProps) {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selected, setSelected] = useState<string[]>(assignedStaff);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getStaff()
        .then(data => setStaffList(data))
        .catch(() => setStaffList([]))
        .finally(() => setLoading(false));
      setSelected(assignedStaff);
      setSearch('');
    }
  }, [isOpen, assignedStaff]);

  const filteredStaff = staffList.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(sid => sid !== id) : [...sel, id]);
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

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
                    Assign Staff
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
            {/* Search */}
            <div className="p-4 border-b border-secondary-200 dark:border-secondary-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search staff by name or email..."
                  className="w-full pl-10 pr-3 py-2 bg-secondary-50 dark:bg-secondary-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            {/* Staff List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center text-secondary-500">Loading staff...</div>
              ) : filteredStaff.length === 0 ? (
                <div className="text-center text-secondary-500">No staff found.</div>
              ) : (
                <ul className="divide-y divide-secondary-200 dark:divide-secondary-800">
                  {filteredStaff.map(staff => (
                    <li key={staff.id} className="flex items-center justify-between py-2">
                      <div>
                        <div className="font-medium text-secondary-900 dark:text-white">{staff.name}</div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400">{staff.email}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selected.includes(staff.id)}
                        onChange={() => handleToggle(staff.id)}
                        aria-label={`Assign ${staff.name}`}
                        className="h-4 w-4"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-2 p-4 border-t border-secondary-200 dark:border-secondary-800">
              <button
                type="button"
                className="px-4 py-2 rounded bg-secondary-200 dark:bg-secondary-700 text-secondary-900 dark:text-white hover:bg-secondary-300 dark:hover:bg-secondary-600"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 