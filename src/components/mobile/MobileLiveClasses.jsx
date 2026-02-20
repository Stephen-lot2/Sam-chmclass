import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, Calendar, Clock, Users, Play, Bell } from 'lucide-react'
import MobileNav from './MobileNav'
import PagePreloader from '../common/PagePreloader'
import { getLiveClasses } from '../../lib/supabase'

const MobileLiveClasses = () => {
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await getLiveClasses()
      if (!error && data) {
        setClasses(data)
      } else {
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const upcomingClasses = classes.filter(c => c.status === 'upcoming')
  const pastClasses = classes.filter(c => c.status === 'completed')

  return (
    <PagePreloader loading={loading}>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-500 to-purple-600 px-6 pt-12 pb-8 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4 animate-slide-in-right">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Live Classes</h1>
              <p className="text-secondary-100 text-sm">Join interactive sessions</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float">
              <Video className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="px-6 -mt-4">
          {/* Upcoming Classes */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 animate-slide-in-right">
              <Bell className="w-5 h-5 text-secondary-600" />
              Upcoming Classes
            </h3>
            <div className="space-y-4">
              {upcomingClasses.map((classItem, index) => (
                <div 
                  key={classItem.id}
                  className="card hover-lift cursor-pointer animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/live-class/${classItem.id}`)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse-glow">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{classItem.title}</h4>
                      <p className="text-sm text-gray-600">{classItem.instructor}</p>
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
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 animate-slide-in-right">
              <Clock className="w-5 h-5 text-gray-600" />
              Past Classes
            </h3>
            <div className="space-y-4">
              {pastClasses.map((classItem, index) => (
                <div 
                  key={classItem.id}
                  className="card hover-lift cursor-pointer opacity-75 hover:opacity-100 transition-opacity animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/live-class/${classItem.id}`)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Video className="w-8 h-8 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{classItem.title}</h4>
                      <p className="text-sm text-gray-600">{classItem.instructor}</p>
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

        <MobileNav active="live" />
      </div>
    </PagePreloader>
  )
}

export default MobileLiveClasses
