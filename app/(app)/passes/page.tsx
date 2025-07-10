"use client";

import React, { useEffect, useState } from 'react'

export default function PassesPage() {
  const [passes, setPasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/passes')
      .then(res => res.json())
      .then(data => setPasses(Array.isArray(data) ? data : Array.isArray(data.passes) ? data.passes : []))
      .finally(() => setLoading(false))
  }, [])

  const passesList = Array.isArray(passes) ? passes : [];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Passes</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Create Pass
        </button>
        {/* TODO: Implement create pass modal/form */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-soft">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Code</th>
              <th className="p-3">Guest</th>
              <th className="p-3">Valid From</th>
              <th className="p-3">Valid To</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {passesList.map(pass => (
              <tr key={pass.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{pass.code}</td>
                <td className="p-3">{pass.guest?.name || '-'}</td>
                <td className="p-3">{pass.validFrom ? new Date(pass.validFrom).toLocaleDateString() : '-'}</td>
                <td className="p-3">{pass.validTo ? new Date(pass.validTo).toLocaleDateString() : '-'}</td>
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