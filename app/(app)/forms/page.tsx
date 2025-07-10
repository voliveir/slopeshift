"use client";

import React, { useEffect, useState } from 'react'

export default function FormsPage() {
  const [forms, setForms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/forms')
      .then(res => res.json())
      .then(data => setForms(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forms</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Create Form
        </button>
        {/* TODO: Implement create form modal/form */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full bg-white rounded-xl shadow-soft">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(forms) && forms.map(form => (
              <tr key={form.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{form.title}</td>
                <td className="p-3">{form.type}</td>
                <td className="p-3">{form.status}</td>
                <td className="p-3">{form.createdAt ? new Date(form.createdAt).toLocaleDateString() : '-'}</td>
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