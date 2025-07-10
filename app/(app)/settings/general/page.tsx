'use client'

import { useState } from 'react'

export default function GeneralSettingsPage() {
  const [orgName, setOrgName] = useState('SlopeShift Resort')
  const [email, setEmail] = useState('admin@slopeshift.com')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    }, 1000)
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">General Settings</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Organization Name</label>
          <input
            className="input-field"
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button-primary min-w-[120px]" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {success && <div className="text-success-600 mt-2">Saved!</div>}
      </form>
    </div>
  )
} 