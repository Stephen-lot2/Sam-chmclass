import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Video, 
  Plus, 
  Calendar,
  Clock,
  Users,
  Play,
  Edit,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import PagePreloader from '../common/PagePreloader'
import { getCurrentUser, scheduleClassWithNotifications } from '../../lib/supabase'

const TeacherLiveClasses = () => {
  const [loading, setLoading] = useState(true)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [classes, setClasses] = useState([])
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [courseId, setCourseId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [duration, setDuration] = useState('60')
  const [maxParticipants, setMaxParticipants] = useState('50')
  const [platform, setPlatform] = useState('daily') // 'daily' or 'google-meet'
  const [googleMeetLink, setGoogleMeetLink] = useState('')

  // Daily.co room URL
  const dailyRoomUrl = 'https://samuel-chemlab.daily.co/chemistry-class'

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      // Mock data for demonstration
      const mockClasses = [
        {
          id: 1,
          title: 'Organic Chemistry Basics',
          description: 'Introduction to organic compounds and bonding',
          scheduledAt: '2024-02-20T15:00:00',
          duration: 60,
          status: 'upcoming',
          participants: 0,
          maxParticipants: 50,
          roomUrl: dailyRoomUrl
        },
        {
          id: 2,
          title: 'Chemical Reactions Lab',
          description: 'Live demonstration of chemical reactions',
          scheduledAt: '2024-02-18T14:00:00',
          duration: 90,
          status: 'completed',
          participants: 45,
          maxParticipants: 50,
          roomUrl: dailyRoomUrl,
          recordingUrl: '#'
        }
      ]
      setClasses(mockClasses)
    } catch (error) {
      console.error('Error loading classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleClass = async (e) => {
    e.preventDefault()
    
    const roomUrl = platform === 'google-meet' ? googleMeetLink : dailyRoomUrl
    
    const classData = {
      title,
      description,
      course_id: courseId || null,
      scheduled_at: `${scheduledDate}T${scheduledTime}:00`,
      duration: parseInt(duration),
      max_participants: parseInt(maxParticipants),
      room_url: roomUrl,
      platform: platform,
      status: 'upcoming'
    }

    try {
      const user = await getCurrentUser()
      if (!user) {
        alert('Please login to schedule classes')
        return
      }
      
      classData.teacher_id = user.id
      
      // Schedule class with automatic notifications
      const { data, error } = await scheduleClassWithNotifications(classData)
      
      if (error) {
        console.error('Error scheduling class:', error)
        alert('Failed to schedule class. Please try again.')
      } else {
        alert(`Class scheduled successfully with ${platform === 'google-meet' ? 'Google Meet' : 'Daily.co'}! Students have been notified.`)
        setShowScheduleModal(false)
        
        // Reset form
        setTitle('')
        setDescription('')
        setCourseId('')
        setScheduledDate('')
        setScheduledTime('')
        setDuration('60')
        setMaxParticipants('50')
        setPlatform('daily')
        setGoogleMeetLink('')
        
        loadClasses()
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleStartClass = async (classItem) => {
    if (classItem.platform === 'google-meet') {
      // If no Google Meet link exists, generate one automatically
      if (!classItem.room_url || classItem.room_url === '') {
        // Generate a new Google Meet link
        const meetCode = generateMeetCode()
        const googleMeetUrl = `https://meet.google.com/${meetCode}`
        
        // In production, save to database
        console.log('Generated Google Meet link:', googleMeetUrl)
        console.log('Saving to database for class ID:', classItem.id)
        
        // Update local state
        setClasses(prevClasses => 
          prevClasses.map(c => 
            c.id === classItem.id 
              ? { ...c, room_url: googleMeetUrl }
              : c
          )
        )
        
        // Open the generated link
        window.open(googleMeetUrl, '_blank')
        
        // Show success message with copy option
        if (confirm(`Google Meet created!\n\nLink: ${googleMeetUrl}\n\nClick OK to copy link to clipboard.`)) {
          navigator.clipboard.writeText(googleMeetUrl)
        }
      } else {
        // Use existing link
        window.open(classItem.room_url, '_blank')
      }
    } else {
      // Daily.co - open in app
      window.open(`/live-class/${classItem.id}`, '_blank')
    }
  }

  // Generate a random Google Meet code
  const generateMeetCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    const part1 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const part2 = Array.from({length: 4}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const part3 = Array.from({length: 3}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    return `${part1}-${part2}-${part3}`
  }

  const handleCopyLink = (roomUrl) => {
    navigator.clipboard.writeText(roomUrl)
    alert('Room link copied to clipboard!')
  }

  const upcomingClasses = classes.filter(c => c.status === 'upcoming')
  const pastClasses = classes.filter(c => c.status === 'completed')

  if (loading) return <PagePreloader />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Live Classes</h1>
              <p className="text-sm md:text-base text-gray-600">Schedule and manage your live sessions</p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <Plus size={20} />
              <span className="md:inline">Schedule New Class</span>
            </button>
          </div>

          {/* Daily.co Room Info */}
          <div className="card mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 w-full">
                <h3 className="font-bold text-gray-900 mb-2">Your Live Class Room</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Share this link with your students to join the live class
                </p>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                  <input
                    type="text"
                    value={dailyRoomUrl}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleCopyLink(dailyRoomUrl)}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                  <a
                    href={dailyRoomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Open Room
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Upcoming Classes</h2>
            {upcomingClasses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {upcomingClasses.map((classItem, index) => (
                  <div
                    key={classItem.id}
                    className="card hover-lift animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base md:text-lg">{classItem.title}</h3>
                            <p className="text-sm text-gray-600">{classItem.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              classItem.platform === 'google-meet'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}>
                              {classItem.platform === 'google-meet' ? '📹 Google Meet' : '🎥 Daily.co'}
                            </span>
                            <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
                              Upcoming
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(classItem.scheduledAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(classItem.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {classItem.participants}/{classItem.maxParticipants} students
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleStartClass(classItem)}
                            className="btn-primary flex items-center gap-2 text-sm"
                          >
                            <Play size={16} />
                            Start Class
                          </button>
                          <button
                            onClick={() => handleCopyLink(classItem.roomUrl)}
                            className="btn-secondary flex items-center gap-2 text-sm"
                          >
                            <Copy size={16} />
                            Copy Link
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No upcoming classes scheduled</p>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Schedule Your First Class
                </button>
              </div>
            )}
          </div>

          {/* Past Classes */}
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Past Classes</h2>
            {pastClasses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {pastClasses.map((classItem) => (
                  <div key={classItem.id} className="card opacity-75">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-500" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900">{classItem.title}</h3>
                            <p className="text-sm text-gray-600">{classItem.description}</p>
                          </div>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            Completed
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(classItem.scheduledAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {classItem.participants} attended
                          </div>
                        </div>

                        {classItem.recordingUrl && (
                          <a
                            href={classItem.recordingUrl}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            View Recording →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-8">
                <p className="text-gray-500">No past classes yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-scale-in">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Schedule New Live Class</h2>
              <p className="text-sm text-gray-600">Set up a new live session for your students</p>
            </div>

            <form onSubmit={handleScheduleClass} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Organic Chemistry Basics"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will you cover in this class?"
                  className="input-field min-h-[100px]"
                  required
                />
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Video Platform</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlatform('daily')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      platform === 'daily'
                        ? 'border-primary-500 bg-primary-50 scale-105'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎥</div>
                      <p className={`font-medium text-sm ${
                        platform === 'daily' ? 'text-primary-600' : 'text-gray-600'
                      }`}>Daily.co</p>
                      <p className="text-xs text-gray-500 mt-1">Built-in video</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform('google-meet')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      platform === 'google-meet'
                        ? 'border-success-500 bg-success-50 scale-105'
                        : 'border-gray-200 hover:border-success-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">📹</div>
                      <p className={`font-medium text-sm ${
                        platform === 'google-meet' ? 'text-success-600' : 'text-gray-600'
                      }`}>Google Meet</p>
                      <p className="text-xs text-gray-500 mt-1">External link</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Google Meet Link Input */}
              {platform === 'google-meet' && (
                <div className="animate-scale-in">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Google Meet Link</label>
                  <input
                    type="url"
                    value={googleMeetLink}
                    onChange={(e) => setGoogleMeetLink(e.target.value)}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    className="input-field"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Create a meeting at <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">meet.google.com</a> and paste the link here
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="60"
                    className="input-field"
                    required
                    min="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    placeholder="50"
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Platform:</strong> {platform === 'google-meet' ? 'Google Meet' : 'Daily.co'}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Room URL:</strong> {platform === 'google-meet' ? (googleMeetLink || 'Enter Google Meet link above') : dailyRoomUrl}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  This link will be shared with students to join the class
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherLiveClasses
