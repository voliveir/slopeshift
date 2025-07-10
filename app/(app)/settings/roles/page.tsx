'use client'

const roles = [
  { name: 'Admin', permissions: ['All Access'] },
  { name: 'Manager', permissions: ['Schedule Shifts', 'View Reports', 'Manage Staff'] },
  { name: 'Supervisor', permissions: ['Schedule Shifts', 'View Staff'] },
  { name: 'Seasonal', permissions: ['View Shifts'] },
]

export default function RolesSettingsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Roles & Permissions</h1>
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-secondary-50 dark:bg-secondary-800">
          <tr>
            <th className="text-left px-4 py-2">Role</th>
            <th className="text-left px-4 py-2">Permissions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.name} className="border-t">
              <td className="px-4 py-2 font-medium">{role.name}</td>
              <td className="px-4 py-2 text-secondary-700 dark:text-secondary-300">
                {role.permissions.join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 