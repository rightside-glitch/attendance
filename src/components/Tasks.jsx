import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const sampleTasks = [
  {
    id: '1',
    title: 'Complete Report',
    description: 'Finish the Q4 performance report',
    dueDate: '2025-11-20',
    status: 'pending',
    rating: 0,
  },
  {
    id: '2',
    title: 'Code Review',
    description: 'Review pull requests for the API module',
    dueDate: '2025-11-15',
    status: 'in_progress',
    rating: 0,
  },
  {
    id: '3',
    title: 'Training Session',
    description: 'Complete the new tool training',
    dueDate: '2025-11-12',
    status: 'completed',
    rating: 4.5,
  },
]

export default function Tasks() {
  const { userRole } = useAuth()
  const [tasks, setTasks] = useState(sampleTasks)
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' })

  const handleAddTask = () => {
    if (newTask.title && newTask.dueDate) {
      setTasks([...tasks, { ...newTask, id: Date.now().toString(), status: 'pending', rating: 0 }])
      setNewTask({ title: '', description: '', dueDate: '' })
      setShowForm(false)
    }
  }

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    )
    // TODO: Call updateTaskStatus() from firestoreHelpers.js
  }

  const handleRateTask = (taskId, rating) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, rating, status: 'completed' } : task))
    )
    // TODO: Call rateTask() from firestoreHelpers.js
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
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows="3"
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Task
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 bg-gray-50 rounded border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Due: {task.dueDate}</p>
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
          ))}
        </div>
      </div>
    </div>
  )
}
