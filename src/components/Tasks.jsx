import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { createTask, updateTaskStatus, rateTask, getTasksForUser, getAllTasks, subscribeToUserTasks, subscribeToAllTasks, getAllUsers } from '../firebase/firestoreHelpers'

export default function Tasks() {
  const { user, userRole } = useAuth()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedTo: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        // Load users for assignment dropdown (admin/supervisor only)
        if (userRole === 'admin' || userRole === 'supervisor') {
          const usersData = await getAllUsers()
          setUsers(usersData)
        }

        // Load initial tasks
        const tasksData = userRole === 'admin' || userRole === 'supervisor'
          ? await getAllTasks()
          : await getTasksForUser(user.uid)
        setTasks(tasksData)
      } catch (error) {
        console.error('Error loading tasks data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Set up real-time subscriptions
    const unsubscribeTasks = userRole === 'admin' || userRole === 'supervisor'
      ? subscribeToAllTasks(setTasks)
      : subscribeToUserTasks(user.uid, setTasks)

    return () => unsubscribeTasks()
  }, [user, userRole])

  const handleAddTask = async () => {
    if (newTask.title && newTask.dueDate && newTask.assignedTo) {
      try {
        await createTask(
          newTask.title,
          newTask.description,
          newTask.assignedTo,
          user.uid,
          newTask.dueDate
        )
        setNewTask({ title: '', description: '', dueDate: '', assignedTo: '' })
        setShowForm(false)
      } catch (error) {
        console.error('Error creating task:', error)
        alert('Failed to create task. Please try again.')
      }
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus)
      // UI will update via real-time subscription
    } catch (error) {
      console.error('Error updating task status:', error)
      alert('Failed to update task status. Please try again.')
    }
  }

  const handleRateTask = async (taskId, rating) => {
    try {
      await rateTask(taskId, rating, '')
      // UI will update via real-time subscription
    } catch (error) {
      console.error('Error rating task:', error)
      alert('Failed to rate task. Please try again.')
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-600">Loading tasks...</div>
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tasks & Evaluations</h2>
          {(userRole === 'admin' || userRole === 'supervisor') && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : 'Create Task'}
            </button>
          )}
        </div>

        {showForm && (userRole === 'admin' || userRole === 'supervisor') && (
          <div className="mb-6 p-4 bg-gray-50 rounded border">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows="3"
              />
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select User to Assign</option>
                {users.map((user) => (
                  <option key={user.uid} value={user.uid}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
              <button
                onClick={handleAddTask}
                disabled={!newTask.title || !newTask.dueDate || !newTask.assignedTo}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Save Task
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map((task) => {
            const assignedUser = users.find(u => u.uid === task.assignedTo)
            const assignedUserName = assignedUser ? assignedUser.name : task.assignedTo
            const dueDate = task.dueDate?.toDate ? task.dueDate.toDate().toISOString().split('T')[0] : task.dueDate

            return (
              <div key={task.id} className="p-4 bg-gray-50 rounded border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Assigned to: {assignedUserName} | Due: {dueDate}
                    </p>
                  </div>
                <div className="space-y-2 ml-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                      task.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {task.status}
                  </span>
                  {task.rating > 0 && (
                    <span className="block text-xs font-semibold text-yellow-600">⭐ {task.rating}/5</span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleStatusChange(task.id, 'in_progress')}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusChange(task.id, 'completed')}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  Mark Done
                </button>
                {(userRole === 'admin' || userRole === 'supervisor') && task.status === 'completed' && (
                  <button
                    onClick={() => handleRateTask(task.id, 4.5)}
                    className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                  >
                    Rate
                  </button>
                )}
              </div>
            </div>
          )
        })}
        </div>
      </div>
    </div>
  )
}
