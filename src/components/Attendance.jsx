import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getAllUsers, getAllAttendance, markAttendance, subscribeToAllAttendance } from '../firebase/firestoreHelpers'

export default function Attendance() {
  const { user, userRole } = useAuth()
  const [users, setUsers] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [userAttendanceSummary, setUserAttendanceSummary] = useState({
    present: 0,
    absent: 0,
    late: 0
  })

  useEffect(() => {
    if (!user) return

    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

    const fetchData = async () => {
      setLoading(true)
      try {
        if (userRole === 'admin' || userRole === 'supervisor') {
          const allUsers = await getAllUsers()
          setUsers(allUsers)
        }

        // Fetch today's attendance
        const attendance = await getAllAttendance(startOfDay, endOfDay)
        setAttendanceData(attendance)

        // Fetch user's attendance summary (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const userAttendanceRecords = await getAllAttendance(thirtyDaysAgo, endOfDay)
        const userAttendance = userAttendanceRecords.filter(a => a.userId === user.uid)
        const summary = userAttendance.reduce((acc, record) => {
          acc[record.status] = (acc[record.status] || 0) + 1
          return acc
        }, { present: 0, absent: 0, late: 0 })
        setUserAttendanceSummary(summary)
      } catch (error) {
        console.error('Error fetching attendance data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up real-time subscription for attendance
    const unsubscribe = subscribeToAllAttendance(startOfDay, endOfDay, async (attendance) => {
      setAttendanceData(attendance)
      if (user) {
        // Refetch user's attendance summary when attendance changes
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        const userAttendanceRecords = await getAllAttendance(thirtyDaysAgo, endOfDay)
        const userAttendance = userAttendanceRecords.filter(a => a.userId === user.uid)
        const summary = userAttendance.reduce((acc, record) => {
          acc[record.status] = (acc[record.status] || 0) + 1
          return acc
        }, { present: 0, absent: 0, late: 0 })
        setUserAttendanceSummary(summary)
      }
    })

    return () => unsubscribe()
  }, [user, userRole])

  const handleMarkAttendance = async (userId, status) => {
    try {
      const today = new Date()
      await markAttendance(userId, today, status, user.uid)
      // The subscription will update the UI automatically
    } catch (error) {
      console.error('Error marking attendance:', error)
      // TODO: Show error message to user
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Attendance Management</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : userRole === 'admin' || userRole === 'supervisor' ? (
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
                {users.map((userData) => {
                  const todayAttendance = attendanceData.find(a => a.userId === userData.uid)
                  const status = todayAttendance ? todayAttendance.status : 'not_marked'
                  return (
                    <tr key={userData.uid} className="border-t">
                      <td className="px-4 py-2">{userData.name || userData.email}</td>
                      <td className="px-4 py-2">{userData.email}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            status === 'present'
                              ? 'bg-green-100 text-green-800'
                              : status === 'absent'
                              ? 'bg-red-100 text-red-800'
                              : status === 'late'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {status === 'not_marked' ? 'Not Marked' : status}
                        </span>
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleMarkAttendance(userData.uid, 'present')}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(userData.uid, 'absent')}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleMarkAttendance(userData.uid, 'late')}
                          className="px-2 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                        >
                          Late
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Only admins and supervisors can mark attendance.</p>
        )}
      </div>

      <div className="p-6 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Your Attendance Summary (Last 30 Days)</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Present Days</p>
            <p className="text-2xl font-semibold text-green-700">{userAttendanceSummary.present || 0}</p>
          </div>
          <div className="p-4 bg-red-50 rounded">
            <p className="text-sm text-gray-600">Absent Days</p>
            <p className="text-2xl font-semibold text-red-700">{userAttendanceSummary.absent || 0}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded">
            <p className="text-sm text-gray-600">Late Days</p>
            <p className="text-2xl font-semibold text-yellow-700">{userAttendanceSummary.late || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
