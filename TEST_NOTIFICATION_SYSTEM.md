# 🧪 Test Notification System - Quick Guide

## 🎯 How to Test the Notification System

Follow these steps to test the complete notification flow:

---

## 📋 PREREQUISITES

1. **Database Setup:**
   - Run `supabase/complete-setup.sql` in your Supabase SQL Editor
   - Verify `notifications` table exists
   - Verify `courses`, `enrollments`, `assignments`, `tests`, `live_classes` tables exist

2. **User Accounts:**
   - Create a teacher account (use `/teacher-signup`)
   - Create a student account (use `/signup`)
   - Enroll student in a course (manually in database or through UI)

---

## 🧑‍🏫 TEACHER SIDE - Create Content

### Test 1: Create Assignment

1. **Login as Teacher:**
   - Go to `/login`
   - Select "Teacher" role
   - Login with teacher credentials

2. **Navigate to Assignments:**
   - Click "Assignments" in sidebar
   - Click "Create Assignment" button

3. **Fill Form:**
   - Title: "Chemical Bonding Assignment"
   - Description: "Complete exercises 1-10 from chapter 5"
   - Due Date: Select a future date
   - Max Score: 100

4. **Submit:**
   - Click "Create & Notify Students"
   - Should see: "Assignment created successfully! Students have been notified."

5. **Verify:**
   - Assignment appears in list
   - Check browser console for any errors

---

### Test 2: Create Test

1. **Navigate to Tests:**
   - Click "Tests & Exams" in sidebar
   - Click "Create Test" button

2. **Fill Form:**
   - Title: "Midterm Exam - Organic Chemistry"
   - Description: "Covers chapters 1-5"
   - Test Date: Select a future date
   - Duration: 120 minutes
   - Questions: 50

3. **Submit:**
   - Click "Create & Notify Students"
   - Should see: "Test created successfully! Students have been notified."

4. **Verify:**
   - Test appears in list
   - Check browser console for any errors

---

### Test 3: Schedule Live Class

1. **Navigate to Live Classes:**
   - Click "Live Classes" in sidebar
   - Click "Schedule New Class" button

2. **Fill Form:**
   - Title: "Organic Chemistry Basics"
   - Description: "Introduction to organic compounds"
   - Platform: Select "Daily.co" or "Google Meet"
   - Date: Select a future date
   - Time: Select a time
   - Duration: 60 minutes
   - Max Participants: 50

3. **Submit:**
   - Click "Schedule Class"
   - Should see: "Class scheduled successfully! Students have been notified."

4. **Verify:**
   - Class appears in upcoming list
   - Check browser console for any errors

---

## 👨‍🎓 STUDENT SIDE - Receive Notifications

### Test 4: View Notifications (Desktop)

1. **Login as Student:**
   - Go to `/login`
   - Select "Student" role
   - Login with student credentials

2. **Check Notification Bell:**
   - Look at top of sidebar (near logo)
   - Should see bell icon with red badge showing "3" (or number of notifications)
   - Badge should pulse/animate

3. **Click Bell Icon:**
   - Dropdown should appear
   - Should see 3 notifications:
     - 📝 "New Assignment: Chemical Bonding Assignment"
     - 📋 "New Test Available: Midterm Exam - Organic Chemistry"
     - 🎥 "New Live Class Scheduled: Organic Chemistry Basics"

4. **Click a Notification:**
   - Should navigate to related page
   - Notification should be marked as read
   - Blue dot should disappear
   - Badge count should decrease

5. **Mark All as Read:**
   - Click "Mark all read" button
   - All notifications should be marked as read
   - Badge should disappear

---

### Test 5: View Notifications (Mobile)

1. **Resize Browser:**
   - Make browser window narrow (< 768px)
   - Or use mobile device

2. **Check Notification Bell:**
   - Look at top-right corner (fixed position)
   - Should see bell icon with red badge

3. **Click Bell Icon:**
   - Dropdown should appear
   - Should see all notifications
   - Touch-friendly interface

4. **Test Navigation:**
   - Click a notification
   - Should navigate to related page
   - Notification marked as read

---

### Test 6: Notifications Page

1. **Navigate to Notifications:**
   - Click bell icon dropdown
   - Click "View all notifications" at bottom
   - OR navigate to `/notifications` directly

2. **Check Page:**
   - Should see gradient header with stats
   - Should see "Unread: X" and "Total: X"
   - Should see filter tabs: All, Unread, Read

3. **Test Filters:**
   - Click "Unread" - should show only unread
   - Click "Read" - should show only read
   - Click "All" - should show all

4. **Test Mark All as Read:**
   - Click "Mark All as Read" button
   - All notifications should be marked as read
   - Unread count should become 0

5. **Test Navigation:**
   - Click any notification card
   - Should navigate to related content

---

## 🔄 TEST AUTO-REFRESH

### Test 7: Real-Time Updates

1. **Open Two Browser Windows:**
   - Window 1: Teacher logged in
   - Window 2: Student logged in

2. **Create Content as Teacher:**
   - In Window 1, create a new assignment

3. **Wait 30 Seconds:**
   - In Window 2, wait for auto-refresh
   - Notification bell badge should update automatically
   - New notification should appear in dropdown

4. **Manual Refresh:**
   - Click bell icon to manually refresh
   - Should see new notification immediately

---

## 🐛 TROUBLESHOOTING

### No Notifications Appearing:

1. **Check Database:**
   - Open Supabase dashboard
   - Go to Table Editor
   - Check `notifications` table
   - Verify notifications were created

2. **Check Enrollments:**
   - Verify student is enrolled in course
   - Check `enrollments` table
   - Ensure `status = 'active'`

3. **Check Console:**
   - Open browser console (F12)
   - Look for errors
   - Check network tab for failed requests

4. **Check Authentication:**
   - Verify user is logged in
   - Check `getCurrentUser()` returns user
   - Verify user has correct role

### Notifications Not Marking as Read:

1. **Check Database:**
   - Verify `read` column updates
   - Check RLS policies allow updates

2. **Check Console:**
   - Look for errors in `markNotificationAsRead()`
   - Verify notification ID is correct

### Badge Not Updating:

1. **Check Auto-Refresh:**
   - Verify 30-second interval is running
   - Check `useEffect` cleanup

2. **Manual Refresh:**
   - Click bell icon to force refresh
   - Should update immediately

---

## ✅ SUCCESS CRITERIA

The notification system is working correctly if:

- [x] Teacher can create assignments/tests/classes
- [x] Students receive notifications automatically
- [x] Notification bell shows unread count
- [x] Clicking notification navigates to content
- [x] Notifications mark as read when clicked
- [x] Mark all as read works
- [x] Filters work on notifications page
- [x] Auto-refresh updates every 30 seconds
- [x] Mobile view works correctly
- [x] No console errors

---

## 📊 EXPECTED RESULTS

### After Creating 3 Items (Assignment, Test, Class):

**Teacher Side:**
- 3 items created successfully
- Success messages displayed
- Items appear in respective lists

**Student Side:**
- Bell badge shows "3"
- Dropdown shows 3 notifications
- Each notification has correct icon and message
- Clicking notification navigates correctly
- Notification marked as read after click
- Badge count decreases

**Database:**
- 3 rows in `notifications` table
- `user_id` matches student ID
- `type` is correct (assignment/test/live_class)
- `read` is FALSE initially
- `link` points to correct page

---

## 🎉 DEMO SCRIPT

### Quick Demo (5 minutes):

1. **Show Teacher Creating Assignment** (1 min)
   - Login as teacher
   - Create assignment
   - Show success message

2. **Show Student Receiving Notification** (2 min)
   - Login as student
   - Show bell badge
   - Open dropdown
   - Click notification
   - Show navigation

3. **Show Notifications Page** (2 min)
   - Navigate to /notifications
   - Show filters
   - Mark all as read
   - Show empty state

---

## 📝 TEST CHECKLIST

Use this checklist to verify all features:

### Teacher Features:
- [ ] Create assignment with notification
- [ ] Create test with notification
- [ ] Schedule live class with notification
- [ ] See success messages
- [ ] No console errors

### Student Features:
- [ ] See notification bell badge
- [ ] Open notification dropdown
- [ ] See all notifications
- [ ] Click notification to navigate
- [ ] Notification marked as read
- [ ] Badge count updates
- [ ] Mark all as read works
- [ ] View notifications page
- [ ] Filter notifications
- [ ] Mobile view works

### Database:
- [ ] Notifications created in database
- [ ] Correct user_id
- [ ] Correct type
- [ ] Correct link
- [ ] Read status updates

### Auto-Refresh:
- [ ] Notifications update every 30 seconds
- [ ] Manual refresh works
- [ ] No memory leaks

---

## 🚀 READY TO TEST!

Follow the steps above to test the complete notification system. If everything works as expected, the system is ready for production use!

**Happy Testing! 🎉**
