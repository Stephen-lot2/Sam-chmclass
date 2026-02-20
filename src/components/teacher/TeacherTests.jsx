import { useState, useEffect } from 'react'
import { 
  ClipboardList, 
  Plus, 
  Calendar,
  Users,
  Award,
  Search
} from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import PagePreloader from '../common/PagePreloader'
import { getCurrentUser, createTestWithNotifications } from '../../lib/supabase'

const TeacherTests = () => {
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    date: '',
    duration: 60,
    totalQuestions: 20
  })
  
  // Questions state for multiple choice
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
  ])

  useEffect(() => {
    loadTests()
  }, [])

  const loadTests = async () => {
    // Mock data
    const mockTests = [
      {
        id: 1,
        title: 'Midterm Exam - Organic Chemistry',
        course: 'Organic Chemistry',
        date: '2024-02-28',
        duration: 120,
        totalQuestions: 50,
        participants: 42,
        averageScore: 78
      },
      {
        id: 2,
        title: 'Quiz - Chemical Bonding',
        course: 'General Chemistry',
        date: '2024-03-05',
        duration: 30,
        totalQuestions: 20,
        participants: 0,
        averageScore: 0
      }
    ]
    setTests(mockTests)
    setLoading(false)
  }

  const handleCreateTest = async (e) => {
    e.preventDefault()
    setCreating(true)
    
    try {
      const user = await getCurrentUser()
      if (!user) {
        alert('Please login to create tests')
        setCreating(false)
        return
      }
      
      // Validate questions
      const validQuestions = questions.filter(q => 
        q.question.trim() && 
        q.options.every(opt => opt.trim()) &&
        q.correctAnswer !== null
      )
      
      if (validQuestions.length === 0) {
        alert('Please add at least one complete question with all options')
        setCreating(false)
        return
      }
      
      const testData = {
        title: formData.title,
        description: formData.description,
        course_id: '00000000-0000-0000-0000-000000000001', // Default course ID
        teacher_id: user.id,
        due_date: formData.date,
        duration: parseInt(formData.duration),
        total_questions: validQuestions.length,
        questions: JSON.stringify(validQuestions), // Store questions as JSON
        status: 'active',
        created_at: new Date().toISOString()
      }
      
      console.log('Creating test:', testData)
      
      // Create test with automatic notifications
      const { data, error } = await createTestWithNotifications(testData)
      
      if (error) {
        console.error('Error creating test:', error)
        const errorMessage = error?.message || error?.error_description || JSON.stringify(error) || 'Unknown error'
        alert(`Failed to create test: ${errorMessage}`)
      } else {
        console.log('Test created successfully:', data)
        const message = data 
          ? 'Test created successfully! Students will be notified if enrolled in the course.'
          : 'Test created successfully!'
        alert(message)
        setShowCreateModal(false)
        setFormData({
          title: '',
          description: '',
          courseId: '',
          date: '',
          duration: 60,
          totalQuestions: 20
        })
        setQuestions([{
          id: 1,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }])
        loadTests()
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`An error occurred: ${error.message || 'Please try again'}`)
    } finally {
      setCreating(false)
    }
  }
  
  const addQuestion = () => {
    setQuestions([...questions, {
      id: questions.length + 1,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }])
  }
  
  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }
  
  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ))
  }
  
  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options]
        newOptions[optionIndex] = value
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const filteredTests = tests.filter(test =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <PagePreloader />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tests & Exams</h1>
              <p className="text-sm md:text-base text-gray-600">Create and manage assessments</p>
            </div>
            <button className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              <span>Create Test</span>
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
                placeholder="Search tests..."
                className="input-field pl-12"
              />
            </div>
          </div>

          {/* Tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTests.map((test, index) => (
              <div
                key={test.id}
                className="card hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{test.title}</h3>
                    <p className="text-sm text-gray-600">{test.course}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(test.date).toLocaleDateString()} • {test.duration} mins
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClipboardList className="w-4 h-4" />
                    {test.totalQuestions} questions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {test.participants} participants
                  </div>
                  {test.averageScore > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      Average: {test.averageScore}%
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="btn-primary flex-1">View Results</button>
                  <button className="btn-secondary">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Create Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto animate-scale-in my-8">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Create New Test</h2>
              <p className="text-sm text-gray-600">Students will be notified automatically. Add multiple choice questions below.</p>
            </div>

            <form onSubmit={handleCreateTest} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Test Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Midterm Exam - Organic Chemistry"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="What topics will be covered?"
                    className="input-field min-h-[80px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="60"
                      className="input-field"
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Multiple Choice Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="btn-secondary text-sm flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>

                {questions.map((question, qIndex) => (
                  <div key={question.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-gray-900">Question {qIndex + 1}</h4>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        placeholder="Enter your question here..."
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Answer Options</label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                            className="w-4 h-4 text-primary-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            className="input-field flex-1"
                            required
                          />
                          <span className="text-xs text-gray-500 w-20">
                            {question.correctAnswer === optIndex && '✓ Correct'}
                          </span>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-1">Select the radio button next to the correct answer</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 -mb-6 px-6 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setQuestions([{
                      id: 1,
                      question: '',
                      options: ['', '', '', ''],
                      correctAnswer: 0
                    }])
                  }}
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
                  {creating ? 'Creating...' : `Create Test (${questions.length} questions)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherTests
