import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, User, Mail, Calendar, Award, BookOpen, Clock, LogOut, Save, Edit } from 'lucide-react'
import MobileNav from './MobileNav'
import { useAuth } from '../../context/AuthContext'
import { uploadAvatar, updateUserProfile, signOut } from '../../lib/supabase'
import LoadingSpinner from '../common/LoadingSpinner'
import PagePreloader from '../common/PagePreloader'

const MobileProfile = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '')
  const [loading, setLoading] = useState(true)

  useState(() => {
    setTimeout(() => setLoading(false), 800)
  }, [])

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage('Image must be less than 2MB')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const { data, error } = await uploadAvatar(user.id, file)
      
      if (error) {
        setMessage('Failed to upload image')
      } else {
        setAvatarUrl(data.url)
        await updateUserProfile(user.id, { avatar_url: data.url })
        setMessage('Profile picture updated!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setMessage('Error uploading image')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setMessage('')

    try {
      const { error } = await updateUserProfile(user.id, { full_name: fullName })
      
      if (error) {
        setMessage('Failed to update profile')
      } else {
        setMessage('Profile updated successfully!')
        setUser({ ...user, user_metadata: { ...user.user_metadata, full_name: fullName } })
        setEditing(false)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      setMessage('Error updating profile')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    navigate('/login')
  }

  return (
    <PagePreloader loading={loading}>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header with Avatar */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 pt-12 pb-24 rounded-b-3xl relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 text-center">
            <h1 className="text-2xl font-bold text-white mb-8 animate-slide-in-up">My Profile</h1>
            
            {/* Avatar */}
            <div className="relative inline-block animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm border-4 border-white/30">
                {uploading ? (
                  <LoadingSpinner size="md" />
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                disabled={uploading}
              >
                <Camera className="w-5 h-5 text-primary-600" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="px-6 -mt-16 relative z-10">
          {message && (
            <div className={`mb-4 p-4 rounded-xl text-sm font-medium animate-slide-in-up ${
              message.includes('success') || message.includes('updated')
                ? 'bg-green-50 text-green-600 border-2 border-green-200'
                : 'bg-red-50 text-red-600 border-2 border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: BookOpen, label: 'Courses', value: '12', color: 'primary' },
              { icon: Award, label: 'Certificates', value: '8', color: 'success' },
              { icon: Clock, label: 'Study Time', value: '48h', color: 'secondary' }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`card bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 text-center animate-slide-in-up`}
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className={`w-10 h-10 bg-${stat.color}-500 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Profile Info Card */}
          <div className="card mb-4 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5 text-primary-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {editing ? (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-field pl-12"
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{fullName || 'Not set'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900 text-sm truncate">{user?.email}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900 text-sm">
                    {new Date(user?.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {editing && (
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="card w-full flex items-center justify-center gap-3 text-red-600 hover:bg-red-50 transition-colors animate-slide-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>

        <MobileNav active="profile" />
      </div>
    </PagePreloader>
  )
}

export default MobileProfile
