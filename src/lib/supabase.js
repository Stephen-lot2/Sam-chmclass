import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if credentials are provided
const hasCredentials = supabaseUrl && supabaseAnonKey && 
                       supabaseUrl !== '' && 
                       supabaseAnonKey !== '' &&
                       !supabaseUrl.includes('your_supabase')

if (!hasCredentials) {
  console.log('📝 Running in DEMO MODE (no Supabase)')
  console.log('✅ The app will work without authentication')
  console.log('💡 To enable Supabase: Update .env with your credentials')
} else {
  console.log('✅ Supabase connected!')
  console.log('🔗 URL:', supabaseUrl)
  console.log('🔑 Key:', supabaseAnonKey.substring(0, 20) + '...')
}

export const supabase = hasCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Auth helpers with fallback
export const signUp = async (email, password, fullName, additionalMetadata = {}) => {
  if (!supabase) {
    console.warn('Supabase not configured')
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        ...additionalMetadata
      },
      emailRedirectTo: undefined, // Disable email confirmation redirect
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  if (!supabase) {
    console.warn('Supabase not configured')
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signInWithOTP = async (email) => {
  if (!supabase) {
    console.warn('Supabase not configured')
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Only allow existing users
    }
  })
  return { data, error }
}

export const verifyOTP = async (email, token) => {
  if (!supabase) {
    console.warn('Supabase not configured')
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase) {
    return { error: null }
  }
  
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (!supabase) {
    return null
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database helpers with fallback
export const getCourses = async () => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getUserEnrollments = async (userId) => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', userId)
  return { data, error }
}

export const getLiveClasses = async () => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('live_classes')
    .select('*')
    .order('scheduled_at', { ascending: true })
  return { data, error }
}

export const getTests = async () => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .order('due_date', { ascending: true })
  return { data, error }
}

// Storage helpers for profile images
export const uploadAvatar = async (userId, file) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  try {
    // Get file extension
    const fileExt = file.name.split('.').pop().toLowerCase()
    const fileName = `${userId}/avatar.${fileExt}`
    
    // Delete old avatar if exists
    await supabase.storage
      .from('avatars')
      .remove([fileName])
    
    // Upload new avatar with cache control
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { 
        upsert: true,
        cacheControl: '0', // Disable caching for immediate updates
        contentType: file.type
      })
    
    if (error) {
      console.error('Upload error:', error)
      return { data: null, error }
    }
    
    // Get public URL with timestamp to bust cache
    const timestamp = new Date().getTime()
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(`${fileName}?t=${timestamp}`)
    
    return { data: { url: publicUrl }, error: null }
  } catch (err) {
    console.error('Upload exception:', err)
    return { data: null, error: err }
  }
}

// Update user profile with metadata
export const updateUserProfile = async (userId, updates) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }

  // Update auth.users metadata
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  })
  
  if (error) return { data: null, error }

  // Also update profiles table if it exists
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: updates.full_name,
        bio: updates.bio,
        specialization: updates.specialization,
        qualifications: updates.qualifications,
        experience_years: updates.experience_years,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
    
    if (profileError) console.warn('Profile table update warning:', profileError)
  } catch (err) {
    console.warn('Profile table not available:', err)
  }
  
  return { data, error: null }
}

export const getAvatarUrl = (userId) => {
  if (!supabase || !userId) return null
  
  // Add timestamp to bust cache
  const timestamp = new Date().getTime()
  
  // Try multiple extensions
  const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
  
  // Return first available (we'll use jpg as default but it will work for any)
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}/avatar.jpg?t=${timestamp}`)
  
  return data.publicUrl
}

// ============================================
// TEACHER PORTAL FUNCTIONS
// ============================================

// Get teacher dashboard stats
export const getTeacherStats = async (teacherId) => {
  if (!supabase) {
    return { 
      data: {
        totalStudents: 0,
        activeCourses: 0,
        pendingSubmissions: 0,
        totalRevenue: 0
      }, 
      error: null 
    }
  }
  
  try {
    // Get total students across all courses
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('user_id', { count: 'exact' })
      .in('course_id', 
        supabase.from('courses').select('id').eq('teacher_id', teacherId)
      )
    
    // Get active courses count
    const { count: coursesCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('teacher_id', teacherId)
      .eq('published', true)
    
    // Get pending submissions
    const { count: pendingCount } = await supabase
      .from('assignment_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'submitted')
      .in('assignment_id',
        supabase.from('assignments').select('id').eq('teacher_id', teacherId)
      )
    
    return {
      data: {
        totalStudents: enrollments?.length || 0,
        activeCourses: coursesCount || 0,
        pendingSubmissions: pendingCount || 0,
        totalRevenue: 0 // Placeholder
      },
      error: null
    }
  } catch (error) {
    return { data: null, error }
  }
}

// Get teacher's courses
export const getTeacherCourses = async (teacherId) => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      enrollments(count)
    `)
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Create new course
export const createCourse = async (courseData) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('courses')
    .insert([courseData])
    .select()
    .single()
  
  return { data, error }
}

