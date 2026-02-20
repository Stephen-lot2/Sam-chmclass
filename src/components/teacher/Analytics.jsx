import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Clock
} from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import PagePreloader from '../common/PagePreloader'

const Analytics = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  if (loading) return <PagePreloader />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-sm md:text-base text-gray-600">Track performance and engagement</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {[
              { icon: Users, label: 'Total Students', value: '156', change: '+12%', color: 'from-blue-500 to-blue-600' },
              { icon: BookOpen, label: 'Active Courses', value: '8', change: '+2', color: 'from-success-500 to-success-600' },
              { icon: Award, label: 'Avg. Score', value: '85%', change: '+5%', color: 'from-warning-500 to-warning-600' },
              { icon: Clock, label: 'Total Hours', value: '240', change: '+18', color: 'from-primary-500 to-primary-600' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="card animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <p className="text-gray-600 text-xs md:text-sm mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                    <span className="text-success-600 text-xs md:text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Student Enrollment Trend</h3>
              <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Course Performance</h3>
              <div className="h-64 bg-gradient-to-br from-success-50 to-warning-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Chart visualization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Students */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Top Performing Students</h3>
            <div className="space-y-3">
              {[
                { name: 'John Doe', score: 95, course: 'Organic Chemistry' },
                { name: 'Jane Smith', score: 92, course: 'General Chemistry' },
                { name: 'Mike Johnson', score: 90, course: 'Organic Chemistry' }
              ].map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-success-600">{student.score}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
