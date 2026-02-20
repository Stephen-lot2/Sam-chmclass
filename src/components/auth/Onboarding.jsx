import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, BookOpen, Video, Award } from 'lucide-react'

const onboardingSteps = [
  {
    icon: BookOpen,
    title: 'Learn Chemistry',
    description: 'Access comprehensive chemistry courses designed for secondary school students',
    color: 'from-primary-500 to-primary-600'
  },
  {
    icon: Video,
    title: 'Live Classes',
    description: 'Join interactive live sessions with expert chemistry teachers',
    color: 'from-secondary-500 to-secondary-600'
  },
  {
    icon: Award,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed analytics and achievements',
    color: 'from-success-500 to-success-600'
  }
]

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      navigate('/')
    }
  }

  const step = onboardingSteps[currentStep]
  const Icon = step.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-white to-pastel-purple flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className={`w-32 h-32 bg-gradient-to-br ${step.color} rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-card`}>
          <Icon className="w-16 h-16 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          {step.title}
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          {step.description}
        </p>

        <div className="flex justify-center gap-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? 'w-8 bg-primary-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
          {currentStep < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}
          <ChevronRight className="w-5 h-5" />
        </button>

        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full mt-4 text-gray-600 hover:text-gray-900 font-medium"
          >
            Back
          </button>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Skip
        </button>
      </div>
    </div>
  )
}

export default Onboarding
