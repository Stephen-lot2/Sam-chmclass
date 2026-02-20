import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, Video, FileText, ShoppingCart, User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { signOut } from '../../lib/supabase'
import NotificationBell from '../common/NotificationBell'

const WebSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Courses', path: '/courses' },
    { icon: Video, label: 'Live Classes', path: '/live-classes' },
    { icon: FileText, label: 'Tests & Exams', path: '/tests' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  ]

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    navigate('/login')
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">🧪</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Samuel ChemLab</h1>
              <p className="text-xs text-gray-600">Chemistry Learning</p>
            </div>
          </Link>
        </div>
        <NotificationBell />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:scale-105'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <Link 
          to="/profile-web"
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all hover:scale-105 mb-2"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 text-sm truncate">
              {user?.user_metadata?.full_name || user?.email || 'Student'}
            </p>
            <p className="text-xs text-gray-600">View Profile</p>
          </div>
          <Settings className="w-5 h-5 text-gray-400" />
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 cursor-pointer transition-all hover:scale-105"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  )
}

export default WebSidebar
