import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Auth Components
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Onboarding from './components/auth/Onboarding'

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
import ExamInterface from './components/web/ExamInterface'
import Orders from './components/web/Orders'

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
        {/* Auth Routes - Always accessible */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Main Routes - Responsive */}
        <Route path="/" element={isMobile ? <MobileDashboard /> : <WebDashboard />} />
        <Route path="/courses" element={isMobile ? <MobileCourses /> : <CourseCatalog />} />
        
        {/* Mobile Only Routes */}
        <Route path="/live-classes" element={<MobileLiveClasses />} />
        <Route path="/tests" element={<MobileTests />} />
        <Route path="/profile" element={<MobileProfile />} />
        
        {/* Web Only Routes */}
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/live-class/:id" element={<LiveClassRoom />} />
        <Route path="/exam/:id" element={<ExamInterface />} />
        <Route path="/orders" element={<Orders />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
