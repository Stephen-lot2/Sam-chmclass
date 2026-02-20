import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Auth Components
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import TeacherSignup from './components/auth/TeacherSignup'
import Onboarding from './components/auth/Onboarding'
import LoginWithOTP from './components/auth/LoginWithOTP'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Teacher Components
import TeacherDashboard from './components/teacher/TeacherDashboard'
import TeacherCourses from './components/teacher/TeacherCourses'
import CourseCreator from './components/teacher/CourseCreator'
import StudentManager from './components/teacher/StudentManager'
import Messages from './components/teacher/Messages'
import TeacherLiveClasses from './components/teacher/TeacherLiveClasses'
import Assignments from './components/teacher/Assignments'
import TeacherTests from './components/teacher/TeacherTests'
import Announcements from './components/teacher/Announcements'
import Analytics from './components/teacher/Analytics'
import TeacherSettings from './components/teacher/TeacherSettings'
import TeacherProfile from './components/teacher/TeacherProfile'

// Mobile Components
import MobileDashboard from './components/mobile/MobileDashboard'
import MobileCourses from './components/mobile/MobileCourses'
import MobileLiveClasses from './components/mobile/MobileLiveClasses'
import MobileTests from './components/mobile/MobileTests'
import MobileProfile from './components/mobile/MobileProfile'

// Web Components
import WebDashboard from './components/web/WebDashboard'
import CourseCatalog from './components/web/CourseCatalog'
import CourseDetail from './components/web/CourseDetail'
import LiveClassRoom from './components/web/LiveClassRoom'
import LiveClasses from './components/web/LiveClasses'
import ExamInterface from './components/web/ExamInterface'
import Tests from './components/web/Tests'
import Orders from './components/web/Orders'
import WebProfile from './components/web/WebProfile'
import Notifications from './components/web/Notifications'

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/login-otp" element={<LoginWithOTP />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/teacher-signup" element={<TeacherSignup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Teacher Portal Routes - Protected */}
        <Route 
          path="/teacher/dashboard" 
          element={
            <ProtectedRoute requireRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/courses" 
          element={
            <ProtectedRoute requireRole="teacher">
              <TeacherCourses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/course/create" 
          element={
            <ProtectedRoute requireRole="teacher">
              <CourseCreator />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/students" 
          element={
            <ProtectedRoute requireRole="teacher">
              <StudentManager />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/messages" 
          element={
            <ProtectedRoute requireRole="teacher">
              <Messages />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/live-classes" 
          element={
            <ProtectedRoute requireRole="teacher">
              <TeacherLiveClasses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/assignments" 
          element={
            <ProtectedRoute requireRole="teacher">
              <Assignments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/tests" 
          element={
            <ProtectedRoute requireRole="teacher">
              <TeacherTests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/announcements" 
          element={
            <ProtectedRoute requireRole="teacher">
              <Announcements />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/analytics" 
          element={
            <ProtectedRoute requireRole="teacher">
              <Analytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/settings" 
          element={
            <ProtectedRoute requireRole="teacher">
              <TeacherSettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/profile" 
          element={
            <ProtectedRoute requireRole="teacher">
              <TeacherProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Student Routes - Protected */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute requireRole="student">
              {isMobile ? <MobileDashboard /> : <WebDashboard />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/courses" 
          element={
            <ProtectedRoute requireRole="student">
              {isMobile ? <MobileCourses /> : <CourseCatalog />}
            </ProtectedRoute>
          } 
        />
        
        {/* Shared Routes - Both can access */}
        <Route 
          path="/live-class/:id" 
          element={
            <ProtectedRoute>
              <LiveClassRoom />
            </ProtectedRoute>
          } 
        />
        
        {/* Mobile Only Routes - Student */}
        <Route 
          path="/mobile/live-classes" 
          element={
            <ProtectedRoute requireRole="student">
              <MobileLiveClasses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mobile/tests" 
          element={
            <ProtectedRoute requireRole="student">
              <MobileTests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mobile/profile" 
          element={
            <ProtectedRoute requireRole="student">
              <MobileProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Web Only Routes - Student */}
        <Route 
          path="/course/:id" 
          element={
            <ProtectedRoute requireRole="student">
              <CourseDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/live-classes" 
          element={
            <ProtectedRoute requireRole="student">
              <LiveClasses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tests" 
          element={
            <ProtectedRoute requireRole="student">
              <Tests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/exam/:id" 
          element={
            <ProtectedRoute requireRole="student">
              <ExamInterface />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute requireRole="student">
              <Orders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requireRole="student">
              <WebProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute requireRole="student">
              <Notifications />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect based on role */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
