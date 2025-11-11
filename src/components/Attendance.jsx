import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const sampleUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'present' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'absent' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', status: 'late' },
]

export default function Attendance() {
  const { userRole } = useAuth()
  const [attendanceList, setAttendanceList] = useState(sampleUsers)

  const handleMarkAttendance = (userId, status) => {
    setAttendanceList((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status } : user))
    )
    // TODO: Call markAttendance() from firestoreHelpers.js to save to Firestore
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Attendance Management</h2>

        {userRole === 'admin' || userRole === 'supervisor' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleMarkAttendance(user.id, 'present')}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(user.id, 'absent')}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(user.id, 'late')}
                        className="px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                      >
                        Late
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Only admins and supervisors can mark attendance.</p>
        )}
      </div>

      <div className="p-6 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Your Attendance Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Present Days</p>
            <p className="text-2xl font-semibold text-green-700">24</p>
          </div>
          <div className="p-4 bg-red-50 rounded">
            <p className="text-sm text-gray-600">Absent Days</p>
            <p className="text-2xl font-semibold text-red-700">2</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded">
            <p className="text-sm text-gray-600">Late Days</p>
            <p className="text-2xl font-semibold text-yellow-700">1</p>
          </div>
        </div>
      </div>
    </div>
  )
}
