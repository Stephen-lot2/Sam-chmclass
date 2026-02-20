import { useState, useEffect, useRef } from 'react'
import { 
  MessageSquare, 
  Send, 
  Search,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react'
import TeacherSidebar from './TeacherSidebar'
import { getCurrentUser, getAllStudents, getTeacherMessages, sendMessage } from '../../lib/supabase'

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    loadData()
    // Refresh messages every 5 seconds for real-time feel
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    if (selectedChat) {
      loadMessages()
    }
  }, [selectedChat])
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadData = async () => {
    try {
      const user = await getCurrentUser()
      setCurrentUser(user)
      
      if (user) {
        // Load all students as potential conversations
        const { data: students } = await getAllStudents()
        
        if (students && students.length > 0) {
          const formattedConversations = students.map(student => ({
            id: student.id,
            student: {
              name: student.full_name || student.email?.split('@')[0] || 'Student',
              email: student.email,
              avatar: student.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name || 'Student')}&background=3b82f6&color=fff`,
              status: 'online' // In real app, check last_seen
            },
            lastMessage: 'Start a conversation',
            timestamp: 'Now',
            unread: 0,
            messages: []
          }))
          setConversations(formattedConversations)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const loadMessages = async () => {
    if (!selectedChat || !currentUser) return
    
    try {
      const { data } = await getTeacherMessages(currentUser.id)
      
      if (data && data.length > 0) {
        // Filter messages for selected chat
        const chatMessages = data.filter(msg => 
          (msg.sender_id === currentUser.id && msg.recipient_id === selectedChat.id) ||
          (msg.sender_id === selectedChat.id && msg.recipient_id === currentUser.id)
        )
        
        // Format messages
        const formattedMessages = chatMessages.map(msg => ({
          id: msg.id,
          sender: msg.sender_id === currentUser.id ? 'teacher' : 'student',
          text: msg.message,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: msg.read
        }))
        
        setMessages(formattedMessages)
        
        // Update conversation last message
        if (formattedMessages.length > 0) {
          const lastMsg = formattedMessages[formattedMessages.length - 1]
          setConversations(prev => prev.map(conv => 
            conv.id === selectedChat.id 
              ? { ...conv, lastMessage: lastMsg.text, timestamp: lastMsg.time }
              : conv
          ))
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat || !currentUser || sending) return
    
    setSending(true)
    try {
      const { data, error } = await sendMessage(
        currentUser.id,
        [selectedChat.id],
        messageText,
        null
      )
      
      if (!error) {
        // Add message to local state immediately
        const newMessage = {
          id: Date.now(),
          sender: 'teacher',
          text: messageText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        }
        setMessages(prev => [...prev, newMessage])
        setMessageText('')
        
        // Update conversation
        setConversations(prev => prev.map(conv => 
          conv.id === selectedChat.id 
            ? { ...conv, lastMessage: messageText, timestamp: 'Just now' }
            : conv
        ))
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSending(false)
    }
  }
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const filteredConversations = conversations.filter(conv =>
    conv.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.student.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <TeacherSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col md:flex">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedChat?.id === conv.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={conv.student.avatar}
                    alt={conv.student.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    conv.student.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{conv.student.name}</h3>
                    <span className="text-xs text-gray-500">{conv.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {conv.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedChat.student.avatar}
                    alt={selectedChat.student.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    selectedChat.student.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedChat.student.name}</h3>
                  <p className="text-xs text-gray-500">
                    {selectedChat.student.status === 'online' ? '🟢 Online' : '⚪ Offline'}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length > 0 ? (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${msg.sender === 'teacher' ? 'order-2' : 'order-1'}`}>
                        <div className={`p-4 rounded-2xl ${
                          msg.sender === 'teacher'
                            ? 'bg-primary-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                          msg.sender === 'teacher' ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{msg.time}</span>
                          {msg.sender === 'teacher' && (
                            msg.read ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No messages yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start the conversation below</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t border-gray-200">
              <div className="flex items-end gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile size={20} className="text-gray-600" />
                </button>
                <div className="flex-1">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Type a message..."
                    className="input-field resize-none"
                    rows="2"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sending}
                  className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? <Clock size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">Choose a student from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
