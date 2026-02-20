import { useState, useEffect } from 'react'
import { Camera, Save, X, Mail, Phone, MapPin, Award, BookOpen, Users, Edit2 } from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import PagePreloader from '../common/PagePreloader'
import { getCurrentUser, uploadAvatar, updateUserProfile, getAvatarUrl } from '../../lib/supabase'

const TeacherProfile = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    specialization: '',
    qualifications: '',
    experience_years: '',
    location: ''
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setFormData({
          full_name: currentUser.user_metadata?.full_name || '',
          email: currentUser.email || '',
          phone: currentUser.user_metadata?.phone || '',
          bio: currentUser.user_metadata?.bio || '',
          specialization: currentUser.user_metadata?.specialization || '',
          qualifications: currentUser.user_metadata?.qualifications?.join(', ') || '',
          experience_years: currentUser.user_metadata?.experience_years || '',
          location: currentUser.user_metadata?.location || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, GIF, or WebP)')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Compress and resize image
    try {
      const compressedFile = await compressImage(file)
      
      // Create preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(compressedFile)
      
      setAvatarFile(compressedFile)
    } catch (error) {
      console.error('Image processing error:', error)
      alert('Failed to process image. Please try another file.')
    }
  }

  // Compress image to reduce file size
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Max dimensions
          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          
          let width = img.width
          let height = img.height
          
          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                resolve(compressedFile)
              } else {
                reject(new Error('Canvas to Blob conversion failed'))
              }
            },
            'image/jpeg',
            0.85 // 85% quality
          )
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let avatarUploaded = false

      // Upload avatar first if changed
      if (avatarFile && user) {
        const { error: uploadError } = await uploadAvatar(user.id, avatarFile)
        if (uploadError) {
          console.error('Avatar upload error:', uploadError)
          alert(`Failed to upload avatar: ${uploadError.message}`)
          setSaving(false)
          return
        }
        avatarUploaded = true
      }

      // Update profile metadata
      const updates = {
        full_name: formData.full_name,
        phone: formData.phone,
        bio: formData.bio,
        specialization: formData.specialization,
        qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q),
        experience_years: parseInt(formData.experience_years) || 0,
        location: formData.location
      }

      const { error } = await updateUserProfile(user.id, updates)
      
      if (error) {
        console.error('Profile update error:', error)
        alert(`Failed to update profile: ${error.message}`)
      } else {
        // Success - show message and refresh
        const message = avatarUploaded 
          ? 'Profile and avatar updated successfully!' 
          : 'Profile updated successfully!'
        alert(message)
        
        setIsEditing(false)
        setAvatarFile(null)
        setAvatarPreview(null)
        
        // Reload profile to get fresh data
        await loadProfile()
        
        // Force page refresh to show new avatar
        if (avatarUploaded) {
          window.location.reload()
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      alert(`An error occurred: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PagePreloader />

  const currentAvatar = avatarPreview || getAvatarUrl(user?.id) || 
    `https://ui-avatars.com/api/?name=${formData.full_name || 'Teacher'}&background=10b981&color=fff&size=200`

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-sm md:text-base text-gray-600">Manage your personal information</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <Edit2 size={20} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setAvatarPreview(null)
                    setAvatarFile(null)
                    loadProfile()
                  }}
                  className="btn-secondary flex-1 md:flex-none"
                >
                  <X size={20} className="inline mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1 md:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={20} className="inline mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <img
                    src={currentAvatar}
                    alt="Profile"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-success-400 shadow-lg object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${formData.full_name || 'Teacher'}&background=10b981&color=fff&size=200`
                    }}
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 md:w-12 md:h-12 bg-success-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-success-700 transition-colors shadow-lg hover:scale-110">
                      <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {avatarPreview && isEditing && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-500 rounded-full flex items-center justify-center animate-bounce">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {formData.full_name || 'Teacher Name'}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  {formData.specialization || 'Specialization'}
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="w-5 h-5 text-success-600" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-600">Courses</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Award className="w-5 h-5 text-warning-600" />
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Dr. John Smith"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.full_name || 'Not set'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <p className="text-gray-900 py-2 bg-gray-50 px-4 rounded-lg">
                      {formData.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="+1 234 567 8900"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.phone || 'Not set'}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="New York, USA"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.location || 'Not set'}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        className="input-field min-h-[100px]"
                        placeholder="Tell students about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.bio || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="card mt-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
                  Professional Information
                </h3>
                
                <div className="space-y-4">
                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Organic Chemistry"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.specialization || 'Not set'}</p>
                    )}
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualifications
                    </label>
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="qualifications"
                          value={formData.qualifications}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="PhD in Chemistry, MSc in Education"
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate multiple qualifications with commas</p>
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {formData.qualifications ? (
                          formData.qualifications.split(',').map((qual, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                            >
                              {qual.trim()}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-900 py-2">Not set</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="experience_years"
                        value={formData.experience_years}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="5"
                        min="0"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {formData.experience_years ? `${formData.experience_years} years` : 'Not set'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherProfile
