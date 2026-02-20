import { useState, useEffect } from 'react'
import { 
  FileText, 
  Plus, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import PagePreloader from '../common/PagePreloader'
import { getCurrentUser, createAssignmentWithNotifications } from '../../lib/supabase'

const Assignments = () => {
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [assignments, setAssignments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [creating, setCreating] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    maxScore: 100
  })

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    // Mock data
    const mockAssignments = [
      {
        id: 1,
        title: 'Chemical Bonding Assignment',
        course: 'Organic Chemistry',
        dueDate: '2024-02-25',
        submissions: 12,
        totalStudents: 45,
        status: 'active',
        maxScore: 100
      },
      {
        id: 2,
        title: 'Periodic Table Quiz',
        course: 'General Chemistry',
        dueDate: '2024-02-28',
        submissions: 38,
        totalStudents: 50,
        status: 'active',
        maxScore: 50
      }
    ]
    setAssignments(mockAssignments)
    setLoading(false)
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    setCreating(true)
    
    try {
      const user = await getCurrentUser()
      if (!user) {
        alert('Please login to create assignments')
        setCreating(false)
        return
      }
      
      // For now, use a default course_id or let user select
      const assignmentData = {
        title: formData.title,
        description: formData.description,
        course_id: '00000000-0000-0000-0000-000000000001', // Default course ID
        teacher_id: user.id,
        due_date: formData.dueDate,
        max_score: parseInt(formData.maxScore),
        status: 'active',
        created_at: new Date().toISOString()
      }
      
      console.log('Creating assignment:', assignmentData)
      
      // Create assignment with automatic notifications
      const { data, error } = await createAssignmentWithNotifications(assignmentData)
      
      if (error) {
        console.error('Error creating assignment:', error)
        const errorMessage = error?.message || error?.error_description || JSON.stringify(error) || 'Unknown error'
        alert(`Failed to create assignment: ${errorMessage}`)
      } else {
        console.log('Assignment created successfully:', data)
        const message = data 
          ? 'Assignment created successfully! Students will be notified if enrolled in the course.'
          : 'Assignment created successfully!'
        alert(message)
        setShowCreateModal(false)
        setFormData({
          title: '',
          description: '',
          courseId: '',
          dueDate: '',
          maxScore: 100
        })
        loadAssignments()
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`An error occurred: ${error.message || 'Please try again'}`)
    } finally {
      setCreating(false)
    }
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || assignment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (loading) return <PagePreloader />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
              <p className="text-sm md:text-base text-gray-600">Create and manage student assignments</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <Plus size={20} />
              <span>Create Assignment</span>
            </button>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search assignments..."
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
                  onClick={() => setFilterStatus('graded')}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    filterStatus === 'graded'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Graded
                </button>
              </div>
            </div>
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssignments.map((assignment, index) => (
              <div
                key={assignment.id}
                className="card hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.course}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {assignment.submissions}/{assignment.totalStudents} submitted
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-success-500 h-2 rounded-full"
                      style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="btn-primary flex-1">View Submissions</button>
                  <button className="btn-secondary">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-scale-in">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Assignment</h2>
              <p className="text-sm text-gray-600">Students will be notified automatically</p>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Chemical Bonding Assignment"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="What should students do?"
                  className="input-field min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                  <input
                    type="number"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({...formData, maxScore: e.target.value})}
                    placeholder="100"
                    className="input-field"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary flex-1"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create & Notify Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Assignments
