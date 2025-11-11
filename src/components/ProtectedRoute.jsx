import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, userRole, loading } = useAuth()

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <div className="p-4 text-red-600">Access denied. Your role is not authorized.</div>
  }

  return children
}
