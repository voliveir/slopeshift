"use client";

import React, { useEffect, useState } from 'react'

export default function ForecastingPage() {
  const [forecastData, setForecastData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/forecasting')
      .then(res => res.json())
      .then(data => setForecastData(data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forecasting</h1>
        <button className="bg-primary-alpine text-white px-4 py-2 rounded-lg shadow-soft hover:shadow-medium transition-all" disabled>
          Generate Forecast
        </button>
        {/* TODO: Implement forecast generation */}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Staff Needs (Next Month)</h3>
            <p className="text-3xl font-bold text-primary-alpine">{forecastData.staffNeeds || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Revenue Projection</h3>
            <p className="text-3xl font-bold text-primary-alpine">${forecastData.revenueProjection || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-600">Occupancy Forecast</h3>
            <p className="text-3xl font-bold text-primary-alpine">{forecastData.occupancyForecast || 0}%</p>
          </div>
        </div>
      )}
      {/* TODO: Add forecasting charts and advanced analytics */}
    </div>
  )
} 