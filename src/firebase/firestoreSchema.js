// Firestore Role-Based Rules
// Add this to your Firestore Security Rules console:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection: only admins can read all, users can read own
    match /users/{userId} {
      allow read: if request.auth.uid == userId || isAdmin();
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    // Attendance collection
    match /attendance/{docId} {
      allow read: if isAdmin() || isSupervisor() || request.auth.uid == resource.data.userId;
      allow write: if isAdmin() || isSupervisor();
    }
    
    // Tasks collection
    match /tasks/{docId} {
      allow read: if isAdmin() || isSupervisor() || request.auth.uid == resource.data.assignedTo;
      allow write: if isAdmin() || isSupervisor();
    }
    
    // Performance/Analytics collection
    match /performance/{docId} {
      allow read: if isAdmin() || isSupervisor() || request.auth.uid == resource.data.userId;
      allow write: if isAdmin() || isSupervisor();
    }
    
    // Helper functions
    function isAdmin() {
      return getUserRole() == 'admin';
    }
    
    function isSupervisor() {
      return getUserRole() == 'supervisor';
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
  }
}
*/

// Firestore Collections Schema
// Create these collections and documents with the following structure:

/*
Collection: users/{userId}
{
  uid: string (document ID, matches auth UID),
  email: string,
  name: string,
  role: 'admin' | 'supervisor' | 'student' | 'employee',
  createdAt: timestamp,
  department: string (optional),
  phone: string (optional)
}

Collection: attendance/{docId}
{
  userId: string (reference to user),
  date: date,
  status: 'present' | 'absent' | 'late',
  markedAt: timestamp,
  markedBy: string (admin/supervisor UID),
  method: 'manual' | 'face_recognition' (optional),
  notes: string (optional)
}

Collection: tasks/{docId}
{
  title: string,
  description: string,
  assignedTo: string (user UID),
  assignedBy: string (supervisor/admin UID),
  dueDate: timestamp,
  status: 'pending' | 'in_progress' | 'completed' | 'overdue',
  rating: number (0-5, filled after completion),
  feedback: string (optional),
  createdAt: timestamp,
  completedAt: timestamp (optional)
}

Collection: performance/{docId}
{
  userId: string (reference to user),
  month: string (YYYY-MM),
  attendanceRate: number (0-100),
  tasksCompleted: number,
  averageTaskRating: number (0-5),
  flags: array of strings (e.g., ['low_attendance', 'overdue_task']),
  updatedAt: timestamp
}

Collection: notifications/{docId}
{
  userId: string (recipient),
  type: 'task_assigned' | 'task_due' | 'absence' | 'performance_alert' | 'system',
  title: string,
  message: string,
  read: boolean,
  actionUrl: string (optional),
  createdAt: timestamp
}
*/
