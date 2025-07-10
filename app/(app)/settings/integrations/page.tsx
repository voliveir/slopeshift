'use client'

import { useState } from 'react'

const integrations = [
  { name: 'Payroll', connected: true },
  { name: 'Slack', connected: false },
  { name: 'Google Calendar', connected: false },
]

export default function IntegrationsSettingsPage() {
  const [items, setItems] = useState(integrations)

  const toggle = (idx: number) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, connected: !item.connected } : item))
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Integrations</h1>
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li key={item.name} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
            <span className="font-medium">{item.name}</span>
            <button
              className={item.connected ? 'button-secondary' : 'button-primary'}
              onClick={() => toggle(idx)}
            >
              {item.connected ? 'Disconnect' : 'Connect'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
} 