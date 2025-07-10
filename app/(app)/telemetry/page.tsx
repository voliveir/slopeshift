"use client";

import React, { useEffect, useState } from 'react'

export default function TelemetryPage() {
  const [telemetryData, setTelemetryData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/telemetry')
      .then(res => res.json())
      .then(data => setTelemetryData(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Telemetry</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Refresh Metrics
        </button>
        {/* TODO: Implement real-time metrics refresh */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">System Health</h3>
            <p className="text-3xl font-bold text-primary-alpine">{telemetryData.systemHealth || 'Good'}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Response Time</h3>
            <p className="text-3xl font-bold text-primary-alpine">{telemetryData.responseTime || 0}ms</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Active Users</h3>
            <p className="text-3xl font-bold text-primary-alpine">{telemetryData.activeUsers || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Error Rate</h3>
            <p className="text-3xl font-bold text-primary-alpine">{telemetryData.errorRate || 0}%</p>
          </div>
        </div>
      )}
      {/* TODO: Add real-time monitoring charts and alerts */}
    </div>
  )
} 