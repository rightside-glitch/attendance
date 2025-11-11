import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Attendance from './components/Attendance'
import Tasks from './components/Tasks'
import Analytics from './components/Analytics'
import AdminPanel from './components/AdminPanel'
import NotificationCenter from './components/NotificationCenter'

function AppContent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold cursor-pointer" onClick={() => navigate('/')}>
            SAPT
          </h1>
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/" className="text-sm hover:text-blue-600">Dashboard</Link>
                <Link to="/attendance" className="text-sm hover:text-blue-600">Attendance</Link>
                <Link to="/tasks" className="text-sm hover:text-blue-600">Tasks</Link>
                <Link to="/analytics" className="text-sm hover:text-blue-600">Analytics</Link>
                <Link to="/admin" className="text-sm hover:text-blue-600">Admin</Link>
                <NotificationCenter />
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="text-sm hover:text-blue-600">Login</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
