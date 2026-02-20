import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import WebSidebar from './WebSidebar'
import WebHeader from './WebHeader'
import { Bell, Check, Trash2, Calendar } from 'lucide-react'
import PagePreloader from '../common/PagePreloader'
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, getCurrentUser } from '../../lib/supabase'

const Notifications = () => {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        navigate('/login')
        return
      }

      const { data } = await getUserNotifications(user.id)
      if (data) {
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      await markNotificationAsRead(notification.id)
      await loadNotifications()
    }

    // Navigate to link if exists
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        await markAllNotificationsAsRead(user.id)
        await loadNotifications()
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      assignment: '📝',
      test: '📋',
      live_class: '🎥',
      announcement: '📢',
      message: '💬',
      grade: '⭐'
    }
    return icons[type] || '🔔'
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(date).toLocaleDateString()
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <PagePreloader loading={loading}>
      <div className="flex">
        <WebSidebar />
        
        <div className="flex-1 ml-64">
          <WebHeader title="Notifications" />
          
          <div className="p-8">
            {/* Header Section */}
            <div className="card bg-gradient-to-r from-primary-500 to-secondary-600 text-white mb-8 animate-slide-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Notifications</h2>
                  <p className="text-primary-100">Stay updated with your courses and activities</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <p className="text-sm">Unread</p>
                      <p className="text-2xl font-bold">{unreadCount}</p>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <p className="text-sm">Total</p>
                      <p className="text-2xl font-bold">{notifications.length}</p>
                    </div>
                  </div>
                </div>
                <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float">
                  <Bell className="w-12 h-12" />
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between mb-6 animate-slide-in-right">
              <div className="flex gap-2">
                {['all', 'unread', 'read'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      filter === tab
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Check size={18} />
                  Mark All as Read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`card hover-lift cursor-pointer animate-slide-in-up ${
                      !notification.read ? 'border-l-4 border-primary-500 bg-primary-50/50' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                        !notification.read 
                          ? 'bg-gradient-to-br from-primary-500 to-secondary-500' 
                          : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className={`font-bold text-lg ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-3 h-3 bg-primary-600 rounded-full flex-shrink-0 mt-1 animate-pulse"></span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {getTimeAgo(notification.created_at)}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.type === 'assignment' ? 'bg-warning-100 text-warning-700' :
                            notification.type === 'test' ? 'bg-primary-100 text-primary-700' :
                            notification.type === 'live_class' ? 'bg-purple-100 text-purple-700' :
                            notification.type === 'announcement' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 animate-scale-in">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-2">No notifications found</p>
                  <p className="text-sm text-gray-500">
                    {filter === 'unread' 
                      ? "You're all caught up!" 
                      : "You'll be notified about new assignments, tests, and announcements"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PagePreloader>
  )
}

export default Notifications
