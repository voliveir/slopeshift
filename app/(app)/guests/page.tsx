"use client";

import React, { useEffect, useState } from 'react'

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/guests')
      .then(res => res.json())
      .then(data => setGuests(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Guests</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Create Guest
        </button>
        {/* TODO: Implement create guest modal/form */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-soft">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map(guest => (
              <tr key={guest.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{guest.name}</td>
                <td className="p-3">{guest.email}</td>
                <td className="p-3">{guest.phone}</td>
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