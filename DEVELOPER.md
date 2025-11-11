# Developer Quick Reference

## File Structure

```
d:\project/
├── src/
│   ├── components/
│   │   ├── Auth.jsx                 # Email/password login & signup
│   │   ├── Dashboard.jsx            # Role-specific welcome & metrics
│   │   ├── Attendance.jsx           # Mark & view attendance (admin/supervisor only)
│   │   ├── Tasks.jsx                # Create, assign, and rate tasks
│   │   ├── Analytics.jsx            # Performance charts
│   │   └── ProtectedRoute.jsx       # Route protection by role
│   ├── context/
│   │   └── AuthContext.jsx          # Global auth state & role management
│   ├── firebase/
│   │   ├── firebaseConfig.js        # Firebase config from env variables
│   │   ├── initFirebase.js          # Firebase app initialization
│   │   ├── firestoreSchema.js       # Firestore schema docs & security rules
│   │   └── firestoreHelpers.js      # CRUD helper functions
│   ├── App.jsx                      # Main app component with routing
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Tailwind styles
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite config
├── tailwind.config.cjs              # Tailwind config
├── postcss.config.cjs               # PostCSS config
├── package.json                     # Dependencies
├── .env.example                     # Environment variables template
├── README.md                        # Project overview
├── SETUP_GUIDE.md                   # Step-by-step setup instructions
├── ROADMAP.md                       # Feature roadmap & future plans
└── .gitignore                       # Git ignore rules
```

## Key Concepts

### Roles & Access Control

```javascript
// Roles: 'admin', 'supervisor', 'student', 'employee'

// In AuthContext
const { user, userRole, login, signup, logout } = useAuth()

// In components
<ProtectedRoute allowedRoles={['admin', 'supervisor']}>
  <Attendance />
</ProtectedRoute>
```

### Firestore Collections

| Collection | Purpose | Access |
|-----------|---------|--------|
| `users/{uid}` | User profiles with roles | Private + Admin |
| `attendance/{id}` | Attendance records | Private + Supervisor |
| `tasks/{id}` | Task assignments | Private + Supervisor |
| `performance/{id}` | Performance metrics | Private + Supervisor |
| `notifications/{id}` | User notifications | Private |

### Common Patterns

#### Fetch Data from Firestore
```javascript
import { useEffect, useState } from 'react'
import { subscribeToUserTasks } from '../firebase/firestoreHelpers'

export function MyComponent() {
  const [tasks, setTasks] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const unsubscribe = subscribeToUserTasks(user.uid, setTasks)
    return unsubscribe
  }, [user])

  return <div>{tasks.map(t => <p key={t.id}>{t.title}</p>)}</div>
}
```

#### Create/Update Firestore Documents
```javascript
import { createTask, rateTask } from '../firebase/firestoreHelpers'

// Create
const taskId = await createTask(
  'Buy Groceries',
  'Get milk, eggs, bread',
  assignedToUserId,
  currentUserId,
  new Date('2025-12-01')
)

// Update
await rateTask(taskId, 5, 'Great work!')
```

#### Use Auth Context
```javascript
import { useAuth } from '../context/AuthContext'

export function MyComponent() {
  const { user, userRole, login, logout } = useAuth()

  if (!user) {
    return <p>Not logged in</p>
  }

  return (
    <div>
      <p>Welcome, {user.email} ({userRole})</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Development Workflow

### 1. Starting Dev Server
```powershell
cd d:\project
npm run dev
```

Open http://localhost:5173

### 2. Building for Production
```powershell
npm run build
npm run preview  # Preview the build locally
```

### 3. Adding a New Feature

**Example: Add a "Reports" page**

1. Create component: `src/components/Reports.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />
   ```
3. Add nav link in header
4. Add any new Firestore helpers in `src/firebase/firestoreHelpers.js`
5. Test in dev server

### 4. Deploying to Vercel

```bash
git push origin main
# Vercel auto-deploys on git push
```

Or manually:
```bash
npm run build
vercel deploy  # If you have Vercel CLI installed
```

## Common Tasks

### Add a New Firestore Helper
```javascript
// In src/firebase/firestoreHelpers.js

export async function myNewFunction(param1, param2) {
  const ref = collection(db, 'collectionName')
  const q = query(ref, where('field', '==', value))
  return await getDocs(q)
}
```

### Create a Protected Admin-Only Page
```javascript
// src/components/AdminOnly.jsx
export default function AdminOnly() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>Admin content here</div>
    </ProtectedRoute>
  )
}

// In App.jsx
<Route path="/admin" element={<AdminOnly />} />
```

### Add Real-Time Firestore Data to a Component
```javascript
useEffect(() => {
  const unsubscribe = onSnapshot(query(...), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setState(data)
  })
  return unsubscribe
}, [])
```

### Handle Loading States
```javascript
const { loading } = useAuth()

if (loading) {
  return <div className="p-4">Loading...</div>
}

return <div>Content</div>
```

## Environment Variables

Available in code via `import.meta.env.VITE_*`:

```javascript
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
```

**Note**: Variables must be prefixed with `VITE_` to be accessible in the browser.

## Debugging Tips

### Check Auth State
```javascript
// In browser console
// Install React DevTools to inspect useAuth() state
```

### Check Firestore Writes
- Open Firebase Console → Firestore → Collections
- Look for new documents being created in real-time

### Check Network Requests
- Open browser DevTools → Network tab
- Look for Firestore API calls to `firestore.googleapis.com`

### Enable Firebase Debug Logging
```javascript
import { getFirestore, enableLogging } from 'firebase/firestore'
enableLogging(true)
```

## Useful Links

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)

## Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `useAuth() must be used within AuthProvider` | Wrap component in `<AuthProvider>` in App.jsx |
| `Cannot read property 'uid' of null` | Check that `user` is defined before accessing properties |
| Firestore query returns empty | Check security rules allow your role to read that collection |
| `.env.local` values not loading | Restart dev server after adding `.env.local` |
| Build is 990KB | Consider code-splitting; see [ROADMAP.md](./ROADMAP.md) |

---

**Questions?** Ask in the GitHub Issues or refer to [SETUP_GUIDE.md](./SETUP_GUIDE.md) and [ROADMAP.md](./ROADMAP.md).
