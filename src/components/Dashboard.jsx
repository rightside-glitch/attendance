import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { subscribeToUserNotifications, getAllUsers, getAllAttendance, getAllTasks, subscribeToAllTasks, subscribeToAllAttendance } from '../firebase/firestoreHelpers'

// Sample data - replace with real Firebase data
const attendanceData = [
  { day: 'Mon', present: 25, absent: 5 },
  { day: 'Tue', present: 28, absent: 2 },
  { day: 'Wed', present: 26, absent: 4 },
  { day: 'Thu', present: 30, absent: 0 },
  { day: 'Fri', present: 27, absent: 3 },
]

const attendancePieData = [
  { name: 'Present', value: 136, color: '#10B981' },
  { name: 'Absent', value: 14, color: '#EF4444' },
]

const taskProgressData = [
  { user: 'John Doe', completed: 8, total: 10 },
  { user: 'Jane Smith', completed: 6, total: 8 },
  { user: 'Bob Wilson', completed: 9, total: 9 },
]

const performanceTrendData = [
  { month: 'Aug', score: 75 },
  { month: 'Sep', score: 80 },
  { month: 'Oct', score: 85 },
  { month: 'Nov', score: 88 },
]

export default function Dashboard() {
  const { user, userRole } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [attendance, setAttendance] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        // Get current week dates (Monday to Friday)
        const now = new Date()
        const monday = new Date(now)
        monday.setDate(now.getDate() - now.getDay() + 1)
        const friday = new Date(monday)
        friday.setDate(monday.getDate() + 4)

        const startDate = monday.toISOString().split('T')[0]
        const endDate = friday.toISOString().split('T')[0]

        // Fetch data
        const [usersData, attendanceData, tasksData] = await Promise.all([
          getAllUsers(),
          getAllAttendance(startDate, endDate),
          getAllTasks()
        ])

        setUsers(usersData)
        setAttendance(attendanceData)
        setTasks(tasksData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Subscribe to real-time updates
    const unsubscribeTasks = subscribeToAllTasks(setTasks)
    const unsubscribeAttendance = subscribeToAllAttendance(startDate, endDate, setAttendance)
    const unsubscribeNotifs = subscribeToUserNotifications(user.uid, (notifs) => {
      const displayNotifs = notifs.slice(0, 5).map(notif => ({
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        time: new Date(notif.createdAt?.toDate()).toLocaleString(),
      }))
      if (displayNotifs.length === 0) {
        setNotifications([
          { id: 1, type: 'warning', title: 'Task Deadline', message: 'Project review due tomorrow', time: '2 hours ago' },
          { id: 2, type: 'info', title: 'New User', message: 'Alice joined the team', time: '1 day ago' },
          { id: 3, type: 'success', title: 'Task Completed', message: 'John completed the API integration', time: '3 hours ago' },
        ])
      } else {
        setNotifications(displayNotifs)
      }
    })

    return () => {
      unsubscribeTasks()
      unsubscribeAttendance()
      unsubscribeNotifs()
    }
  }, [user])

  // Calculate data for charts and KPIs
  const calculateKPIs = () => {
    const activeUsers = users.length
    const totalAttendance = attendance.length
    const presentCount = attendance.filter(a => a.status === 'present').length
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const avgPerformance = tasks.length > 0 ? tasks.reduce((sum, t) => sum + (t.performanceScore || 0), 0) / tasks.length : 0

    return { activeUsers, attendanceRate, completedTasks: completedTasks, avgPerformance: avgPerformance.toFixed(1) }
  }

  const calculateAttendanceChart = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    const data = days.map(day => {
      const dayAttendance = attendance.filter(a => {
        const date = new Date(a.date)
        return date.toLocaleDateString('en-US', { weekday: 'short' }) === day
      })
      const present = dayAttendance.filter(a => a.status === 'present').length
      const absent = dayAttendance.filter(a => a.status === 'absent').length
      return { day, present, absent }
    })
    return data
  }

  const calculateAttendancePie = () => {
    const present = attendance.filter(a => a.status === 'present').length
    const absent = attendance.filter(a => a.status === 'absent').length
    return [
      { name: 'Present', value: present, color: '#10B981' },
      { name: 'Absent', value: absent, color: '#EF4444' },
    ]
  }

  const calculateTaskProgress = () => {
    const userTasks = {}
    tasks.forEach(task => {
      if (!userTasks[task.assignedTo]) {
        userTasks[task.assignedTo] = []
      }
      userTasks[task.assignedTo].push(task)
    })

    return Object.entries(userTasks).slice(0, 3).map(([userId, userTasks]) => {
      const user = users.find(u => u.uid === userId)
      const name = user ? user.name : userId
      const completed = userTasks.filter(t => t.status === 'completed').length
      const total = userTasks.length
      return { user: name, completed, total }
    })
  }

  if (loading) {
    return <div className="p-6 text-gray-600">Loading dashboard...</div>
  }

  const kpis = calculateKPIs()
  const attendanceData = calculateAttendanceChart()
  const attendancePieData = calculateAttendancePie()
  const taskProgressData = calculateTaskProgress()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, {user?.email}. Here's what's happening with your team.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-green-600 text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.attendanceRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-purple-600 text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-yellow-600 text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.avgPerformance}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Module */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Attendance Overview</h2>
          <Link to="/attendance" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Details →
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Daily Attendance (This Week)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#10B981" name="Present" />
                <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Attendance Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendancePieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {attendancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Task & Performance Module */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Task & Performance</h2>
          <Link to="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Details →
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Team Progress</h3>
            <div className="space-y-4">
              {taskProgressData.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{user.user}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(user.completed / user.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{user.completed}/{user.total}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Performance Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Notifications & Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
          <Link to="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full mr-3 ${
                notif.type === 'warning' ? 'bg-yellow-100' :
                notif.type === 'info' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <span className="text-sm">
                  {notif.type === 'warning' ? '⚠️' :
                   notif.type === 'info' ? 'ℹ️' : '📢'}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{notif.title}</h4>
                <p className="text-sm text-gray-600">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/attendance" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <span className="text-3xl mb-2 block">📅</span>
            <h3 className="text-lg font-semibold mb-2">Mark Attendance</h3>
            <p className="text-gray-600 text-sm">Update daily attendance records</p>
          </div>
        </Link>
        <Link to="/tasks" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <span className="text-3xl mb-2 block">📋</span>
            <h3 className="text-lg font-semibold mb-2">Manage Tasks</h3>
            <p className="text-gray-600 text-sm">Assign and track task progress</p>
          </div>
        </Link>
        <Link to="/reports" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="text-center">
            <span className="text-3xl mb-2 block">📄</span>
            <h3 className="text-lg font-semibold mb-2">Generate Reports</h3>
            <p className="text-gray-600 text-sm">Download PDF reports</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
