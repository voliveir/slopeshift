"use client";

import React, { useEffect, useState } from 'react'

export default function RentalsPage() {
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/rentals')
      .then(res => res.json())
      .then(data => setRentals(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rentals</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Create Rental
        </button>
        {/* TODO: Implement create rental modal/form */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-soft">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Item</th>
              <th className="p-3">Guest</th>
              <th className="p-3">Staff</th>
              <th className="p-3">Rented At</th>
              <th className="p-3">Returned At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map(rental => (
              <tr key={rental.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{rental.item?.name || '-'}</td>
                <td className="p-3">{rental.guest?.name || '-'}</td>
                <td className="p-3">{rental.staff?.name || '-'}</td>
                <td className="p-3">{rental.rentedAt ? new Date(rental.rentedAt).toLocaleString() : '-'}</td>
                <td className="p-3">{rental.returnedAt ? new Date(rental.returnedAt).toLocaleString() : '-'}</td>
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