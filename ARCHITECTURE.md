# SAPT Architecture & User Flow Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SAPT Frontend (React)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App.jsx (Main Router)                   │   │
│  │  ┌─ AuthProvider (Global State)                      │   │
│  │  │  ├─ useAuth() Context                            │   │
│  │  │  │  ├─ user (Firebase Auth)                      │   │
│  │  │  │  └─ userRole (Firestore)                      │   │
│  │  │  │                                               │   │
│  │  └─ Routes (Protected):                             │   │
│  │     ├─ /auth → Auth.jsx                            │   │
│  │     ├─ / → Dashboard.jsx ✅ Real Data              │   │
│  │     ├─ /attendance → Attendance.jsx                │   │
│  │     ├─ /tasks → Tasks.jsx                          │   │
│  │     ├─ /analytics → Analytics.jsx ✅ Real + PDF    │   │
│  │     └─ /admin → AdminPanel.jsx ✅ CRUD             │   │
│  │                                                      │   │
│  │  Header Components:                                 │   │
│  │  ├─ Navigation Links                               │   │
│  │  ├─ NotificationCenter.jsx 🔔 ✅ Real-Time         │   │
│  │  └─ User Email + Logout                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Component Layer (Page Components)            │   │
│  │  ├─ Auth.jsx (Email/Password + Roles)              │   │
│  │  ├─ Dashboard.jsx (Performance Metrics) ✅          │   │
│  │  ├─ Attendance.jsx (Mark Attendance)                │   │
│  │  ├─ Tasks.jsx (Task Management)                     │   │
│  │  ├─ Analytics.jsx (Charts + PDF) ✅                 │   │
│  │  ├─ AdminPanel.jsx (User CRUD) ✅                   │   │
│  │  └─ NotificationCenter.jsx (Notifications) ✅       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Utility Layer (Helpers & Utils)            │   │
│  │  ├─ AuthContext.jsx (Auth State Management)         │   │
│  │  ├─ ProtectedRoute.jsx (Route Guards)               │   │
│  │  ├─ firestoreHelpers.js (CRUD Functions) ✅         │   │
│  │  └─ pdfExport.js (PDF Generation) ✅                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Styling & Config                       │   │
│  │  ├─ Tailwind CSS (tailwind.config.cjs)              │   │
│  │  ├─ PostCSS (postcss.config.cjs)                    │   │
│  │  ├─ Vite Config (vite.config.js)                    │   │
│  │  └─ Main CSS (src/index.css)                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
                   Firebase SDK (React)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│           Firebase Backend (Cloud Services)                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Authentication  │         │    Firestore     │          │
│  │  (Firebase Auth) │         │   (Real-Time DB) │          │
│  │  ├─ Email/Pass   │         │  ├─ users        │          │
│  │  ├─ OAuth        │         │  ├─ attendance   │          │
│  │  └─ Tokens       │         │  ├─ tasks        │          │
│  │                  │         │  ├─ performance  │          │
│  │                  │         │  └─ notifications│          │
│  └──────────────────┘         └──────────────────┘          │
│           ↓                            ↓                     │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │ Security Rules   │         │ Real-Time Sync   │          │
│  │ (Role-Based)     │         │ (onSnapshot)     │          │
│  │ ├─ Admin         │         │ ├─ Subscriptions │          │
│  │ ├─ Supervisor    │         │ ├─ Queries       │          │
│  │ └─ Student       │         │ └─ Listeners     │          │
│  └──────────────────┘         └──────────────────┘          │
│                                                               │
│  Future: Cloud Functions (Triggers, Automation)             │
│  └─ onWrite triggers                                        │
│  └─ Scheduled functions                                     │
│  └─ HTTP endpoints                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 👤 User Role & Permission Flow

