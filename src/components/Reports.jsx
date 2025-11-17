import React, { useState } from 'react'
import { generatePerformanceReport } from '../utils/pdfExport'

export default function Reports() {
  const [reportType, setReportType] = useState('attendance')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const handleGenerateReport = () => {
    if (reportType === 'performance') {
      // For now, generate sample performance report
      generatePerformanceReport(
        {
          attendanceRate: 85,
          tasksCompleted: 12,
          averageTaskRating: 4.2,
          flags: []
        },
        'Sample User',
        new Date().toISOString().slice(0, 7)
      )
    } else {
      alert('Attendance report generation coming soon!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Reports & Exports</h2>
        <p className="text-gray-600 mb-6">Generate and download detailed reports for attendance, performance, and analytics.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="attendance">Attendance Report</option>
              <option value="performance">Performance Report</option>
              <option value="analytics">Analytics Summary</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            📥 Generate & Download PDF
          </button>
        </div>
      </div>

      <div className="p-6 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">Monthly Attendance Report</h4>
              <p className="text-sm text-gray-600">Comprehensive attendance data with charts</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
              Download
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">Performance Analytics</h4>
              <p className="text-sm text-gray-600">Task completion and rating summaries</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
              Download
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <h4 className="font-medium">Team Overview</h4>
              <p className="text-sm text-gray-600">Combined metrics for all team members</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}