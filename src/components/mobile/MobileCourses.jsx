import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Clock, BookOpen, Play, Star } from 'lucide-react'
import MobileNav from './MobileNav'
import PagePreloader from '../common/PagePreloader'
import { getCourses } from '../../lib/supabase'

const MobileCourses = () => {
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await getCourses()
      if (!error && data) {
        setCourses(data)
      } else {
        // Fallback mock data
        setCourses([
          { id: 1, title: 'Organic Chemistry', lessons: 24, duration: '12 hrs', progress: 65, rating: 4.8, color: 'from-primary-500 to-primary-600', emoji: '⚗️' },
          { id: 2, title: 'Chemical Bonding', lessons: 18, duration: '8 hrs', progress: 45, rating: 4.6, color: 'from-secondary-500 to-secondary-600', emoji: '🔬' },
          { id: 3, title: 'Periodic Table', lessons: 20, duration: '10 hrs', progress: 80, rating: 4.9, color: 'from-success-500 to-success-600', emoji: '📊' },
          { id: 4, title: 'Acids and Bases', lessons: 16, duration: '7 hrs', progress: 30, rating: 4.7, color: 'from-orange-500 to-orange-600', emoji: '🧪' },
          { id: 5, title: 'Thermodynamics', lessons: 22, duration: '11 hrs', progress: 0, rating: 4.5, color: 'from-purple-500 to-purple-600', emoji: '🌡️' },
          { id: 6, title: 'Electrochemistry', lessons: 19, duration: '9 hrs', progress: 0, rating: 4.8, color: 'from-blue-500 to-blue-600', emoji: '⚡' },
        ])
      }
      setTimeout(() => setLoading(false), 800)
    }
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'in-progress' && course.progress > 0 && course.progress < 100) ||
      (filter === 'completed' && course.progress === 100) ||
      (filter === 'not-started' && course.progress === 0)
    return matchesSearch && matchesFilter
  })

  return (
    <PagePreloader loading={loading}>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 pt-12 pb-6 border-b border-primary-600 rounded-b-3xl">
          <h1 className="text-2xl font-bold text-white mb-4 animate-slide-in-right">My Courses</h1>
          
          {/* Search */}
          <div className="relative mb-4 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-transparent focus:border-white/50 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            {['all', 'in-progress', 'not-started', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === tab
                    ? 'bg-white text-primary-600 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Course List */}
        <div className="px-6 py-6 space-y-4">
          {filteredCourses.map((course, index) => (
            <div 
              key={course.id} 
              className="card hover-lift cursor-pointer animate-slide-in-up"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              onClick={() => navigate(`/course/${course.id}`)}
            >
              <div className="flex gap-4 mb-4">
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-br ${course.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse-glow`}>
                    <span className="text-3xl">{course.emoji}</span>
                  </div>
                  {course.progress > 0 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce-in">
                      {course.progress}%
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{course.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">{course.rating}</span>
                  </div>
                </div>
              </div>

              {/* Progress */}
              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-bold text-primary-600">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${course.progress}%` }}
                    >
                      <div className="h-full bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
              </button>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 animate-scale-in">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-600">No courses found</p>
            </div>
          )}
        </div>

        <MobileNav active="courses" />
      </div>
    </PagePreloader>
  )
}

export default MobileCourses
