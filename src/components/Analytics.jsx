import React, { useState, useEffect } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getPerformanceForUser } from '../firebase/firestoreHelpers'
import { generatePerformanceReport } from '../utils/pdfExport'

const sampleData = [
  { name: 'Week 1', score: 60 },
  { name: 'Week 2', score: 65 },
  { name: 'Week 3', score: 70 },
  { name: 'Week 4', score: 75 },
]

export default function Analytics() {
  const { user } = useAuth()
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const currentMonth = new Date().toISOString().slice(0, 7)
    getPerformanceForUser(user.uid, currentMonth)
      .then((docs) => {
        if (!docs.empty) {
          setPerformance(docs.docs[0].data())
        }
      })
      .finally(() => setLoading(false))
  }, [user])

  const handleExportPDF = () => {
    if (!performance) {
      alert('No performance data to export')
      return
    }
    generatePerformanceReport(
      performance,
      user.email.split('@')[0],
      new Date().toISOString().slice(0, 7)
    )
  }

  if (loading) {
    return <div className="p-6 text-gray-600">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Performance Analytics</h2>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            📥 Export PDF
          </button>
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={sampleData}>
              <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} />
              <CartesianGrid stroke="#e6e6e6" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {performance && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded shadow">
            <p className="text-sm text-gray-600">Attendance Rate</p>
            <p className="text-2xl font-semibold text-blue-600">{performance.attendanceRate}%</p>
          </div>
          <div className="p-4 bg-green-50 rounded shadow">
            <p className="text-sm text-gray-600">Tasks Completed</p>
            <p className="text-2xl font-semibold text-green-600">{performance.tasksCompleted}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded shadow">
            <p className="text-sm text-gray-600">Avg Rating</p>
            <p className="text-2xl font-semibold text-purple-600">
              {performance.averageTaskRating?.toFixed(1)}/5
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
