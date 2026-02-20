import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { uploadAvatar, updateUserProfile, signOut } from '../../lib/supabase'
import WebSidebar from './WebSidebar'
import WebHeader from './WebHeader'
import { Camera, User, Mail, Calendar, Award, BookOpen, Clock, LogOut, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'

const WebProfile = () => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '')

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
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
        // Update local user state
        setUser({ ...user, user_metadata: { ...user.user_metadata, full_name: fullName } })
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
    <div className="flex">
      <WebSidebar />
      
      <div className="flex-1 ml-64">
        <WebHeader title="My Profile" />
        
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header Card */}
            <div className="card mb-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
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
                
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{fullName || 'Student'}</h2>
                  <p className="text-primary-100 mb-4">{user?.email}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(user?.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl ${
                message.includes('success') || message.includes('updated')
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Stats Cards */}
              <div className="card bg-gradient-to-br from-primary-50 to-primary-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">Courses</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-success-50 to-success-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-success-500 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-gray-600">Certificates</p>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-secondary-50 to-secondary-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">48h</p>
                    <p className="text-sm text-gray-600">Study Time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="input-field pl-12 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebProfile
