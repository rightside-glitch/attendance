# 📋 Pre-Deployment Checklist

Use this checklist before deploying SAPT to production.

## 🔐 Security Checklist

### Firebase Configuration
- [ ] Firebase project created and configured
- [ ] `.env.local` file created (NOT committed to git)
- [ ] All `VITE_FIREBASE_*` variables added from Firebase console
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore Database created in production mode

### Firestore Security Rules
- [ ] Security rules updated from `src/firebase/firestoreSchema.js`
- [ ] Rules restrict data by role (admin, supervisor, student)
- [ ] getUserRole() helper function added
- [ ] Rules published to production (not in test mode)

### API Keys & Secrets
- [ ] API keys not exposed in source code
- [ ] `.env.local` in `.gitignore`
- [ ] `.env.example` has no real values
- [ ] GitHub repo doesn't contain `.env.local`

### Authentication
- [ ] Email/Password provider enabled
- [ ] Password reset flow configured (optional)
- [ ] OAuth providers configured (optional: Google, GitHub)
- [ ] Custom claims or role system documented

---

## ✅ Feature Completeness

### Core Features
- [ ] Login/Signup working with role selection
- [ ] Admin can create, edit, delete users
- [ ] Dashboard shows real performance data
- [ ] Attendance marking works (or connected to helper)
- [ ] Tasks can be created and assigned
- [ ] Task rating system works
- [ ] Notifications appear in real-time
- [ ] PDF export works without errors
- [ ] Role-based access control prevents unauthorized access

### Data Validation
- [ ] All forms validate input before submission
- [ ] Error messages are user-friendly
- [ ] Firestore documents have required fields
- [ ] Timestamps are correctly formatted
- [ ] Enums (status, role) have limited valid values

### Error Handling
- [ ] Try-catch blocks around Firestore operations
- [ ] Loading states show while fetching data
- [ ] Error messages displayed to user
- [ ] No console errors on page load
- [ ] App handles network failures gracefully

---

## 📱 Browser Compatibility

- [ ] Tested on Chrome (latest)
- [ ] Tested on Firefox (latest)
- [ ] Tested on Safari (latest)
- [ ] Tested on Edge (latest)
- [ ] Mobile responsive (tested on mobile devices)
- [ ] Touch events work on mobile
- [ ] Notifications work on mobile

---

## 🎨 UI/UX Polish

### Visual Design
- [ ] Color scheme consistent throughout
- [ ] Tailwind classes applied consistently
- [ ] No broken layouts on different screen sizes
- [ ] Images load correctly
- [ ] Fonts render properly

### Accessibility
- [ ] All buttons have clear labels
- [ ] Form inputs have labels
- [ ] Color contrast is sufficient (WCAG AA)
- [ ] Keyboard navigation works
- [ ] Alt text on images (if any)

### User Experience
- [ ] No unexplained blank screens
- [ ] Loading states are clear
- [ ] Success/error messages are clear
- [ ] Buttons are clickable (not disabled unexpectedly)
- [ ] Forms auto-clear after successful submission

---

## 🧪 Testing

### Unit Tests (if applicable)
- [ ] Authentication tests pass
- [ ] Helper function tests pass
- [ ] Component tests pass

### Integration Tests
- [ ] Signup creates user in Firestore
- [ ] Login retrieves user role from Firestore
- [ ] Admin can create user and it appears for others
- [ ] Notifications appear for target user only
- [ ] Attendance marks save to Firestore
- [ ] Tasks appear for assigned user

### Manual Testing
- [ ] Tested as Admin user
- [ ] Tested as Supervisor user
- [ ] Tested as Student user
- [ ] Tested all navigation links
- [ ] Tested form submissions
- [ ] Tested logout → login flow
- [ ] Tested PDF export
- [ ] Tested on slow network (simulate 3G in DevTools)

### Edge Cases
- [ ] Duplicate email signup prevented
- [ ] Wrong password shows error
- [ ] Session expires and user logged out
- [ ] User data not visible to other users (except authorized roles)
- [ ] Pagination works if many users/records
- [ ] Large PDF exports don't crash browser

---

## 🚀 Performance Checklist

### Build Optimization
- [ ] Production build succeeds: `npm run build`
- [ ] No console errors in production build
- [ ] Bundle size reasonable (check with `npm run build`)
- [ ] Code splitting considered for large bundles
- [ ] CSS is minified
- [ ] JavaScript is minified

### Runtime Performance
- [ ] Page loads in < 3 seconds on 4G
- [ ] No memory leaks (checked with DevTools)
- [ ] Images are optimized
- [ ] API calls are efficient (no N+1 queries)
- [ ] Firestore rules don't cause excessive read charges

### Monitoring Ready
- [ ] Analytics configured (optional: Google Analytics)
- [ ] Error logging configured (optional: Sentry)
- [ ] Performance monitoring ready (optional: Vercel/Firebase analytics)

---

## 📚 Documentation

### For Users
- [ ] User guide written
- [ ] FAQ documented
- [ ] Common issues and solutions documented
- [ ] Contact info for support

### For Developers
- [ ] README.md is up-to-date
- [ ] SETUP_GUIDE.md is accurate
- [ ] Code comments explain complex logic
- [ ] API documentation complete
- [ ] Database schema documented
- [ ] Deployment steps documented

### For Maintainers
- [ ] Release notes prepared
- [ ] Deployment checklist documented
- [ ] Rollback procedure documented
- [ ] Database migration strategy documented
- [ ] Monitoring dashboard set up

---

## 🌐 Deployment Preparation

### Vercel Deployment
- [ ] GitHub repo connected to Vercel
- [ ] Environment variables added in Vercel dashboard:
  - [ ] VITE_FIREBASE_API_KEY
  - [ ] VITE_FIREBASE_AUTH_DOMAIN
  - [ ] VITE_FIREBASE_PROJECT_ID
  - [ ] VITE_FIREBASE_STORAGE_BUCKET
  - [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
  - [ ] VITE_FIREBASE_APP_ID
- [ ] Build settings correct (default should work)
- [ ] Preview deployment successful
- [ ] Staging environment test passed

### Firebase Hosting Deployment
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Firebase project linked: `firebase init`
- [ ] Build command configured: `npm run build`
- [ ] Public directory set to `dist`
- [ ] `firebase.json` configured correctly
- [ ] Test deployment successful: `firebase deploy`

### Custom Domain (Optional)
- [ ] Domain purchased or transferred
- [ ] DNS records updated
- [ ] SSL certificate configured
- [ ] Domain pointing to deployment platform

---

## ✨ Final Pre-Launch Checklist

### 24 Hours Before Launch
- [ ] Final code review completed
- [ ] All TODOs addressed or documented
- [ ] Final testing done
- [ ] Backup of Firestore data
- [ ] Documentation final check

### Day of Launch
- [ ] Deploy to staging/preview first
- [ ] Test staging environment fully
- [ ] Get stakeholder sign-off
- [ ] Deploy to production
- [ ] Verify production is working
- [ ] Monitor for errors in first hour

### Post-Launch
- [ ] Monitor error logs
- [ ] Check Firestore usage
- [ ] Verify notifications working
- [ ] Gather user feedback
- [ ] Plan follow-up features

---

## 🎯 Post-Deployment Monitoring

### First Week
- [ ] Check daily for critical errors
- [ ] Monitor Firestore costs
- [ ] Verify email notifications (if implemented)
- [ ] Monitor user signup/login rates
- [ ] Gather initial user feedback

### Ongoing
- [ ] Weekly performance review
- [ ] Monthly security audit
- [ ] Quarterly feature additions
- [ ] Continuous user feedback collection
- [ ] Plan next iteration

---

## 📞 Support Contacts

**Firebase Console**: [console.firebase.google.com](https://console.firebase.google.com)
**Vercel Dashboard**: [vercel.com](https://vercel.com)
**GitHub**: [github.com/](https://github.com/)

---

## 🔄 Rollback Procedure (if needed)

```bash
# Revert to previous Git commit
git revert <commit-hash>
git push origin main

# Or restore from backup
# 1. Download Firestore backup from Firebase console
# 2. Restore to a test database
# 3. Verify data integrity
# 4. Promote to production
```

---

## 💾 Backup Strategy

**Firestore Backups**:
- [ ] Enable automated daily backups in Firebase console
- [ ] Test restore process
- [ ] Store backup copies in multiple regions
- [ ] Document retention policy

**Code Backups**:
- [ ] GitHub provides automatic backup
- [ ] Commit all changes before deployment
- [ ] Tag releases: `git tag v1.0.0`

---

## 🎉 Launch Success Criteria

✅ All users can sign up and login
✅ All role-based access controls work
✅ Firestore data persists correctly
✅ Notifications appear in real-time
✅ PDF exports generate without error
✅ No critical errors in logs
✅ Page load time < 3 seconds
✅ Mobile experience works well

---

**Questions before launch?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) or reach out to the team.

**Ready to launch!** 🚀
