import React, { useState, useEffect } from 'react'
import { db } from '../firebase/initFirebase'
import { collection, query, getDocs, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'student',
    department: '',
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef)
      const snapshot = await getDocs(q)
      const userData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setUsers(userData)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveUser = async () => {
    if (!formData.email || !formData.name) {
      alert('Email and name are required')
      return
    }

    try {
      const userDocRef = doc(db, 'users', editingUser?.id || formData.email)
      const userData = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        department: formData.department,
        updatedAt: Timestamp.now(),
      }

      if (!editingUser) {
        userData.createdAt = Timestamp.now()
      }

      await setDoc(userDocRef, userData, { merge: true })
      setFormData({ email: '', name: '', role: 'student', department: '' })
      setEditingUser(null)
      setShowForm(false)
      loadUsers()
    } catch (error) {
      alert('Error saving user: ' + error.message)
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name || '',
      role: user.role,
      department: user.department || '',
    })
    setShowForm(true)
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      await deleteDoc(doc(db, 'users', userId))
      loadUsers()
    } catch (error) {
      alert('Error deleting user: ' + error.message)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({ email: '', name: '', role: 'student', department: '' })
  }

  if (loading) {
    return <div className="p-6 text-gray-600">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add User'}
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded border">
            <h3 className="font-semibold mb-4">{editingUser ? 'Edit User' : 'Create New User'}</h3>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!editingUser}
                className="w-full px-3 py-2 border rounded disabled:bg-gray-100"
              />
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Admin</option>
              </select>
              <input
                type="text"
                placeholder="Department (optional)"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveUser}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.name || '—'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : user.role === 'supervisor'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">{user.department || '—'}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <p className="text-center text-gray-600 py-8">No users yet. Create one to get started!</p>
        )}
      </div>

      <div className="p-4 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Users created here are for manual administration. New users who sign up will be created automatically in Firestore.
        </p>
      </div>
    </div>
  )
}
