export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  avatar?: string
  department: string
  hireDate: string
  status: 'active' | 'inactive'
}

export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  hireDate: string
  hourlyRate: number
  status: 'active' | 'inactive' | 'on_leave'
  avatar?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  emergency_contact_relationship?: string
}

export interface Shift {
  id: string
  staffId: string
  staffName: string
  date: string
  startTime: string
  endTime: string
  position: string
  department: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  location: string
  hourlyRate: number
}

export interface Housing {
  id: string
  name: string
  type: 'apartment' | 'dorm' | 'cabin' | 'hotel'
  capacity: number
  occupied: number
  location: string
  status: 'available' | 'full' | 'maintenance' | 'reserved'
  amenities: string[]
  monthlyRate: number
  assignedStaff: string[]
  maintenanceNotes?: string
}

export interface Certification {
  id: string
  staffId: string
  staffName: string
  staff_name?: string
  type: string
  name: string
  issueDate: string
  expiryDate: string
  status: 'active' | 'expired' | 'expiring_soon' | 'pending'
  issuingAuthority: string
  certificateNumber: string
  notes?: string
}

export interface Department {
  id: string
  name: string
  manager: string
  staffCount: number
  budget: number
  location: string
}

export interface Activity {
  id: string
  type: 'shift_scheduled' | 'staff_hired' | 'certification_expired' | 'housing_assigned'
  title: string
  description: string
  timestamp: string
  userId: string
  userName: string
  metadata?: Record<string, any>
}

export interface DashboardStats {
  totalStaff: number
  activeShifts: number
  availableHousing: number
  expiringCertifications: number
  monthlyRevenue: number
  staffUtilization: number
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export type Theme = 'light' | 'dark' | 'system'

export interface SearchFilters {
  department?: string
  status?: string
  dateRange?: {
    start: string
    end: string
  }
  position?: string
  location?: string
} 