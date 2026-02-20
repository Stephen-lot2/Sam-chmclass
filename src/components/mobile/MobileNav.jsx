import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Video, FileText, User, Bell } from 'lucide-react'
import NotificationBell from '../common/NotificationBell'

const MobileNav = ({ active }) => {
  const location = useLocation()
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'courses', icon: BookOpen, label: 'Courses', path: '/courses' },
    { id: 'live', icon: Video, label: 'Live', path: '/live-classes' },
    { id: 'tests', icon: FileText, label: 'Tests', path: '/tests' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ]

  return (
    <>
      {/* Notification Bell - Top Right */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <NotificationBell />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom shadow-lg z-50">
        <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map(({ id, icon: Icon, label, path }, index) => {
          const isActive = active === id || location.pathname === path
          return (
            <Link
              key={id}
              to={path}
              className={`flex flex-col items-center gap-1 transition-all hover:scale-110 animate-slide-in-up ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg scale-110' 
                  : 'hover:bg-gray-100'
              }`}>
                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                {label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-primary-600 rounded-full animate-pulse"></div>
              )}
            </Link>
          )
        })}
        </div>
      </div>
    </>
  )
}

export default MobileNav
