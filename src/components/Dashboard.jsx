import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getPerformanceForUser } from '../firebase/firestoreHelpers'

export default function Dashboard() {
  const { user, userRole } = useAuth()
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    // Fetch current month performance metrics
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    getPerformanceForUser(user.uid, currentMonth)
      .then((docs) => {
        if (!docs.empty) {
          setPerformance(docs.docs[0].data())
        } else {
          // No data yet, show defaults
          setPerformance(null)
        }
      })
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <p className="text-gray-600">Welcome, <strong>{user?.email}</strong></p>
        <p className="text-gray-600">Your role: <span className="font-semibold capitalize">{userRole}</span></p>
      </div>

      {userRole === 'admin' && (
        <div className="p-6 bg-blue-50 rounded shadow border-l-4 border-blue-600">
          <h3 className="text-lg font-semibold mb-3">Admin Panel</h3>
          <p className="text-sm text-gray-700 mb-3">You have full access to all modules.</p>
          <ul className="space-y-2 text-sm">
            <li>✓ Manage all users and roles</li>
            <li>✓ View complete attendance records</li>
            <li>✓ Assign and rate tasks</li>
            <li>✓ Access all analytics and reports</li>
          </ul>
        </div>
      )}

      {userRole === 'supervisor' && (
        <div className="p-6 bg-green-50 rounded shadow border-l-4 border-green-600">
          <h3 className="text-lg font-semibold mb-3">Supervisor Dashboard</h3>
          <p className="text-sm text-gray-700 mb-3">You can manage team members and assign tasks.</p>
          <ul className="space-y-2 text-sm">
            <li>✓ Mark team attendance</li>
            <li>✓ Assign and rate tasks</li>
            <li>✓ View team performance</li>
            <li>✓ Generate team reports</li>
          </ul>
        </div>
      )}

      {userRole === 'student' && (
        <div className="p-6 bg-purple-50 rounded shadow border-l-4 border-purple-600">
          <h3 className="text-lg font-semibold mb-3">My Progress</h3>
          <p className="text-sm text-gray-700 mb-3">Track your attendance and task completion.</p>
          <ul className="space-y-2 text-sm">
            <li>✓ View your attendance</li>
            <li>✓ Check assigned tasks</li>
            <li>✓ View your performance metrics</li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600 text-sm">Attendance Rate</p>
          <p className="text-2xl font-semibold">
            {performance?.attendanceRate || '—'}%
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600 text-sm">Tasks Completed</p>
          <p className="text-2xl font-semibold">
            {performance?.tasksCompleted || 0}
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-600 text-sm">Avg Rating</p>
          <p className="text-2xl font-semibold">
            {performance?.averageTaskRating
              ? performance.averageTaskRating.toFixed(1)
              : '—'}/5
          </p>
        </div>
      </div>

      {performance?.flags && performance.flags.length > 0 && (
        <div className="p-4 bg-red-50 rounded shadow border-l-4 border-red-600">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Alerts</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {performance.flags.map((flag, idx) => (
              <li key={idx}>• {flag.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
