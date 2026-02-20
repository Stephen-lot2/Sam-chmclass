import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WebSidebar from './WebSidebar'
import WebHeader from './WebHeader'
import { Search, Filter, Clock, BookOpen, Play, Star } from 'lucide-react'

const courses = [
  { id: 1, title: 'Organic Chemistry', lessons: 24, duration: '12 hrs', progress: 65, rating: 4.8, students: 1234, color: 'from-primary-500 to-primary-600', emoji: '⚗️' },
  { id: 2, title: 'Chemical Bonding', lessons: 18, duration: '8 hrs', progress: 45, rating: 4.6, students: 892, color: 'from-secondary-500 to-secondary-600', emoji: '🔬' },
  { id: 3, title: 'Periodic Table', lessons: 20, duration: '10 hrs', progress: 80, rating: 4.9, students: 1567, color: 'from-success-500 to-success-600', emoji: '📊' },
  { id: 4, title: 'Acids and Bases', lessons: 16, duration: '7 hrs', progress: 30, rating: 4.7, students: 743, color: 'from-orange-500 to-orange-600', emoji: '🧪' },
  { id: 5, title: 'Thermodynamics', lessons: 22, duration: '11 hrs', progress: 0, rating: 4.5, students: 654, color: 'from-purple-500 to-purple-600', emoji: '🌡️' },
  { id: 6, title: 'Electrochemistry', lessons: 19, duration: '9 hrs', progress: 0, rating: 4.8, students: 921, color: 'from-blue-500 to-blue-600', emoji: '⚡' },
]

const CourseCatalog = () => {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

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
    <div className="flex">
      <WebSidebar />
      
      <div className="flex-1 ml-64">
        <WebHeader title="Course Catalog" />
        
        <div className="p-8">
          {/* Search and Filter Bar */}
          <div className="card mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mt-4">
              {['all', 'in-progress', 'not-started', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filter === tab
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                {/* Course Thumbnail */}
                <div className={`w-full h-40 bg-gradient-to-br ${course.color} rounded-xl flex items-center justify-center mb-4`}>
                  <span className="text-6xl">{course.emoji}</span>
                </div>

                {/* Course Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.lessons} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </span>
                </div>

                {/* Rating and Students */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-900">{course.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">{course.students.toLocaleString()} students</span>
                </div>

                {/* Progress */}
                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-300`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No courses found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCatalog
