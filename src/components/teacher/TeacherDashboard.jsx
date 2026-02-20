import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp,
  Plus,
  Calendar,
  Clock,
  Award,
  MessageSquare
} from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import PagePreloader from '../common/PagePreloader'
import { getCurrentUser, getTeacherStats, getTeacherCourses, getAllStudents } from '../../lib/supabase'

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    pendingSubmissions: 0,
    totalRevenue: 0
  })
  const [recentCourses, setRecentCourses] = useState([])
  const [onlineStudents, setOnlineStudents] = useState([])

  useEffect(() => {
    loadDashboard()
    // Refresh online students every 30 seconds
    const interval = setInterval(loadOnlineStudents, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboard = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        // Load stats
        const { data: statsData } = await getTeacherStats(currentUser.id)
        if (statsData) setStats(statsData)

        // Load recent courses
        const { data: coursesData } = await getTeacherCourses(currentUser.id)
        if (coursesData) setRecentCourses(coursesData.slice(0, 3))
        
        // Load online students
        await loadOnlineStudents()
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const loadOnlineStudents = async () => {
    try {
      const { data: students } = await getAllStudents()
      if (students && students.length > 0) {
        // Show real students from database
        const formattedStudents = students.map(student => ({
          id: student.id,
          name: student.full_name || student.email?.split('@')[0] || 'Student',
          email: student.email,
          avatar: student.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name || 'Student')}&background=3b82f6&color=fff`,
          status: 'online', // In real app, check last_seen timestamp
          role: student.role || 'student'
        }))
        setOnlineStudents(formattedStudents)
      }
    } catch (error) {
      console.error('Error loading students:', error)
    }
  }

  if (loading) return <PagePreloader />

  const statCards = [
    {
      icon: Users,
      label: 'Total Students',
      value: stats.totalStudents,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: stats.activeCourses,
      color: 'from-success-500 to-success-600',
      bgColor: 'bg-success-50',
      textColor: 'text-success-600'
    },
    {
      icon: FileText,
      label: 'Pending Submissions',
      value: stats.pendingSubmissions,
      color: 'from-warning-500 to-warning-600',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-600'
    },
    {
      icon: TrendingUp,
      label: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600'
    }
  ]

  const quickActions = [
    {
      icon: Plus,
      label: 'Create Course',
      path: '/teacher/course/create',
      color: 'bg-gradient-to-br from-success-500 to-success-600'
    },
    {
      icon: Calendar,
      label: 'Schedule Class',
      path: '/teacher/live-classes',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    {
      icon: FileText,
      label: 'Create Assignment',
      path: '/teacher/assignments',
      color: 'bg-gradient-to-br from-warning-500 to-warning-600'
    },
    {
      icon: Award,
      label: 'Create Test',
      path: '/teacher/tests',
      color: 'bg-gradient-to-br from-primary-500 to-primary-600'
    }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-6 md:mb-8 animate-slide-in-up">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.user_metadata?.full_name || 'Teacher'}! 👋
            </h1>
            <p className="text-sm md:text-base text-gray-600">Here's what's happening with your courses today</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="card hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={index}
                    to={action.path}
                    className={`${action.color} text-white p-4 md:p-6 rounded-xl hover-lift animate-scale-in flex flex-col md:flex-row items-center gap-2 md:gap-4 shadow-lg text-center md:text-left`}
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <Icon className="w-6 h-6 md:w-8 md:h-8" />
                    <span className="font-semibold text-sm md:text-base">{action.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Courses</h2>
              <Link to="/teacher/courses" className="text-success-600 hover:text-success-700 font-medium">
                View All →
              </Link>
            </div>
            
            {recentCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="card hover-lift animate-scale-in"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-success-400 to-success-600 rounded-lg mb-4 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {course.enrollments?.[0]?.count || 0} students
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.published 
                          ? 'bg-success-100 text-success-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {course.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No courses yet</p>
                <Link to="/teacher/course/create" className="btn-primary inline-flex items-center gap-2">
                  <Plus size={20} />
                  Create Your First Course
                </Link>
              </div>
            )}
          </div>

          {/* Online Students */}
          <div>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Students Logged In</h2>
              <Link to="/teacher/students" className="text-primary-600 hover:text-primary-700 font-medium">
                View All →
              </Link>
            </div>
            
            {onlineStudents.length > 0 ? (
              <div className="card">
                <div className="space-y-3">
                  {onlineStudents.slice(0, 5).map((student, index) => (
                    <div key={student.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors animate-slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="relative">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <Link
                        to="/teacher/messages"
                        className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                        title="Send message"
                      >
                        <MessageSquare size={20} />
                      </Link>
                    </div>
                  ))}
                </div>
                {onlineStudents.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link to="/teacher/students" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                      View {onlineStudents.length - 5} more students →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No students online</p>
                <p className="text-sm text-gray-500">Students will appear here when they log in</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
