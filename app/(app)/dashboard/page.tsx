"use client";

import React, { useEffect, useState } from 'react'
import AppLayout from "../app-layout";

export default function DashboardPageWrapper() {
  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
}

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => setDashboardData(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Refresh Data
        </button>
        {/* TODO: Implement real-time data refresh */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Total Staff</h3>
            <p className="text-3xl font-bold text-primary-alpine">{dashboardData.totalStaff || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Active Shifts</h3>
            <p className="text-3xl font-bold text-primary-alpine">{dashboardData.activeShifts || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Housing Occupancy</h3>
            <p className="text-3xl font-bold text-primary-alpine">{dashboardData.housingOccupancy || 0}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
            <p className="text-3xl font-bold text-primary-alpine">${dashboardData.revenue || 0}</p>
          </div>
        </div>
      )}
      {/* TODO: Add charts and advanced analytics */}
    </div>
  )
} 