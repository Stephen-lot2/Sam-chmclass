import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter,
  MessageSquare,
  Eye,
  Ban,
  CheckCircle,
  TrendingUp,
  Clock,
  Award,
  Send,
  X,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  FileText,
  Video
} from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import PagePreloader from '../common/PagePreloader'
import { getCurrentUser, getTeacherStudents } from '../../lib/supabase'

const StudentManager = () => {
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageType, setMessageType] = useState('individual')

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        const { data } = await getTeacherStudents(user.id)
        // Mock data for demonstration
        const mockStudents = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
            enrolledCourses: 3,
            completedAssignments: 12,
            pendingAssignments: 3,
            averageScore: 85,
            lastActive: '2 hours ago',
            status: 'active',
            progress: 75,
            joinedDate: '2024-01-15'
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=ec4899&color=fff',
            enrolledCourses: 2,
            completedAssignments: 18,
            pendingAssignments: 1,
            averageScore: 92,
            lastActive: '1 day ago',
            status: 'active',
            progress: 90,
            joinedDate: '2024-01-10'
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10b981&color=fff',
            enrolledCourses: 4,
            completedAssignments: 8,
            pendingAssignments: 6,
            averageScore: 78,
            lastActive: '3 days ago',
            status: 'inactive',
            progress: 45,
            joinedDate: '2024-02-01'
          }
        ]
        setStudents(data?.length > 0 ? data : mockStudents)
      }
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleSendMessage = () => {
    alert(`Message sent to ${messageType === 'individual' ? selectedStudent?.name : 'all students'}:\n${messageText}`)
    setShowMessageModal(false)
    setMessageText('')
  }

  const handleBlockStudent = (student) => {
    if (confirm(`Are you sure you want to block ${student.name}? They won't be able to access your courses.`)) {
      alert(`${student.name} has been blocked`)
    }
  }

  const handleUnblockStudent = (student) => {
    alert(`${student.name} has been unblocked`)
  }

  if (loading) return <PagePreloader />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
            <p className="text-sm md:text-base text-gray-600">Monitor, communicate, and manage your students</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <Users className="w-6 h-6 md:w-8 md:h-8 mb-2" />
              <p className="text-xl md:text-2xl font-bold">{students.length}</p>
              <p className="text-xs md:text-sm text-blue-100">Total Students</p>
            </div>
            <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 mb-2" />
              <p className="text-xl md:text-2xl font-bold">{students.filter(s => s.status === 'active').length}</p>
              <p className="text-xs md:text-sm text-success-100">Active Students</p>
            </div>
            <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
              <Clock className="w-6 h-6 md:w-8 md:h-8 mb-2" />
              <p className="text-xl md:text-2xl font-bold">{students.filter(s => s.status === 'inactive').length}</p>
              <p className="text-xs md:text-sm text-warning-100">Inactive Students</p>
            </div>
            <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
              <Award className="w-6 h-6 md:w-8 md:h-8 mb-2" />
              <p className="text-xl md:text-2xl font-bold">
                {Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%
              </p>
              <p className="text-xs md:text-sm text-primary-100">Avg. Score</p>
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="input-field pl-12"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    filterStatus === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    filterStatus === 'active'
                      ? 'bg-success-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('inactive')}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    filterStatus === 'inactive'
                      ? 'bg-warning-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inactive
                </button>
              </div>
              <button
                onClick={() => {
                  setMessageType('all')
                  setShowMessageModal(true)
                }}
                className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <MessageSquare size={20} />
                <span className="hidden md:inline">Message All</span>
                <span className="md:hidden">Message</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-success-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('inactive')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'inactive'
                      ? 'bg-warning-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inactive
                </button>
              </div>
              <button
                onClick={() => {
                  setMessageType('all')
                  setShowMessageModal(true)
                }}
                className="btn-primary flex items-center gap-2"
              >
                <MessageSquare size={20} />
                Message All
              </button>
            </div>
          </div>

          {/* Students List */}
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="card hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-16 h-16 rounded-full border-3 border-gray-200"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        student.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'active'
                            ? 'bg-success-100 text-success-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {student.status === 'active' ? '🟢 Active' : '⚪ Inactive'}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">{student.enrolledCourses} Courses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-success-600" />
                          <span className="text-gray-600">{student.completedAssignments} Completed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-warning-600" />
                          <span className="text-gray-600">{student.pendingAssignments} Pending</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="w-4 h-4 text-primary-600" />
                          <span className="text-gray-600">{student.averageScore}% Avg</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Overall Progress</span>
                          <span className="font-medium">{student.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-success-500 h-2 rounded-full transition-all"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="btn-secondary text-sm flex items-center gap-2"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student)
                            setMessageType('individual')
                            setShowMessageModal(true)
                          }}
                          className="btn-primary text-sm flex items-center gap-2"
                        >
                          <MessageSquare size={16} />
                          Message
                        </button>
                        {student.status === 'active' ? (
                          <button
                            onClick={() => handleBlockStudent(student)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm flex items-center gap-2"
                          >
                            <Ban size={16} />
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblockStudent(student)}
                            className="px-3 py-1.5 bg-success-50 text-success-600 rounded-lg hover:bg-success-100 transition-colors text-sm flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Unblock
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-16">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Students will appear here when they enroll in your courses'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-scale-in">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {messageType === 'individual' ? `Message ${selectedStudent?.name}` : 'Message All Students'}
                </h2>
                <p className="text-sm text-gray-600">
                  {messageType === 'individual' ? selectedStudent?.email : `Send to ${students.length} students`}
                </p>
              </div>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="input-field min-h-[200px] mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentManager
