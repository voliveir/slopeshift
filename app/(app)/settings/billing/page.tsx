'use client'

import { useState } from 'react'

export default function BillingSettingsPage() {
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleUpdate = () => {
    setUpdating(true)
    setTimeout(() => {
      setUpdating(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    }, 1000)
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Billing</h1>
      <div className="mb-6 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
        <div className="mb-2">Plan: <span className="font-medium">Pro Annual</span></div>
        <div className="mb-2">Renewal: <span className="font-medium">2025-01-01</span></div>
        <div>Status: <span className="text-success-600 font-medium">Active</span></div>
      </div>
      <button className="button-primary min-w-[180px]" onClick={handleUpdate} disabled={updating}>
        {updating ? 'Updating...' : 'Update Payment Method'}
      </button>
      {success && <div className="text-success-600 mt-2">Payment method updated!</div>}
    </div>
  )
} 