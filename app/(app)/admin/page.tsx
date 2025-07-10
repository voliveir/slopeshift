'use client'

import React, { useEffect, useState } from 'react'

interface Client {
  id: string
  name: string
  [key: string]: any
}

interface Module {
  id: string
  name: string
}

export default function AdminPortalPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [enabledModules, setEnabledModules] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [impersonating, setImpersonating] = useState<string | null>(null)
  const [impersonatedClient, setImpersonatedClient] = useState<Client | null>(null)

  // Check if impersonating
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cid = localStorage.getItem('clientId')
      setImpersonating(cid)
      if (cid && clients.length > 0) {
        const client = clients.find(c => c.id === cid)
        setImpersonatedClient(client || null)
      } else {
        setImpersonatedClient(null)
      }
    }
  }, [clients])

  // Fetch all clients
  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/clients')
      .then(res => res.json())
      .then(data => {
        setClients(data.clients || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch clients')
        setLoading(false)
      })
  }, [])

  // Fetch all modules
  useEffect(() => {
    fetch('/api/admin/modules')
      .then(res => res.json())
      .then(data => setModules(data.modules || []))
  }, [])

  // Fetch enabled modules for selected client
  useEffect(() => {
    if (!selectedClient) return
    fetch(`/api/admin/clients/${selectedClient.id}/modules`)
      .then(res => res.json())
      .then(data => setEnabledModules(data.modules || []))
  }, [selectedClient])

  // Handle client info update
  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedClient) return
    setSelectedClient({ ...selectedClient, [e.target.name]: e.target.value })
  }

  const handleSaveClientInfo = async () => {
    if (!selectedClient) return
    setLoading(true)
    await fetch(`/api/admin/clients/${selectedClient.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedClient),
    })
    setLoading(false)
    // Optionally refetch clients
  }

  // Handle module toggle
  const handleToggleModule = (moduleName: string) => {
    if (enabledModules.includes(moduleName)) {
      setEnabledModules(enabledModules.filter(m => m !== moduleName))
    } else {
      setEnabledModules([...enabledModules, moduleName])
    }
  }

  const handleSaveModules = async () => {
    if (!selectedClient) return
    setLoading(true)
    await fetch(`/api/admin/clients/${selectedClient.id}/modules`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modules: enabledModules }),
    })
    setLoading(false)
  }

  // Impersonate logic
  const handleImpersonate = (client: Client) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientId', client.id)
      window.location.href = '/dashboard'
    }
  }
  const handleStopImpersonate = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clientId')
      window.location.reload()
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* Impersonation Banner */}
      {impersonating && impersonatedClient && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-between border border-yellow-400 dark:border-yellow-700 shadow">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-yellow-800 dark:text-yellow-200">Impersonating:</span>
            <span className="font-semibold text-yellow-900 dark:text-yellow-100">{impersonatedClient.name}</span>
          </div>
          <button
            onClick={handleStopImpersonate}
            className="ml-4 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 font-semibold"
          >
            Stop Impersonating
          </button>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-secondary-900 dark:text-white">
        SlopeShift Admin Portal {impersonating && impersonatedClient && <span className="ml-2 text-yellow-500">(Impersonating {impersonatedClient.name})</span>}
      </h1>
      <div className="space-y-8">
        {/* Clients List */}
        <section className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-secondary-900 dark:text-white">Clients</h2>
          {loading && <p className="dark:text-secondary-100">Loading...</p>}
          {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
          <ul className="space-y-2">
            {clients.map(client => (
              <li key={client.id} className="flex items-center justify-between">
                <button
                  className={`text-left w-full px-2 py-1 rounded ${selectedClient?.id === client.id ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100' : 'hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-900 dark:text-secondary-100'}`}
                  onClick={() => setSelectedClient(client)}
                >
                  {client.name} <span className="text-xs text-secondary-500 dark:text-secondary-300">({client.id})</span>
                </button>
                <button
                  onClick={() => handleImpersonate(client)}
                  className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                  title="Impersonate this client"
                >
                  Impersonate
                </button>
              </li>
            ))}
          </ul>
        </section>
        {/* Edit Client Info */}
        <section className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-secondary-900 dark:text-white">Edit Client Info</h2>
          {selectedClient ? (
            <div className="space-y-4">
              <label className="block">
                <span className="text-secondary-700 dark:text-secondary-200">Name</span>
                <input
                  type="text"
                  name="name"
                  value={selectedClient.name || ''}
                  onChange={handleClientInfoChange}
                  className="mt-1 block w-full rounded border border-secondary-300 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 p-2 text-secondary-900 dark:text-white"
                />
              </label>
              {/* Add more fields as needed */}
              <button
                onClick={handleSaveClientInfo}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                disabled={loading}
              >
                Save
              </button>
            </div>
          ) : (
            <p className="dark:text-secondary-100">Select a client to edit their info.</p>
          )}
        </section>
        {/* Manage Modules */}
        <section className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-secondary-900 dark:text-white">Manage Enabled Modules</h2>
          {selectedClient ? (
            <div className="space-y-2">
              {modules.map(module => (
                <label key={module.id} className="flex items-center space-x-2 text-secondary-900 dark:text-secondary-100">
                  <input
                    type="checkbox"
                    checked={enabledModules.includes(module.name)}
                    onChange={() => handleToggleModule(module.name)}
                  />
                  <span>{module.name}</span>
                </label>
              ))}
              <button
                onClick={handleSaveModules}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                disabled={loading}
              >
                Save Modules
              </button>
            </div>
          ) : (
            <p className="dark:text-secondary-100">Select a client to manage their enabled modules.</p>
          )}
        </section>
      </div>
    </div>
  )
} 