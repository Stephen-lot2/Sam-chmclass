import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Clock, Calendar, Award, Play, CheckCircle } from 'lucide-react'
import MobileNav from './MobileNav'
import PagePreloader from '../common/PagePreloader'
import { getTests } from '../../lib/supabase'

const MobileTests = () => {
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState([])
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTests = async () => {
      const { data, error } = await getTests()
      if (!error && data) {
        setTests(data)
      } else {
        setTests([
          { id: 1, title: 'Organic Chemistry - Chapter 5', questions: 25, duration: 45, due_date: '2024-02-25T23:59:00', status: 'pending', score: null },
          { id: 2, title: 'Chemical Bonding Quiz', questions: 15, duration: 30, due_date: '2024-02-22T23:59:00', status: 'pending', score: null },
          { id: 3, title: 'Periodic Table Assessment', questions: 20, duration: 40, due_date: '2024-02-28T23:59:00', status: 'pending', score: null },
          { id: 4, title: 'Acids and Bases Test', questions: 30, duration: 60, due_date: '2024-02-15T23:59:00', status: 'completed', score: 95 },
          { id: 5, title: 'Thermodynamics Quiz', questions: 18, duration: 35, due_date: '2024-02-10T23:59:00', status: 'completed', score: 88 },
        ])
      }
      setTimeout(() => setLoading(false), 800)
    }
    fetchTests()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getDaysUntil = (dateString) => {
    const now = new Date()
    const due = new Date(dateString)
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    return diff
  }

  const filteredTests = tests.filter(test => {
    if (filter === 'all') return true
    return test.status === filter
  })

  const pendingTests = tests.filter(t => t.status === 'pending')
  const completedTests = tests.filter(t => t.status === 'completed')

  return (
    <PagePreloader loading={loading}>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 pt-12 pb-8 rounded-b-3xl">
          <div className="flex items-center justify-between mb-4 animate-slide-in-right">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Tests & Exams</h1>
              <p className="text-orange-100 text-sm">Track your progress</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex-1 bg-white/20 px-4 py-3 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-orange-100">Pending</p>
              <p className="text-2xl font-bold text-white">{pendingTests.length}</p>
            </div>
            <div className="flex-1 bg-white/20 px-4 py-3 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-orange-100">Completed</p>
              <p className="text-2xl font-bold text-white">{completedTests.length}</p>
            </div>
          </div>
        </div>

        <div className="px-6 -mt-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            {['all', 'pending', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                  filter === tab
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tests List */}
          <div className="space-y-4">
            {filteredTests.map((test, index) => {
              const daysUntil = getDaysUntil(test.due_date)
              const isUrgent = daysUntil <= 3 && test.status === 'pending'
              
              return (
                <div 
                  key={test.id}
                  className={`card hover-lift cursor-pointer animate-slide-in-up ${
                    isUrgent ? 'border-2 border-red-500' : ''
                  }`}
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  onClick={() => navigate(`/exam/${test.id}`)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        test.status === 'completed'
                          ? 'bg-green-100'
                          : 'bg-gradient-to-br from-orange-500 to-red-600'
                      }`}>
                        {test.status === 'completed' ? (
                          <CheckCircle className="w-7 h-7 text-green-600" />
                        ) : (
                          <FileText className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{test.title}</h4>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          test.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : isUrgent
                            ? 'bg-red-100 text-red-700 animate-pulse'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {test.status === 'completed' ? 'Completed' : isUrgent ? 'Urgent' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    {test.status === 'completed' && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-xl">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="font-bold text-gray-900 text-sm">{test.score}%</span>
                      </div>
                    )}
                  </div>

                  {/* Test Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span>{test.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{test.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {formatDate(test.due_date)}</span>
                    </div>
                    {test.status === 'pending' && (
                      <div className={`flex items-center gap-2 text-sm font-bold ${
                        isUrgent ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        <Clock className="w-4 h-4" />
                        <span>{daysUntil > 0 ? `${daysUntil} days left` : 'Due today!'}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className={`w-full flex items-center justify-center gap-2 ${
                    test.status === 'completed' ? 'btn-secondary' : 'btn-primary'
                  }`}>
                    <Play className="w-4 h-4" />
                    {test.status === 'completed' ? 'Review Test' : 'Start Test'}
                  </button>
                </div>
              )
            })}

            {filteredTests.length === 0 && (
              <div className="text-center py-12 animate-scale-in">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600">No tests found</p>
              </div>
            )}
          </div>
        </div>

        <MobileNav active="tests" />
      </div>
    </PagePreloader>
  )
}

export default MobileTests
