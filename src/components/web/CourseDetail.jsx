import { useState } from 'react'
import WebSidebar from './WebSidebar'
import WebHeader from './WebHeader'
import { Play, Download, CheckCircle, Lock, Clock, FileText } from 'lucide-react'

const lessons = [
  { id: 1, title: 'Introduction to Organic Chemistry', duration: '15:30', completed: true, locked: false },
  { id: 2, title: 'Carbon Bonding Basics', duration: '22:45', completed: true, locked: false },
  { id: 3, title: 'Alkanes Structure', duration: '18:20', completed: false, locked: false },
  { id: 4, title: 'Nomenclature Rules', duration: '25:10', completed: false, locked: false },
  { id: 5, title: 'Isomerism Concepts', duration: '20:15', completed: false, locked: true },
]

const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState('lessons')

  return (
    <div className="flex">
      <WebSidebar />
      
      <div className="flex-1 ml-64">
        <WebHeader title="Course Details" />
        
        <div className="p-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="col-span-2">
              {/* Video Player */}
              <div className="card mb-6">
                <div className="w-full h-96 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary-600 ml-1" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Alkanes Structure</h2>
                <p className="text-gray-600 mb-4">Learn about the fundamental structure of alkanes and their properties in organic chemistry.</p>
                
                <div className="flex items-center gap-4">
                  <button className="btn-primary flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Continue Watching
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Materials
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="card">
                <div className="flex gap-4 border-b border-gray-200 mb-6">
                  {['lessons', 'materials', 'assignments'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 px-2 font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {activeTab === 'lessons' && (
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                          lesson.locked
                            ? 'bg-gray-50 opacity-60'
                            : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          lesson.completed
                            ? 'bg-success-100'
                            : lesson.locked
                            ? 'bg-gray-200'
                            : 'bg-primary-100'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5 text-success-600" />
                          ) : lesson.locked ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Play className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'materials' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900">Lecture Notes - Chapter 3.pdf</span>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="card mb-6">
                <div className="w-full h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-6xl">⚗️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Organic Chemistry</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">35%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Instructor</span>
                    <span className="font-medium text-gray-900">Dr. Sarah Johnson</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">12 hours</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lessons</span>
                    <span className="font-medium text-gray-900">24</span>
                  </div>
                </div>

                <button className="btn-primary w-full">Continue Course</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
