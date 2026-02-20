import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WebSidebar from './WebSidebar'
import WebHeader from './WebHeader'
import { Video, Calendar, Clock, Users, Play, Bell } from 'lucide-react'
import PagePreloader from '../common/PagePreloader'
import { getLiveClasses } from '../../lib/supabase'

const LiveClasses = () => {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await getLiveClasses()
      if (!error && data) {
        setClasses(data)
      } else {
        // Fallback to mock data
        setClasses([
          { id: 1, title: 'Organic Chemistry - Alkanes', instructor: 'Dr. Sarah Johnson', scheduled_at: '2024-02-20T14:00:00', duration: 60, participants: 45, status: 'upcoming' },
          { id: 2, title: 'Chemical Bonding Basics', instructor: 'Prof. Michael Chen', scheduled_at: '2024-02-21T10:00:00', duration: 90, participants: 38, status: 'upcoming' },
          { id: 3, title: 'Periodic Table Deep Dive', instructor: 'Dr. Emily Rodriguez', scheduled_at: '2024-02-22T15:30:00', duration: 75, participants: 52, status: 'upcoming' },
          { id: 4, title: 'Acids and Bases Workshop', instructor: 'Dr. Sarah Johnson', scheduled_at: '2024-02-19T14:00:00', duration: 60, participants: 41, status: 'completed' },
        ])
      }
      setTimeout(() => setLoading(false), 800)
    }
    fetchClasses()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const upcomingClasses = classes.filter(c => c.status === 'upcoming')
  const pastClasses = classes.filter(c => c.status === 'completed')

  return (
    <PagePreloader loading={loading}>
      <div className="flex">
        <WebSidebar />
        
        <div className="flex-1 ml-64">
          <WebHeader title="Live Classes" />
          
          <div className="p-8">
            {/* Header Section */}
            <div className="card bg-gradient-to-r from-secondary-500 to-purple-600 text-white mb-8 animate-slide-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Live Interactive Classes</h2>
                  <p className="text-secondary-100">Join live sessions with expert instructors</p>
                </div>
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float">
                  <Video className="w-12 h-12" />
                </div>
              </div>
            </div>

            {/* Upcoming Classes */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 animate-slide-in-right">
                <Bell className="w-6 h-6 text-secondary-600" />
                Upcoming Classes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingClasses.map((classItem, index) => (
                  <div 
                    key={classItem.id}
                    className="card hover-lift cursor-pointer animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/live-class/${classItem.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{classItem.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{classItem.instructor}</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(classItem.scheduled_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(classItem.scheduled_at)} • {classItem.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{classItem.participants} participants</span>
                      </div>
                    </div>

                    <button className="btn-primary w-full flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Join Class
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Classes */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 animate-slide-in-right">
                <Clock className="w-6 h-6 text-gray-600" />
                Past Classes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastClasses.map((classItem, index) => (
                  <div 
                    key={classItem.id}
                    className="card hover-lift cursor-pointer opacity-75 hover:opacity-100 transition-opacity animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/live-class/${classItem.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{classItem.title}</h4>
                        <p className="text-gray-600 text-sm mb-3">{classItem.instructor}</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                        <Video className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(classItem.scheduled_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(classItem.scheduled_at)} • {classItem.duration} mins</span>
                      </div>
                    </div>

                    <button className="btn-secondary w-full flex items-center justify-center gap-2">
                      <Play className="w-4 h-4" />
                      Watch Recording
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PagePreloader>
  )
}

export default LiveClasses