// Update course
export const updateCourse = async (courseId, updates) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)
    .select()
    .single()
  
  return { data, error }
}

// Get teacher's students
export const getTeacherStudents = async (teacherId) => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      user:user_id(*),
      course:course_id(*)
    `)
    .in('course_id',
      supabase.from('courses').select('id').eq('teacher_id', teacherId)
    )
    .order('enrolled_at', { ascending: false })
  
  return { data, error }
}

// Create assignment
export const createAssignment = async (assignmentData) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('assignments')
    .insert([assignmentData])
    .select()
    .single()
  
  return { data, error }
}

// Get assignment submissions
export const getAssignmentSubmissions = async (assignmentId) => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('assignment_submissions')
    .select(`
      *,
      student:user_id(*)
    `)
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false })
  
  return { data, error }
}

// Grade submission
export const gradeSubmission = async (submissionId, score, feedback) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('assignment_submissions')
    .update({
      score,
      feedback,
      status: 'graded',
      graded_at: new Date().toISOString()
    })
    .eq('id', submissionId)
    .select()
    .single()
  
  return { data, error }
}

// Schedule live class
export const scheduleClass = async (classData) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('live_classes')
    .insert([classData])
    .select()
    .single()
  
  return { data, error }
}

// Get teacher's live classes
export const getTeacherLiveClasses = async (teacherId) => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('live_classes')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('scheduled_at', { ascending: false })
  
  return { data, error }
}

// Get student's available live classes
export const getStudentLiveClasses = async () => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('live_classes')
    .select(`
      *,
      teacher:teacher_id(*)
    `)
    .eq('is_public', true)
    .order('scheduled_at', { ascending: true })
  
  return { data, error }
}

// Update live class status
export const updateLiveClassStatus = async (classId, status) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('live_classes')
    .update({ status })
    .eq('id', classId)
    .select()
    .single()
  
  return { data, error }
}

// Create announcement
export const createAnnouncement = async (announcementData) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('announcements')
    .insert([announcementData])
    .select()
    .single()
  
  return { data, error }
}

// Get teacher analytics
export const getTeacherAnalytics = async (teacherId) => {
  if (!supabase) {
    return { data: null, error: null }
  }
  
  // This would include complex analytics queries
  // Placeholder for now
  return { data: {}, error: null }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

// Create notification for students
export const createNotification = async (userId, type, title, message, link = null) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      type,
      title,
      message,
      link,
      read: false
    }])
    .select()
    .single()
  
  return { data, error }
}

// Create notifications for multiple students
export const createBulkNotifications = async (userIds, type, title, message, link = null) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const notifications = userIds.map(userId => ({
    user_id: userId,
    type,
    title,
    message,
    link,
    read: false
  }))
  
  const { data, error } = await supabase
    .from('notifications')
    .insert(notifications)
    .select()
  
  return { data, error }
}

// Get user notifications
export const getUserNotifications = async (userId) => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
  
  return { data, error }
}

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single()
  
  return { data, error }
}

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
  
  return { data, error }
}

// Get unread notification count
export const getUnreadNotificationCount = async (userId) => {
  if (!supabase) {
    return { count: 0, error: null }
  }
  
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)
  
  return { count, error }
}

// ============================================
// ENHANCED TEACHER FUNCTIONS WITH NOTIFICATIONS
// ============================================

// Create assignment with notifications
export const createAssignmentWithNotifications = async (assignmentData) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  try {
    // Create assignment first
    console.log('Creating assignment with data:', assignmentData)
    const { data: assignment, error: assignmentError } = await createAssignment(assignmentData)
    
    if (assignmentError) {
      console.error('Assignment creation error:', assignmentError)
      return { data: null, error: assignmentError }
    }
    
    console.log('Assignment created successfully:', assignment)
    
    // Try to get enrolled students (optional - don't fail if no enrollments)
    try {
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('user_id')
        .eq('course_id', assignmentData.course_id)
        .eq('status', 'active')
      
      if (enrollmentError) {
        console.warn('Could not fetch enrollments:', enrollmentError)
      } else if (enrollments && enrollments.length > 0) {
        // Create notifications for all students
        const studentIds = enrollments.map(e => e.user_id)
        console.log('Creating notifications for students:', studentIds)
        
        const { error: notificationError } = await createBulkNotifications(
          studentIds,
          'assignment',
          'New Assignment',
          `New assignment: ${assignmentData.title}`,
          `/assignments/${assignment.id}`
        )
        
        if (notificationError) {
          console.warn('Could not create notifications:', notificationError)
        } else {
          console.log('Notifications created successfully')
        }
      } else {
        console.log('No enrolled students found for course:', assignmentData.course_id)
      }
    } catch (notifError) {
      console.warn('Notification creation failed (non-critical):', notifError)
    }
    
    return { data: assignment, error: null }
  } catch (error) {
    console.error('Unexpected error in createAssignmentWithNotifications:', error)
    return { data: null, error: { message: error.message || 'Unknown error occurred' } }
  }
}

// Create test with notifications
export const createTestWithNotifications = async (testData) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  try {
    // Create test first
    console.log('Creating test with data:', testData)
    const { data, error } = await supabase
      .from('tests')
      .insert([testData])
      .select()
      .single()
    
    if (error) {
      console.error('Test creation error:', error)
      return { data: null, error }
    }
    
    console.log('Test created successfully:', data)
    
    // Try to get enrolled students (optional - don't fail if no enrollments)
    try {
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('user_id')
        .eq('course_id', testData.course_id)
        .eq('status', 'active')
      
      if (enrollmentError) {
        console.warn('Could not fetch enrollments:', enrollmentError)
      } else if (enrollments && enrollments.length > 0) {
        // Create notifications for all students
        const studentIds = enrollments.map(e => e.user_id)
        console.log('Creating notifications for students:', studentIds)
        
        const { error: notificationError } = await createBulkNotifications(
          studentIds,
          'test',
          'New Test Available',
          `New test: ${testData.title}`,
          `/tests/${data.id}`
        )
        
        if (notificationError) {
          console.warn('Could not create notifications:', notificationError)
        } else {
          console.log('Notifications created successfully')
        }
      } else {
        console.log('No enrolled students found for course:', testData.course_id)
      }
    } catch (notifError) {
      console.warn('Notification creation failed (non-critical):', notifError)
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in createTestWithNotifications:', error)
    return { data: null, error: { message: error.message || 'Unknown error occurred' } }
  }
}
      await createBulkNotifications(
        studentIds,
        'test',
        'New Test Available',
        `New test: ${testData.title}`,
        `/tests/${data.id}`
      )
    }
    
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Schedule live class with notifications
export const scheduleClassWithNotifications = async (classData) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  try {
    // Schedule class
    const { data, error } = await scheduleClass(classData)
    if (error) return { data: null, error }
    
    // Get enrolled students
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('user_id')
      .eq('course_id', classData.course_id)
      .eq('status', 'active')
    
    if (enrollments && enrollments.length > 0) {
      // Create notifications for all students
      const studentIds = enrollments.map(e => e.user_id)
      const classDate = new Date(classData.scheduled_at).toLocaleString()
      await createBulkNotifications(
        studentIds,
        'live_class',
        'New Live Class Scheduled',
        `${classData.title} - ${classDate}`,
        `/live-classes/${data.id}`
      )
    }
    
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Send message to student(s)
export const sendMessage = async (teacherId, recipientIds, message, subject = null) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const messages = recipientIds.map(recipientId => ({
    sender_id: teacherId,
    recipient_id: recipientId,
    subject,
    message,
    read: false,
    created_at: new Date().toISOString()
  }))
  
  const { data, error } = await supabase
    .from('messages')
    .insert(messages)
    .select()
  
  return { data, error }
}

// Get messages for teacher
export const getTeacherMessages = async (teacherId) => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(*),
      recipient:recipient_id(*)
    `)
    .or(`sender_id.eq.${teacherId},recipient_id.eq.${teacherId}`)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Block/Unblock student
