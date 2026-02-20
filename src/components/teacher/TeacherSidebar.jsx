import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  Video, 
  ClipboardList, 
  Megaphone, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Menu,
  X
} from 'lucide-react'
import { getCurrentUser, signOut, getAvatarUrl } from '../../lib/supabase'

const TeacherSidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', color: 'text-blue-300' },
    { icon: BookOpen, label: 'My Courses', path: '/teacher/courses', color: 'text-purple-300' },
    { icon: FileText, label: 'Assignments', path: '/teacher/assignments', color: 'text-yellow-300' },
    { icon: Users, label: 'Students', path: '/teacher/students', color: 'text-pink-300' },
    { icon: MessageSquare, label: 'Messages', path: '/teacher/messages', color: 'text-cyan-300' },
    { icon: Video, label: 'Live Classes', path: '/teacher/live-classes', color: 'text-red-300' },
    { icon: ClipboardList, label: 'Tests & Exams', path: '/teacher/tests', color: 'text-orange-300' },
    { icon: Megaphone, label: 'Announcements', path: '/teacher/announcements', color: 'text-green-300' },
    { icon: BarChart3, label: 'Analytics', path: '/teacher/analytics', color: 'text-indigo-300' },
    { icon: Settings, label: 'Settings', path: '/teacher/settings', color: 'text-gray-300' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-3 bg-success-600 text-white rounded-xl shadow-lg hover:bg-success-700 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      } flex flex-col shadow-lg ${
        mobileMenuOpen ? 'fixed left-0 top-0 z-50' : 'hidden md:flex'
      }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-success-500 to-success-600">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="animate-slide-in-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">👨‍🏫</span>
                <h1 className="text-xl font-bold text-white">Teacher Portal</h1>
              </div>
              <p className="text-success-100 text-sm">Manage & Inspire</p>
            </div>
          )}
          {collapsed && <span className="text-3xl">👨‍🏫</span>}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <Link
          to="/teacher/profile"
          className={`p-4 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:bg-gray-100 transition-colors ${collapsed ? 'px-2' : ''}`}
        >
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="relative">
              <img
                src={getAvatarUrl(user.id) || `https://ui-avatars.com/api/?name=${user.user_metadata?.full_name || 'Teacher'}&background=10b981&color=fff`}
                alt="Profile"
                className="w-12 h-12 rounded-full border-3 border-success-400 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{user.user_metadata?.full_name || 'Teacher'}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-success-100 text-success-700 text-xs font-medium rounded-full">
                  Instructor
                </span>
              </div>
            )}
          </div>
        </Link>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-xl transition-all group ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : item.color} />
              {!collapsed && (
                <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-white p-2 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-500">Students</p>
              <p className="text-lg font-bold text-gray-900">0</p>
            </div>
            <div className="bg-white p-2 rounded-lg border border-gray-200 text-center">
              <p className="text-xs text-gray-500">Courses</p>
              <p className="text-lg font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
      </div>
    </>
  )
}

export default TeacherSidebar
