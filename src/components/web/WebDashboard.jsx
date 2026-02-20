import { useState, useEffect } from 'react'
import WebSidebar from './WebSidebar'
import WebHeader from './WebHeader'
import { BookOpen, Video, FileText, Award, TrendingUp, Calendar, Clock, Play, User, Mail, Zap, Target, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import PagePreloader from '../common/PagePreloader'

const WebDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState(7)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  return (
    <PagePreloader loading={loading}>
      <div className="flex">
        <WebSidebar />
        
        <div className="flex-1 ml-64">
          <WebHeader title="Dashboard" />
          
          <div className="p-8">
            {/* User Info Card with Animation */}
            {user && (
              <div className="card mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 hover-lift animate-slide-in-up">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center animate-pulse-glow">
                        {user.user_metadata?.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {user.user_metadata?.full_name || 'Student'}
                        <span className="text-yellow-500 animate-bounce-in">⭐</span>
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-5 h-5 text-orange-500 animate-pulse" />
                        <p className="text-2xl font-bold text-gray-900">{streak}</p>
                      </div>
                      <p className="text-xs text-gray-600">Day Streak</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-5 h-5 text-green-500" />
                        <p className="text-2xl font-bold text-gray-900">85%</p>
                      </div>
                      <p className="text-xs text-gray-600">Completion</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Welcome Banner with Particles */}
            <div className="card bg-gradient-to-r from-primary-500 to-secondary-500 mb-8 relative overflow-hidden hover-lift animate-slide-in-right">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h2 className="text-white text-3xl font-bold mb-2 flex items-center gap-3">
                    Welcome back, {user?.user_metadata?.full_name || user?.email || 'Student'}! 
                    <span className="animate-bounce-in">👋</span>
                  </h2>
                  <p className="text-primary-100 text-lg mb-4">You've completed 3 lessons this week. Keep it up!</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                      <span className="text-white font-semibold">Level 12</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <Award className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold">1,250 XP</span>
                    </div>
                  </div>
                </div>
                <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float">
                  <span className="text-6xl">🧪</span>
                </div>
              </div>
            </div>

            {/* Stats Grid with Staggered Animation */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              {[
                { icon: BookOpen, label: 'Active Courses', value: '8', color: 'primary', gradient: 'from-pastel-blue to-primary-50', delay: '0s' },
                { icon: Award, label: 'Completed', value: '24', color: 'success', gradient: 'from-pastel-green to-success-50', delay: '0.1s' },
                { icon: Video, label: 'Live Classes', value: '12', color: 'secondary', gradient: 'from-pastel-purple to-secondary-50', delay: '0.2s' },
                { icon: FileText, label: 'Pending Tests', value: '3', color: 'pink', gradient: 'from-pastel-pink to-pink-50', delay: '0.3s' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className={`card bg-gradient-to-br ${stat.gradient} hover-lift animate-slide-in-up`}
                  style={{ animationDelay: stat.delay }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${stat.color}-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce-in`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    {index === 0 && <TrendingUp className="w-5 h-5 text-success-500 animate-pulse" />}
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="col-span-2 space-y-6">
                {/* Continue Learning with Enhanced Design */}
                <div className="animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary-600" />
                    Continue Learning
                  </h3>
                  <div className="card hover-lift hover-glow">
                    <div className="flex gap-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl animate-pulse-glow">
                          <span className="text-5xl">⚗️</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce-in">
                          65%
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">Organic Chemistry</h4>
                            <p className="text-gray-600 flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              Chapter 5: Alkanes and Alkenes
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="mb-4 mt-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600 font-medium">Progress</span>
                            <span className="font-bold text-primary-600">65%</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000 ease-out relative" style={{ width: '65%' }}>
                              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="btn-primary flex items-center gap-2 flex-1">
                            <Play className="w-4 h-4" />
                            Continue Lesson
                          </button>
                          <button className="btn-secondary px-4">
                            <BookOpen className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weekly Learning Report with Chart Animation */}
                <div className="animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success-600" />
                    Weekly Learning Report
                  </h3>
                  <div className="card hover-lift">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Study Time</p>
                        <p className="text-4xl font-bold text-gray-900">12.5 hrs</p>
                      </div>
                      <div className="flex items-center gap-2 text-success-600 bg-success-50 px-4 py-2 rounded-xl">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-bold">+15%</span>
                        <span className="text-sm">from last week</span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between h-48 gap-3">
                      {[
                        { day: 'Mon', hours: 1.5 },
                        { day: 'Tue', hours: 2.2 },
                        { day: 'Wed', hours: 1.8 },
                        { day: 'Thu', hours: 2.5 },
                        { day: 'Fri', hours: 2.0 },
                        { day: 'Sat', hours: 1.5 },
                        { day: 'Sun', hours: 1.0 },
                      ].map((item, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div 
                            className="w-full bg-primary-100 rounded-t-xl relative overflow-hidden hover-lift cursor-pointer transition-all duration-500" 
                            style={{ 
                              height: `${(item.hours / 3) * 100}%`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-xl group-hover:from-primary-600 group-hover:to-primary-500 transition-all"></div>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{item.day}</span>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{item.hours}h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Schedule */}
                <div className="animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary-600" />
                    Upcoming Schedule
                  </h3>
                  <div className="card hover-lift">
                    <div className="space-y-3">
                      {[
                        { type: 'LIVE CLASS', title: 'Organic Chemistry', time: 'Today, 2:00 PM', color: 'secondary', icon: Video },
                        { type: 'TEST', title: 'Chemical Bonding', time: 'Feb 22, 10:00 AM', color: 'orange', icon: FileText },
                        { type: 'LIVE CLASS', title: 'Periodic Table', time: 'Feb 23, 3:30 PM', color: 'primary', icon: Video },
                      ].map((item, index) => (
                        <div 
                          key={index}
                          className={`p-4 bg-${item.color}-50 rounded-xl hover-lift cursor-pointer group animate-slide-in-right`}
                          style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                            <span className={`text-xs font-bold text-${item.color}-600`}>{item.type}</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-primary-600 transition-colors">{item.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="animate-slide-in-right" style={{ animationDelay: '1s' }}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Recent Achievements
                  </h3>
                  <div className="card hover-lift space-y-3">
                    {[
                      { title: 'Course Master', desc: 'Completed 5 courses', color: 'success', icon: '🏆' },
                      { title: 'Perfect Score', desc: '100% on last test', color: 'primary', icon: '⭐' },
                      { title: 'Week Warrior', desc: '7 day streak', color: 'orange', icon: '🔥' },
                    ].map((achievement, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group animate-bounce-in"
                        style={{ animationDelay: `${1.1 + index * 0.1}s` }}
                      >
                        <div className={`w-12 h-12 bg-${achievement.color}-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">{achievement.title}</p>
                          <p className="text-xs text-gray-600">{achievement.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PagePreloader>
  )
}

export default WebDashboard