```
User Signs Up
     ↓
Email + Password + Role Selection
     ↓
Firebase createUserWithEmailAndPassword()
     ↓
AuthContext receives user
     ↓
Create Firestore user doc: { uid, email, name, role }
     ↓
User redirected to Dashboard
     ↓
Check userRole from Firestore user doc
     ↓
┌────────────────────────────────────────────────┐
│                                                │
├─ ADMIN Role ──────────────────────────────────┤
│ ✓ Dashboard (see all metrics)                │
│ ✓ Attendance (mark anyone, see all)          │
│ ✓ Tasks (assign, rate, see all)              │
│ ✓ Analytics (see all users)                  │
│ ✓ Admin Panel (manage users)                 │
│ ✓ Notifications (all types)                  │
│                                                │
├─ SUPERVISOR Role ─────────────────────────────┤
│ ✓ Dashboard (see metrics)                    │
│ ✓ Attendance (mark team, see team)           │
│ ✓ Tasks (assign team, rate)                  │
│ ✓ Analytics (see team)                       │
│ ✗ Admin Panel (denied)                       │
│ ✓ Notifications (team-related)               │
│                                                │
├─ STUDENT/EMPLOYEE Role ───────────────────────┤
│ ✓ Dashboard (see own metrics)                │
│ ✗ Attendance (denied)                        │
│ ✓ Tasks (view own, mark complete, rate)      │
│ ✗ Analytics (denied)                         │
│ ✗ Admin Panel (denied)                       │
│ ✓ Notifications (own notifications)          │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### Real-Time Data Flow (Dashboard + Notifications)

```
┌─────────────────┐
│  User Component │
│  (Dashboard)    │
└────────┬────────┘
         │
         ├─ useAuth() → { user.uid }
         │
         └─ useEffect(() => {
              getPerformanceForUser(uid, month)
            })
                    ↓
         ┌──────────────────────────┐
         │  Firestore Query         │
         │  collection('performance')
         │  where('userId', '==', uid)
         └──────────┬───────────────┘
                    ↓
         ┌──────────────────────────┐
         │  Security Rules Check    │
         │  User role == 'admin' OR │
         │  userId == user.uid      │
         └──────────┬───────────────┘
                    ↓
         ┌──────────────────────────┐
         │  Firestore Returns Doc   │
         │  { attendance, tasks,    │
         │    rating, flags }       │
         └──────────┬───────────────┘
                    ↓
         ┌──────────────────────────┐
         │  setPerformance(data)    │
         │  Component Re-Renders    │
         └──────────────────────────┘
```

### Real-Time Notifications Flow

```
┌──────────────────────┐
│ NotificationCenter   │
│ (Header Bell)        │
└─────────┬────────────┘
          │
          ├─ useAuth() → { user.uid }
          │
          └─ useEffect(() => {
               subscribeToUserNotifications(uid, callback)
             })
                     ↓
          ┌──────────────────────────┐
          │  onSnapshot listener     │
          │  Real-Time Subscription  │
          │  (Auto-updates on changes)
          └─────────┬────────────────┘
                    ↓
          ┌──────────────────────────┐
          │  Admin creates or        │
          │  updates notification    │
          │  in Firestore           │
          └─────────┬────────────────┘
                    ↓
          ┌──────────────────────────┐
          │  Security Rules Check    │
          │  userId == user.uid      │
          └─────────┬────────────────┘
                    ↓
          ┌──────────────────────────┐
          │  Firestore emits change  │
          │  event immediately       │
          └─────────┬────────────────┘
                    ↓
          ┌──────────────────────────┐
          │  Callback triggered:     │
          │  setNotifications(data)  │
          │  UI updates instantly    │
          │  Bell badge updates      │
          └──────────────────────────┘
```

---

## 🔐 Security Model

```
┌─────────────────────────────────────────────────────────┐
│            Firestore Security Rules                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Rule 1: Users Collection                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ allow read: if                                   │  │
│  │   request.auth.uid == userId OR                  │  │
│  │   getUserRole() == 'admin'                       │  │
│  │                                                   │  │
│  │ allow write: if                                  │  │
│  │   request.auth.uid == userId OR                  │  │
│  │   getUserRole() == 'admin'                       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Rule 2: Attendance Collection                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ allow read: if                                   │  │
│  │   getUserRole() == 'admin' OR                    │  │
│  │   getUserRole() == 'supervisor' OR               │  │
│  │   request.auth.uid == resource.data.userId      │  │
│  │                                                   │  │
│  │ allow write: if                                  │  │
│  │   getUserRole() == 'admin' OR                    │  │
│  │   getUserRole() == 'supervisor'                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Rule 3: Notifications Collection                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ allow read: if                                   │  │
│  │   request.auth.uid == resource.data.userId      │  │
│  │                                                   │  │
│  │ allow write: if                                  │  │
│  │   getUserRole() == 'admin' OR                    │  │
│  │   getUserRole() == 'supervisor'                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Helper Function: getUserRole()                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ return get(/databases/*/documents/              │  │
│  │   users/$(request.auth.uid)                      │  │
│  │ ).data.role                                       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Component Lifecycle Example: Attendance Page

```
User Navigates to /attendance
    ↓
Route Check: ProtectedRoute
    ├─ Is user logged in? YES → Continue
    ├─ Is userRole in ['admin', 'supervisor']? YES → Render
    └─ Otherwise: Redirect to /auth
    ↓
Attendance Component Loads
    ├─ useState(attendanceList)
    ├─ useState(loading)
    └─ useAuth() hook reads { user, userRole }
    ↓
useEffect runs on mount
    ├─ getAttendanceForUser(userId, start, end)
    ├─ setLoading(true)
    └─ Firestore query executes
    ↓
Firestore Security Rules Check
    ├─ Is userId == user.uid? (own data)
    │  OR
    ├─ Is userRole == 'supervisor'? (team data)
    │  OR
    ├─ Is userRole == 'admin'? (all data)
    ↓
Results Return
    ├─ setAttendanceList(docs)
    ├─ setLoading(false)
    └─ Component re-renders
    ↓
User Sees:
    ├─ Table of attendance records
    ├─ Buttons: Present, Absent, Late
    └─ Summary stats (present, absent, late count)
    ↓
User Clicks "Present" Button
    ├─ handleMarkAttendance(userId, 'present')
    ├─ LOCAL: setAttendanceList([...updated])
    ├─ (In production: await markAttendance(...))
    │   └─ Save to Firestore
    │   └─ Other users see real-time update
    └─ UI updates immediately
```

---

## 📱 API Reference Quick Map

```
Authentication (Firebase Auth + AuthContext)
├─ login(email, password) → Promise
├─ signup(email, password, role) → Promise
├─ logout() → Promise
└─ useAuth() → { user, userRole, loading, login, signup, logout }

Attendance (firestoreHelpers.js)
├─ markAttendance(userId, date, status, markedBy, method)
├─ getAttendanceForUser(userId, startDate, endDate)
└─ subscribeToUserAttendance(userId, callback) [Ready to add]

Tasks (firestoreHelpers.js)
├─ createTask(title, desc, assignedTo, assignedBy, dueDate)
├─ updateTaskStatus(taskId, status)
├─ rateTask(taskId, rating, feedback)
├─ getTasksForUser(userId)
└─ subscribeToUserTasks(userId, callback) ✅

Performance (firestoreHelpers.js)
├─ updatePerformanceMetrics(userId, month, metrics)
├─ getPerformanceForUser(userId, month)
└─ subscribeToPerformance(userId, month, callback) [Ready to add]

Notifications (firestoreHelpers.js)
├─ createNotification(userId, type, title, message, actionUrl)
├─ subscribeToUserNotifications(userId, callback) ✅
└─ markNotificationRead(notificationId)

PDF Export (pdfExport.js)
├─ exportToPDF(element, filename)
├─ generateAttendanceReport(data, userName, month)
└─ generatePerformanceReport(data, userName, month)

Route Protection (ProtectedRoute.jsx)
└─ <ProtectedRoute allowedRoles={['admin']}>
     <Component />
   </ProtectedRoute>
```

---

## 🎯 Summary

The SAPT application follows a **clean, modular architecture** with:
- ✅ Clear separation of concerns (components, utilities, context, helpers)
- ✅ Role-based access control at both React and Firestore levels
- ✅ Real-time data synchronization via Firestore onSnapshot
- ✅ Protected routes for sensitive pages
- ✅ Helper functions for all CRUD operations
- ✅ PDF export capabilities
- ✅ Production-ready error handling

**All systems are in place to add more features quickly!** 🚀
