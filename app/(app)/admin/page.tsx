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

  // TODO: Replace with real clientId from session/auth
  const ADMIN_CLIENT_ID = typeof window !== 'undefined' ? localStorage.getItem('clientId') : null

  // Fetch all clients
  useEffect(() => {
    if (!ADMIN_CLIENT_ID) return
    setLoading(true)
    fetch(`/api/admin/clients?clientId=${ADMIN_CLIENT_ID}`)
      .then(res => res.json())
      .then(data => {
        setClients(data.clients || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch clients')
        setLoading(false)
      })
  }, [ADMIN_CLIENT_ID])

  // Fetch all modules
  useEffect(() => {
    if (!ADMIN_CLIENT_ID) return
    fetch(`/api/admin/modules?clientId=${ADMIN_CLIENT_ID}`)
      .then(res => res.json())
      .then(data => setModules(data.modules || []))
  }, [ADMIN_CLIENT_ID])

  // Fetch enabled modules for selected client
  useEffect(() => {
    if (!selectedClient || !ADMIN_CLIENT_ID) return
    fetch(`/api/admin/clients/${selectedClient.id}/modules?clientId=${ADMIN_CLIENT_ID}`)
      .then(res => res.json())
      .then(data => setEnabledModules(data.modules || []))
  }, [selectedClient, ADMIN_CLIENT_ID])

  // Handle client info update
  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedClient) return
    setSelectedClient({ ...selectedClient, [e.target.name]: e.target.value })
  }

  const handleSaveClientInfo = async () => {
    if (!selectedClient || !ADMIN_CLIENT_ID) return
    setLoading(true)
    await fetch(`/api/admin/clients/${selectedClient.id}?clientId=${ADMIN_CLIENT_ID}`, {
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
    if (!selectedClient || !ADMIN_CLIENT_ID) return
    setLoading(true)
    await fetch(`/api/admin/clients/${selectedClient.id}/modules?clientId=${ADMIN_CLIENT_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modules: enabledModules }),
    })
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">SlopeShift Admin Portal</h1>
      <div className="space-y-8">
        {/* Clients List */}
        <section className="bg-white dark:bg-secondary-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Clients</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <ul className="space-y-2">
            {clients.map(client => (
              <li key={client.id}>
                <button
                  className={`text-left w-full px-2 py-1 rounded ${selectedClient?.id === client.id ? 'bg-primary-100 dark:bg-primary-900/30' : 'hover:bg-secondary-100 dark:hover:bg-secondary-800'}`}
                  onClick={() => setSelectedClient(client)}
                >
                  {client.name} <span className="text-xs text-secondary-500">({client.id})</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        {/* Edit Client Info */}
        <section className="bg-white dark:bg-secondary-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Client Info</h2>
          {selectedClient ? (
            <div className="space-y-4">
              <label className="block">
                <span className="text-secondary-700 dark:text-secondary-200">Name</span>
                <input
                  type="text"
                  name="name"
                  value={selectedClient.name || ''}
                  onChange={handleClientInfoChange}
                  className="mt-1 block w-full rounded border border-secondary-300 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800 p-2"
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
            <p>Select a client to edit their info.</p>
          )}
        </section>
        {/* Manage Modules */}
        <section className="bg-white dark:bg-secondary-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Enabled Modules</h2>
          {selectedClient ? (
            <div className="space-y-2">
              {modules.map(module => (
                <label key={module.id} className="flex items-center space-x-2">
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
            <p>Select a client to manage their enabled modules.</p>
          )}
        </section>
      </div>
    </div>
  )
} 