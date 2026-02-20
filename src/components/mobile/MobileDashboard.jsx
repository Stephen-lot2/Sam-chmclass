import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Award, Bell, Search, TrendingUp, Calendar, Clock, Video, User, Mail, Zap, Target, Star, Play } from 'lucide-react'
import MobileNav from './MobileNav'
import { useAuth } from '../../context/AuthContext'
import PagePreloader from '../common/PagePreloader'

const MobileDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(7)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    <PagePreloader loading={loading}>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 pt-12 pb-8 rounded-b-3xl relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6 animate-slide-in-right">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-primary-600 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-white text-xl font-bold">
                    Hello, {user?.user_metadata?.full_name?.split(' ')[0] || 'Student'}! 👋
                  </h1>
                  <p className="text-primary-100 text-sm">Ready to learn chemistry today?</p>
                </div>
              </div>
              <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
                <Bell className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Search */}
            <div className="relative animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, topics..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white shadow-lg focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="px-6 -mt-6">
          {/* User Info Card */}
          {user && (
            <div className="card mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  👤 Your Account
                  <span className="text-yellow-500 animate-bounce-in">⭐</span>
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
                      <p className="text-lg font-bold text-gray-900">{streak}</p>
                    </div>
                    <p className="text-xs text-gray-600">Streak</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-600" />
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-900">{user.user_metadata?.full_name || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary-600" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900 text-xs truncate">{user.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { icon: BookOpen, label: 'Courses', value: '8', color: 'primary', gradient: 'from-primary-500 to-primary-600', delay: '0.3s' },
              { icon: Award, label: 'Completed', value: '24', color: 'success', gradient: 'from-success-500 to-success-600', delay: '0.4s' },
              { icon: Video, label: 'Live Classes', value: '12', color: 'secondary', gradient: 'from-secondary-500 to-secondary-600', delay: '0.5s' },
              { icon: Target, label: 'Tests', value: '3', color: 'orange', gradient: 'from-orange-500 to-orange-600', delay: '0.6s' }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`card bg-gradient-to-br ${stat.gradient} text-white hover-lift animate-slide-in-up`}
                style={{ animationDelay: stat.delay }}
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="w-8 h-8" />
                  {index === 0 && <TrendingUp className="w-5 h-5 animate-pulse" />}
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress Card */}
          <div className="card bg-gradient-to-br from-pastel-green to-success-50 mb-6 hover-lift animate-slide-in-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Weekly Progress</p>
                <h3 className="text-3xl font-bold text-gray-900">12.5 hrs</h3>
                <div className="flex items-center gap-2 text-sm text-success-700 mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">+15% from last week</span>
                </div>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                  <circle cx="40" cy="40" r="32" stroke="#22c55e" strokeWidth="6" fill="none"
                    strokeDasharray="201" strokeDashoffset="50" strokeLinecap="round" 
                    className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-success-600">75%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Learning */}
          <div className="mb-6 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary-600" />
              Continue Learning
            </h3>
            <div 
              className="card hover-lift cursor-pointer"
              onClick={() => navigate('/course/1')}
            >
              <div className="flex gap-4 mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                    <span className="text-3xl">⚗️</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce-in">
                    65%
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">Organic Chemistry</h4>
                  <p className="text-sm text-gray-600 mb-2">Chapter 5: Alkanes</p>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-primary-600">65%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000" style={{ width: '65%' }}>
                    <div className="h-full bg-white/30 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Continue Lesson
              </button>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="mb-6 animate-slide-in-up" style={{ animationDelay: '0.9s' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary-600" />
              Upcoming Schedule
            </h3>
            <div className="space-y-3">
              {[
                { type: 'LIVE CLASS', title: 'Organic Chemistry', time: 'Today, 2:00 PM', color: 'secondary', icon: Video },
                { type: 'TEST', title: 'Chemical Bonding', time: 'Feb 22, 10:00 AM', color: 'orange', icon: Award },
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`card bg-${item.color}-50 hover-lift cursor-pointer animate-slide-in-right`}
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                  onClick={() => navigate(item.type === 'LIVE CLASS' ? '/live-classes' : '/tests')}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                    <span className={`text-xs font-bold text-${item.color}-600`}>{item.type}</span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="animate-slide-in-up" style={{ animationDelay: '1.1s' }}>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="card space-y-3">
              {[
                { title: 'Course Master', desc: 'Completed 5 courses', icon: '🏆' },
                { title: 'Perfect Score', desc: '100% on last test', icon: '⭐' },
                { title: 'Week Warrior', desc: '7 day streak', icon: '🔥' },
              ].map((achievement, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all animate-bounce-in"
                  style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center text-2xl">
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{achievement.title}</p>
                    <p className="text-xs text-gray-600">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <MobileNav active="home" />
      </div>
    </PagePreloader>
  )
}

export default MobileDashboard
