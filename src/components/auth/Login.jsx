import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, GraduationCap, BookOpen } from 'lucide-react'
import { signIn } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginAs, setLoginAs] = useState('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await signIn(email, password)
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check and try again.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before logging in.')
        } else {
          setError(error.message)
        }
      } else if (data?.user) {
        setUser(data.user)
        
        // Check user role and redirect
        const userRole = data.user.user_metadata?.role || 'student'
        if (loginAs === 'teacher') {
          if (userRole === 'teacher') {
            navigate('/teacher/dashboard')
          } else {
            setError('You don\'t have teacher access. Please login as a student or create a teacher account.')
          }
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-pastel-blue to-pastel-purple flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-72 h-72 bg-pastel-purple rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="card hover-lift animate-scale-in backdrop-blur-sm bg-white/95">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl animate-bounce-in">
                <span className="text-3xl">🧪</span>
              </div>
              <div className="absolute -top-2 -right-2 animate-pulse">
                <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-slide-in-up">Welcome Back!</h1>
            <p className="text-gray-600 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>Sign in to continue your chemistry journey</p>
          </div>

          {/* Login As Selection */}
          <div className="mb-6 animate-slide-in-up" style={{ animationDelay: '0.15s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">Login as</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLoginAs('student')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  loginAs === 'student'
                    ? 'border-primary-500 bg-primary-50 scale-105'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <BookOpen className={`w-8 h-8 mx-auto mb-2 ${
                  loginAs === 'student' ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <p className={`font-medium text-sm ${
                  loginAs === 'student' ? 'text-primary-600' : 'text-gray-600'
                }`}>Student</p>
              </button>
              <button
                type="button"
                onClick={() => setLoginAs('teacher')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  loginAs === 'teacher'
                    ? 'border-success-500 bg-success-50 scale-105'
                    : 'border-gray-200 hover:border-success-300'
                }`}
              >
                <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
                  loginAs === 'teacher' ? 'text-success-600' : 'text-gray-400'
                }`} />
                <p className={`font-medium text-sm ${
                  loginAs === 'teacher' ? 'text-success-600' : 'text-gray-600'
                }`}>Teacher</p>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm animate-scale-in flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="student@example.com"
                  className="input-field pl-12 hover:border-primary-300 focus:scale-[1.02] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-12 pr-12 hover:border-primary-300 focus:scale-[1.02] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all" />
                <span className="ml-2 text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <Link to="/reset-password" className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-all">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full animate-slide-in-up relative overflow-hidden group" 
              style={{ animationDelay: '0.5s' }}
              disabled={loading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  `Sign In as ${loginAs === 'teacher' ? 'Teacher' : 'Student'}`
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            Don't have an account?{' '}
            {loginAs === 'teacher' ? (
              <Link to="/teacher-signup" className="text-success-600 hover:text-success-700 font-medium hover:underline transition-all">
                Join as Teacher
              </Link>
            ) : (
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-all">
                Sign up as Student
              </Link>
            )}
          </div>

          <div className="mt-4 text-center animate-slide-in-up" style={{ animationDelay: '0.7s' }}>
            <Link 
              to="/login-otp" 
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium hover:scale-105 transition-all"
            >
              🔐 Login with OTP instead
            </Link>
          </div>
        </div>

        {/* Footer Animation */}
        <div className="mt-8 text-center text-sm text-gray-600 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
          <p className="flex items-center justify-center gap-2">
            <span>Powered by</span>
            <span className="font-semibold text-primary-600">Samuel ChemLab</span>
            <span className="animate-pulse">✨</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
