# SAPT — Smart Attendance & Performance Tracker

A real-time web app for tracking attendance, performance, and tasks. Built with **React**, **Tailwind CSS**, and **Firebase**.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- A Firebase project ([create one free](https://console.firebase.google.com))

### Install & Run

```powershell
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy the example env file and add your Firebase config
cp .env.example .env.local
# Edit .env.local and paste your Firebase credentials

# 3. Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`.

## 📚 Full Setup Guide

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for step-by-step instructions:
- Creating a Firebase project
- Enabling authentication & Firestore
- Setting up security rules
- Deploying to Vercel or Firebase Hosting
- Testing role-based access control

## 🏗️ Project Structure

```
d:\project/
├── src/
│   ├── components/          # React components (Auth, Dashboard, Attendance, Tasks, Analytics)
│   ├── context/             # AuthContext for role-based state
│   ├── firebase/            # Firebase config, helpers, and Firestore schema docs
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind styles
├── index.html
├── vite.config.js
├── tailwind.config.cjs
├── package.json
├── .env.example             # Copy this to .env.local and fill your Firebase values
├── README.md                # This file
├── SETUP_GUIDE.md           # Detailed setup instructions
└── .gitignore
```

## 🔐 Features Implemented

✅ **Authentication & Role-Based Access**
- Email/password signup with role selection (Admin, Supervisor, Student)
- Protected routes by role
- Firebase Authentication integration

✅ **Dashboard**
- Role-specific welcome message
- Summary metrics (attendance, tasks, ratings)

✅ **Attendance Management**
- Mark attendance (Present, Absent, Late)
- Admin/Supervisor-only access
- Attendance summary

✅ **Tasks & Evaluations**
- Create, assign, and track tasks
- Mark completion and rate performance
- Task status management (Pending, In Progress, Completed)

✅ **Analytics**
- Basic performance charts with Recharts
- Role-based access

✅ **Firestore Integration**
- Helper functions for CRUD operations (attendance, tasks, performance, notifications)
- Real-time subscriptions ready
- Documented schema and security rules

## 🔌 Firebase Services Used

- **Authentication**: Email/Password (expandable to OAuth)
- **Firestore**: Real-time data storage with security rules
- **Cloud Functions** (optional): For notifications, scheduled tasks, and automation

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router, Tailwind CSS, Recharts |
| Backend | Firebase (Auth + Firestore) |
| Build | Vite |
| Hosting | Vercel or Firebase Hosting |

## 🎯 Next Steps

1. **Set up Firebase** → Follow [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. **Create test users** → Sign up with different roles
3. **Test access control** → Verify role-based permissions work
4. **Integrate Firestore data** → Replace sample data with real Firestore calls
5. **Deploy** → Push to Vercel or Firebase Hosting

## 🔮 Optional Features to Add

- **Face Recognition**: Auto-mark attendance via camera
- **Email Notifications**: Task assignments, deadline reminders, performance alerts
- **PDF Reports**: Export monthly/weekly summaries
- **Cloud Functions**: Auto-calculate metrics, schedule alerts
- **Mobile App**: React Native version
- **Tests**: Jest + React Testing Library

## 🤝 Contributing

This is a starter scaffold. Feel free to fork, extend, and customize!

## 📄 License

MIT

---

**Questions?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) or refer to the Firebase docs.

Happy building! 🎉
