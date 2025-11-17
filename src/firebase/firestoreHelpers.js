import { db } from './initFirebase'
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, onSnapshot } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'

// --- Attendance Helpers ---
export async function markAttendance(userId, date, status, markedBy, method = 'manual') {
  const attendanceRef = collection(db, 'attendance')
  return await addDoc(attendanceRef, {
    userId,
    date,
    status,
    markedAt: Timestamp.now(),
    markedBy,
    method,
  })
}

export async function getAttendanceForUser(userId, startDate, endDate) {
  const attendanceRef = collection(db, 'attendance')
  const q = query(
    attendanceRef,
    where('userId', '==', userId),
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  )
  return await getDocs(q)
}

// --- Task Helpers ---
export async function createTask(title, description, assignedTo, assignedBy, dueDate) {
  const tasksRef = collection(db, 'tasks')
  return await addDoc(tasksRef, {
    title,
    description,
    assignedTo,
    assignedBy,
    dueDate,
    status: 'pending',
    rating: 0,
    createdAt: Timestamp.now(),
  })
}

export async function updateTaskStatus(taskId, status) {
  const taskRef = doc(db, 'tasks', taskId)
  return await updateDoc(taskRef, { status })
}

export async function rateTask(taskId, rating, feedback) {
  const taskRef = doc(db, 'tasks', taskId)
  return await updateDoc(taskRef, {
    rating,
    feedback,
    status: 'completed',
    completedAt: Timestamp.now(),
  })
}

export async function getTasksForUser(userId) {
  const tasksRef = collection(db, 'tasks')
  const q = query(tasksRef, where('assignedTo', '==', userId))
  return await getDocs(q)
}

export function subscribeToUserTasks(userId, callback) {
  const tasksRef = collection(db, 'tasks')
  const q = query(tasksRef, where('assignedTo', '==', userId))
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(tasks)
  })
}

// --- Performance Helpers ---
export async function updatePerformanceMetrics(userId, month, metrics) {
  const perfRef = collection(db, 'performance')
  const q = query(perfRef, where('userId', '==', userId), where('month', '==', month))
  const docs = await getDocs(q)

  if (docs.empty) {
    return await addDoc(perfRef, {
      userId,
      month,
      ...metrics,
      updatedAt: Timestamp.now(),
    })
  } else {
    const docRef = doc(db, 'performance', docs.docs[0].id)
    return await updateDoc(docRef, {
      ...metrics,
      updatedAt: Timestamp.now(),
    })
  }
}

export async function getPerformanceForUser(userId, month) {
  const perfRef = collection(db, 'performance')
  const q = query(perfRef, where('userId', '==', userId), where('month', '==', month))
  return await getDocs(q)
}

// --- Notification Helpers ---
export async function createNotification(userId, type, title, message, actionUrl = null) {
  const notifRef = collection(db, 'notifications')
  return await addDoc(notifRef, {
    userId,
    type,
    title,
    message,
    read: false,
    actionUrl,
    createdAt: Timestamp.now(),
  })
}

export function subscribeToUserNotifications(userId, callback) {
  const notifRef = collection(db, 'notifications')
  const q = query(notifRef, where('userId', '==', userId))
  return onSnapshot(q, (snapshot) => {
    const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(notifs)
  })
}

export async function markNotificationRead(notificationId) {
  const notifRef = doc(db, 'notifications', notificationId)
  return await updateDoc(notifRef, { read: true })
}

// --- User Helpers ---
export async function getUserData(userId) {
  const userRef = doc(db, 'users', userId)
  const snapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)))
  return snapshot.docs[0]?.data() || null
}

// --- Admin/Supervisor Helpers ---
export async function getAllUsers() {
  const usersRef = collection(db, 'users')
  const q = query(usersRef)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function getAllAttendance(startDate, endDate) {
  const attendanceRef = collection(db, 'attendance')
  const q = query(
    attendanceRef,
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function getAllTasks() {
  const tasksRef = collection(db, 'tasks')
  const q = query(tasksRef)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export function subscribeToAllTasks(callback) {
  const tasksRef = collection(db, 'tasks')
  return onSnapshot(tasksRef, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(tasks)
  })
}

export function subscribeToAllAttendance(startDate, endDate, callback) {
  const attendanceRef = collection(db, 'attendance')
  const q = query(
    attendanceRef,
    where('date', '>=', startDate),
    where('date', '<=', endDate)
  )
  return onSnapshot(q, (snapshot) => {
    const attendance = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(attendance)
  })
}
