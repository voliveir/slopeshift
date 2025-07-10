// This file must be .tsx to allow JSX in getIcon
import { Home, Users, Bed, FileText, Ticket, Puzzle, CreditCard, List, BookOpen, BarChart2, Settings } from 'lucide-react';
import { ReactNode } from 'react';

export type ModuleConfig = {
  name: string;
  label: string;
  getIcon: () => ReactNode;
  href: string;
};

export const MODULE_CONFIGS: Record<string, ModuleConfig> = {
  Dashboard: {
    name: 'Dashboard',
    label: 'Dashboard',
    getIcon: () => <Home size={18} />,
    href: '/dashboard'
  },
  Shifts: {
    name: 'Shifts',
    label: 'Shifts',
    getIcon: () => <BarChart2 size={18} />,
    href: '/shifts'
  },
  Staff: {
    name: 'Staff',
    label: 'Staff',
    getIcon: () => <Users size={18} />,
    href: '/staff'
  },
  Housing: {
    name: 'Housing',
    label: 'Housing',
    getIcon: () => <Bed size={18} />,
    href: '/housing'
  },
  Certifications: {
    name: 'Certifications',
    label: 'Certifications',
    getIcon: () => <BookOpen size={18} />,
    href: '/certifications'
  },
  Tickets: {
    name: 'Tickets',
    label: 'Tickets',
    getIcon: () => <Ticket size={18} />,
    href: '/tickets'
  },
  Assets: {
    name: 'Assets',
    label: 'Assets',
    getIcon: () => <FileText size={18} />,
    href: '/assets'
  },
  Passes: {
    name: 'Passes',
    label: 'Passes',
    getIcon: () => <Puzzle size={18} />,
    href: '/passes'
  },
  Rentals: {
    name: 'Rentals',
    label: 'Rentals',
    getIcon: () => <Puzzle size={18} />,
    href: '/rentals'
  },
  Telemetry: {
    name: 'Telemetry',
    label: 'Telemetry',
    getIcon: () => <BarChart2 size={18} />,
    href: '/telemetry'
  },
  Forecasting: {
    name: 'Forecasting',
    label: 'Forecasting',
    getIcon: () => <BarChart2 size={18} />,
    href: '/forecasting'
  },
  Forms: {
    name: 'Forms',
    label: 'Forms',
    getIcon: () => <FileText size={18} />,
    href: '/forms'
  },
  Settings: {
    name: 'Settings',
    label: 'Settings',
    getIcon: () => <Settings size={18} />,
    href: '/settings'
  }
}; 