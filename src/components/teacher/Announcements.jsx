import { useState, useEffect } from 'react'
import { 
  Megaphone, 
  Plus, 
  Calendar,
  Users,
  Eye,
  Search
} from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import PagePreloader from '../common/PagePreloader'

const Announcements = () => {
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadAnnouncements()
  }, [])

  const loadAnnouncements = async () => {
    // Mock data
    const mockAnnouncements = [
      {
        id: 1,
        title: 'Midterm Exam Schedule',
        content: 'The midterm exam will be held on February 28th. Please prepare accordingly.',
        course: 'All Courses',
        date: '2024-02-20',
        views: 145,
        priority: 'high'
      },
      {
        id: 2,
        title: 'New Study Materials Available',
        content: 'I have uploaded new study materials for Chapter 5. Check the course page.',
        course: 'Organic Chemistry',
        date: '2024-02-19',
        views: 89,
        priority: 'normal'
      }
    ]
    setAnnouncements(mockAnnouncements)
    setLoading(false)
  }

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <PagePreloader />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
              <p className="text-sm md:text-base text-gray-600">Communicate with your students</p>
            </div>
            <button className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto">
              <Plus size={20} />
              <span>New Announcement</span>
            </button>
          </div>

          {/* Search */}
          <div className="card mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search announcements..."
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Announcements List */}
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement, index) => (
              <div
                key={announcement.id}
                className="card hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    announcement.priority === 'high'
                      ? 'bg-gradient-to-br from-red-500 to-red-600'
                      : 'bg-gradient-to-br from-success-500 to-success-600'
                  }`}>
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{announcement.title}</h3>
                        <p className="text-sm text-gray-600">{announcement.course}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        announcement.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-success-100 text-success-700'
                      }`}>
                        {announcement.priority === 'high' ? 'High Priority' : 'Normal'}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{announcement.content}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(announcement.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {announcement.views} views
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="btn-secondary text-sm">Edit</button>
                      <button className="btn-secondary text-sm text-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Announcements
