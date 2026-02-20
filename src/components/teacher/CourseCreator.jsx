import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Upload, 
  Plus, 
  Trash2, 
  Save,
  Eye,
  ArrowLeft
} from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import LoadingSpinner from '../common/LoadingSpinner'
import { getCurrentUser, createCourse } from '../../lib/supabase'

const CourseCreator = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  
  // Course data
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('chemistry')
  const [level, setLevel] = useState('beginner')
  const [price, setPrice] = useState(0)
  const [thumbnail, setThumbnail] = useState(null)
  const [lessons, setLessons] = useState([
    { id: 1, title: '', description: '', duration: '', videoUrl: '' }
  ])

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  const addLesson = () => {
    setLessons([
      ...lessons,
      { id: Date.now(), title: '', description: '', duration: '', videoUrl: '' }
    ])
  }

  const removeLesson = (id) => {
    setLessons(lessons.filter(lesson => lesson.id !== id))
  }

  const updateLesson = (id, field, value) => {
    setLessons(lessons.map(lesson => 
      lesson.id === id ? { ...lesson, [field]: value } : lesson
    ))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const courseData = {
        teacher_id: user.id,
        title,
        description,
        category,
        level,
        price: parseFloat(price),
        thumbnail_url: thumbnail,
        published: false,
        lessons: lessons.filter(l => l.title) // Only include lessons with titles
      }

      const { data, error } = await createCourse(courseData)
      
      if (error) {
        alert('Error creating course: ' + error.message)
      } else {
        alert('Course created successfully!')
        navigate('/teacher/courses')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/teacher/courses')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft size={20} />
                Back to Courses
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600">Fill in the details to create your course</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <Eye size={20} />
                Preview
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Save size={20} />}
                Save Course
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Introduction to Organic Chemistry"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what students will learn in this course..."
                    className="input-field min-h-[120px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input-field"
                    >
                      <option value="chemistry">Chemistry</option>
                      <option value="physics">Physics</option>
                      <option value="biology">Biology</option>
                      <option value="mathematics">Mathematics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="input-field"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="input-field"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={thumbnail || ''}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="input-field flex-1"
                    />
                    <button type="button" className="btn-secondary flex items-center gap-2">
                      <Upload size={20} />
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Curriculum</h2>
                <button
                  type="button"
                  onClick={addLesson}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Lesson
                </button>
              </div>

              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div key={lesson.id} className="p-4 border-2 border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Lesson {index + 1}</h3>
                      {lessons.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLesson(lesson.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                        placeholder="Lesson title"
                        className="input-field"
                      />
                      <textarea
                        value={lesson.description}
                        onChange={(e) => updateLesson(lesson.id, 'description', e.target.value)}
                        placeholder="Lesson description"
                        className="input-field min-h-[80px]"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(lesson.id, 'duration', e.target.value)}
                          placeholder="Duration (e.g., 15 min)"
                          className="input-field"
                        />
                        <input
                          type="url"
                          value={lesson.videoUrl}
                          onChange={(e) => updateLesson(lesson.id, 'videoUrl', e.target.value)}
                          placeholder="Video URL"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CourseCreator
