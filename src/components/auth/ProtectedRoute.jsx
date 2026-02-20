import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../../lib/supabase'
import PagePreloader from '../common/PagePreloader'

const ProtectedRoute = ({ children, requireRole = null }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PagePreloader />
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check role if required
  if (requireRole) {
    const userRole = user.user_metadata?.role || 'student'
    
    if (requireRole === 'teacher' && userRole !== 'teacher') {
      // Teacher route but user is student - redirect to student dashboard
      return <Navigate to="/" replace />
    }
    
    if (requireRole === 'student' && userRole === 'teacher') {
      // Student route but user is teacher - redirect to teacher dashboard
      return <Navigate to="/teacher/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute
