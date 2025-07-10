"use client";

import React, { useEffect, useState } from 'react'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tickets</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Create Ticket
        </button>
        {/* TODO: Implement create ticket modal/form */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-soft">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Code</th>
              <th className="p-3">Status</th>
              <th className="p-3">Guest</th>
              <th className="p-3">Pass</th>
              <th className="p-3">Issued At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{ticket.code}</td>
                <td className="p-3">{ticket.status}</td>
                <td className="p-3">{ticket.guest?.name || '-'}</td>
                <td className="p-3">{ticket.pass?.code || '-'}</td>
                <td className="p-3">{ticket.issuedAt ? new Date(ticket.issuedAt).toLocaleString() : '-'}</td>
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