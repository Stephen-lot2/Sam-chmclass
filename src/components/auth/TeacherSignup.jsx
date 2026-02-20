import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, BookOpen, Award, Briefcase, FileText } from 'lucide-react'
import { signUp } from '../../lib/supabase'
import LoadingSpinner from '../common/LoadingSpinner'

const TeacherSignup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  
  // Step 1: Basic Info
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  
  // Step 2: Professional Info
  const [specialization, setSpecialization] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [qualifications, setQualifications] = useState('')
  const [bio, setBio] = useState('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStep1 = (e) => {
    e.preventDefault()
    if (!email || !password || !fullName) {
      setError('Please fill all fields')
      return
    }
    setError('')
    setStep(2)
  }

  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Create basic account first
      const { data, error } = await signUp(email, password, fullName, {
        role: 'teacher',
        specialization,
        experience_years: parseInt(experienceYears) || 0,
        bio
      })
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setError('This email is already registered. Please login instead.')
        } else if (error.message.includes('Email rate limit exceeded')) {
          setError('Too many signup attempts. Please try again in a few minutes.')
        } else {
          setError(error.message)
        }
      } else {
        alert('Teacher account created successfully! You can now login.')
        navigate('/login')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-green via-pastel-blue to-primary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-success-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="card hover-lift animate-scale-in backdrop-blur-sm bg-white/95">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-success-500 to-primary-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl animate-bounce-in">
              <span className="text-3xl">👨‍🏫</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as a Teacher</h1>
            <p className="text-gray-600">Share your knowledge and inspire students</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Basic Info</span>
              </div>
              <div className="w-12 h-1 bg-gray-200">
                <div className={`h-full bg-primary-500 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Professional</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm animate-scale-in">
              {error}
            </div>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="animate-slide-in-right">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Dr. John Smith"
                    className="input-field pl-12"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="email" 
                    placeholder="teacher@example.com"
                    className="input-field pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
                Continue to Professional Info
              </button>
            </form>
          )}

          {/* Step 2: Professional Information */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="animate-slide-in-right">
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="e.g., Organic Chemistry, Physics"
                    className="input-field pl-12"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="number" 
                    placeholder="5"
                    className="input-field pl-12"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications (comma-separated)</label>
                <div className="relative">
                  <Award className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                  <textarea 
                    placeholder="PhD in Chemistry, MSc in Education, Certified Teacher"
                    className="input-field pl-12 min-h-[80px]"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                  <textarea 
                    placeholder="Tell students about yourself, your teaching style, and experience..."
                    className="input-field pl-12 min-h-[120px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="btn-primary flex-1"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Create Teacher Account'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
            {' • '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Join as Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherSignup
