"use client";

import React, { useEffect, useState } from 'react'

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/assets')
      .then(res => res.json())
      .then(data => setAssets(Array.isArray(data) ? data : Array.isArray(data.assets) ? data.assets : []))
      .finally(() => setLoading(false))
  }, [])

  const assetsList = Array.isArray(assets) ? assets : [];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Assets</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Create Asset
        </button>
        {/* TODO: Implement create asset modal/form */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-soft">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Serial</th>
              <th className="p-3">Next Service</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assetsList.map(asset => (
              <tr key={asset.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{asset.name}</td>
                <td className="p-3">{asset.type}</td>
                <td className="p-3">{asset.serial}</td>
                <td className="p-3">{asset.nextServiceDate ? new Date(asset.nextServiceDate).toLocaleDateString() : '-'}</td>
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