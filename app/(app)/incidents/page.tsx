"use client";

import React, { useEffect, useState } from 'react'

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/incidents')
      .then(res => res.json())
      .then(data => setIncidents(Array.isArray(data) ? data : Array.isArray(data.incidents) ? data.incidents : []))
      .finally(() => setLoading(false))
  }, [])

  const incidentsList = Array.isArray(incidents) ? incidents : [];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Incidents</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Report Incident
        </button>
        {/* TODO: Implement report incident modal/form */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-soft">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Location</th>
              <th className="p-3">Validated</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidentsList.map(incident => (
              <tr key={incident.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{incident.type}</td>
                <td className="p-3">{incident.description}</td>
                <td className="p-3">{incident.location}</td>
                <td className="p-3">{incident.validated ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  {/* TODO: Edit/Delete actions */}
                  <button className="text-primary-alpine font-semibold" disabled>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
} 