export const permissions = [
  'All Access',
  'Schedule Shifts',
  'View Reports',
  'Manage Staff',
  'View Staff',
  'View Shifts',
]

export const roles = [
  { name: 'Admin', permissions: ['All Access'] },
  { name: 'Manager', permissions: ['Schedule Shifts', 'View Reports', 'Manage Staff'] },
  { name: 'Supervisor', permissions: ['Schedule Shifts', 'View Staff'] },
  { name: 'Seasonal', permissions: ['View Shifts'] },
] 