export const updateStudentStatus = async (teacherId, studentId, status) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('teacher_students')
    .update({ status })
    .eq('teacher_id', teacherId)
    .eq('student_id', studentId)
    .select()
    .single()
  
  return { data, error }
}

// Get student activity log
export const getStudentActivity = async (studentId, courseId = null) => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  let query = supabase
    .from('student_activity')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
  
  if (courseId) {
    query = query.eq('course_id', courseId)
  }
  
  const { data, error } = await query
  
  return { data, error }
}

// Send announcement to students
export const sendAnnouncement = async (announcementData) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('announcements')
    .insert([announcementData])
    .select()
    .single()
  
  // Also create notifications for students
  if (data && !error) {
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('user_id')
      .eq('course_id', announcementData.course_id)
    
    if (enrollments) {
      const notifications = enrollments.map(enrollment => ({
        user_id: enrollment.user_id,
        type: 'announcement',
        title: announcementData.title,
        message: announcementData.content,
        link: `/announcements/${data.id}`,
        read: false
      }))
      
      await supabase.from('notifications').insert(notifications)
    }
  }
  
  return { data, error }
}

// Control student access to course
export const updateCourseAccess = async (enrollmentId, hasAccess) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase not configured' } }
  }
  
  const { data, error } = await supabase
    .from('enrollments')
    .update({ 
      status: hasAccess ? 'active' : 'suspended',
      updated_at: new Date().toISOString()
    })
    .eq('id', enrollmentId)
    .select()
    .single()
  
  return { data, error }
}

// Get student progress details
export const getStudentProgress = async (studentId, courseId) => {
  if (!supabase) {
    return { data: null, error: null }
  }
  
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      course:course_id(*),
      completed_lessons:lesson_progress(count)
    `)
    .eq('user_id', studentId)
    .eq('course_id', courseId)
    .single()
  
  return { data, error }
}

// Get all profiles (students and teachers)
export const getAllProfiles = async () => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

// Get students only (role = 'student')
export const getAllStudents = async () => {
  if (!supabase) {
    return { data: [], error: null }
  }
  
  // Try to get from profiles table first
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })
  
  return { data, error }
}
