import { useState } from 'react'
import WebSidebar from './WebSidebar'
import WebHeader from './WebHeader'
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react'

const questions = [
  {
    id: 1,
    type: 'mcq',
    question: 'What is the molecular formula of methane?',
    options: ['CH4', 'C2H6', 'C3H8', 'C4H10'],
    answer: null
  },
  {
    id: 2,
    type: 'mcq',
    question: 'Which element has the atomic number 6?',
    options: ['Oxygen', 'Carbon', 'Nitrogen', 'Hydrogen'],
    answer: null
  },
  {
    id: 3,
    type: 'true-false',
    question: 'Water is a compound made of hydrogen and oxygen.',
    answer: null
  },
  {
    id: 4,
    type: 'essay',
    question: 'Explain the process of photosynthesis in plants.',
    answer: ''
  },
]

const ExamInterface = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(questions)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes

  const question = answers[currentQuestion]

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex">
      <WebSidebar />
      
      <div className="flex-1 ml-64">
        <WebHeader title="Exam" />
        
        <div className="p-8">
          {/* Timer Bar */}
          <div className="card bg-gradient-to-r from-orange-500 to-red-500 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-xl font-bold mb-1">Organic Chemistry Quiz</h2>
                <p className="text-orange-100 text-sm">20 questions • 30 minutes</p>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
                <span className="text-white text-2xl font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {/* Question Area */}
            <div className="col-span-3">
              <div className="card mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question {currentQuestion + 1} of {questions.length}
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium">
                    <Flag className="w-4 h-4" />
                    Flag for Review
                  </button>
                </div>

                <div className="mb-8">
                  <p className="text-lg text-gray-900 mb-6">{question.question}</p>

                  {question.type === 'mcq' && (
                    <div className="space-y-3">
                      {question.options.map((option, index) => (
                        <button
                          key={index}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                            question.answer === option
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-primary-300'
                          }`}
                          onClick={() => {
                            const newAnswers = [...answers]
                            newAnswers[currentQuestion].answer = option
                            setAnswers(newAnswers)
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              question.answer === option
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-gray-300'
                            }`}>
                              {question.answer === option && (
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="flex gap-4">
                      {['True', 'False'].map((option) => (
                        <button
                          key={option}
                          className={`flex-1 p-4 rounded-xl border-2 font-medium transition-colors ${
                            question.answer === option
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 text-gray-700 hover:border-primary-300'
                          }`}
                          onClick={() => {
                            const newAnswers = [...answers]
                            newAnswers[currentQuestion].answer = option
                            setAnswers(newAnswers)
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === 'essay' && (
                    <textarea
                      className="w-full h-48 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-400 focus:outline-none resize-none"
                      placeholder="Type your answer here..."
                      value={question.answer}
                      onChange={(e) => {
                        const newAnswers = [...answers]
                        newAnswers[currentQuestion].answer = e.target.value
                        setAnswers(newAnswers)
                      }}
                    />
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestion(currentQuestion + 1)}
                      className="flex items-center gap-2 btn-primary"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="btn-primary">
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Question Navigator */}
            <div className="card h-fit">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-full aspect-square rounded-lg font-medium text-sm transition-colors ${
                      index === currentQuestion
                        ? 'bg-primary-500 text-white'
                        : q.answer
                        ? 'bg-success-100 text-success-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Answered</span>
                  <span className="font-medium text-gray-900">
                    {answers.filter(q => q.answer).length}/{questions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-medium text-gray-900">
                    {questions.length - answers.filter(q => q.answer).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamInterface
