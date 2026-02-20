import { useState } from 'react'
import { User, Mail, Lock, Bell, Shield } from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'

const TeacherSettings = () => {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {/* Tabs */}
            <div className="col-span-1 md:col-span-1">
              <div className="card flex md:flex-col overflow-x-auto md:overflow-x-visible gap-2 md:gap-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} className="md:w-5 md:h-5" />
                      <span className="font-medium text-sm md:text-base">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Content */}
            <div className="col-span-1 md:col-span-3">
              <div className="card">
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" className="input-field" placeholder="Dr. John Smith" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea className="input-field min-h-[100px]" placeholder="Tell students about yourself..." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                        <input type="text" className="input-field" placeholder="Organic Chemistry" />
                      </div>
                      <button className="btn-primary">Save Changes</button>
                    </div>
                  </div>
                )}

                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" className="input-field" placeholder="teacher@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input type="tel" className="input-field" placeholder="+1 234 567 8900" />
                      </div>
                      <button className="btn-primary">Update Account</button>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input type="password" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input type="password" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input type="password" className="input-field" />
                      </div>
                      <button className="btn-primary">Change Password</button>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                    <div className="space-y-4">
                      {[
                        { label: 'Email notifications', description: 'Receive email updates' },
                        { label: 'New student enrollments', description: 'Get notified when students enroll' },
                        { label: 'Assignment submissions', description: 'Alert when students submit work' },
                        { label: 'Class reminders', description: 'Reminders before live classes' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                          <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary-600" defaultChecked />
                        </div>
                      ))}
                      <button className="btn-primary">Save Preferences</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherSettings
