"use client";

import React, { useEffect, useState } from 'react'

export default function HousingPage() {
  const [housing, setHousing] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/housing')
      .then(res => res.json())
      .then(data => setHousing(Array.isArray(data) ? data : Array.isArray(data.housing) ? data.housing : []))
      .finally(() => setLoading(false))
  }, [])

  const housingList = Array.isArray(housing) ? housing : [];

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Housing</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Create Housing
        </button>
        {/* TODO: Implement create housing modal/form */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-soft">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Address</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Beds</th>
              <th className="p-3">Residents</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {housingList.map(house => (
              <tr key={house.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{house.address}</td>
                <td className="p-3">{house.unit}</td>
                <td className="p-3">{house.beds}</td>
                <td className="p-3">{house.residents?.map((r: any) => r.name).join(', ') || '-'}</td>
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