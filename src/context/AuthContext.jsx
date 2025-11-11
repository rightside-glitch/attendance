import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../firebase/initFirebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // Fetch user role from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid)
        const userDocSnap = await getDoc(userDocRef)
        if (userDocSnap.exists()) {
          setUserRole(userDocSnap.data().role)
        }
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (email, password, role = 'student') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Create user doc in Firestore with role
    const userDocRef = doc(db, 'users', userCredential.user.uid)
    await setDoc(userDocRef, {
      uid: userCredential.user.uid,
      email,
      role,
      createdAt: Timestamp.now(),
      name: email.split('@')[0], // Default name from email
    })
    return userCredential.user
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
