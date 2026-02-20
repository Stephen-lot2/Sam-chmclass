import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DailyIframe from '@daily-co/daily-js'
import WebSidebar from './WebSidebar'
import WebHeader from './WebHeader'
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Hand, 
  MessageSquare, 
  Users, 
  Send,
  PhoneOff,
  Settings,
  Monitor,
  Maximize
} from 'lucide-react'

const LiveClassRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Daily.co room URL - using the provided URL
  const roomUrl = 'https://samuel-chemlab.daily.co/chemistry-class'
  
  const [callFrame, setCallFrame] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [participants, setParticipants] = useState([])
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'System', message: 'Welcome to the live class!', time: new Date().toLocaleTimeString() }
  ])

  // Initialize Daily.co call
  useEffect(() => {
    if (!callFrame && isJoined) {
      const frame = DailyIframe.createFrame(document.getElementById('daily-video-container'), {
        showLeaveButton: false,
        showFullscreenButton: true,
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '12px'
        }
      })
      
      setCallFrame(frame)
      
      // Join the room
      frame.join({ url: roomUrl })
        .then(() => {
          console.log('Joined room successfully')
        })
        .catch((error) => {
          console.error('Error joining room:', error)
          alert('Failed to join the live class. Please try again.')
        })

      // Event listeners
      frame.on('joined-meeting', () => {
        console.log('Meeting joined')
      })

      frame.on('participant-joined', (event) => {
        console.log('Participant joined:', event.participant)
        updateParticipants(frame)
      })

      frame.on('participant-left', (event) => {
        console.log('Participant left:', event.participant)
        updateParticipants(frame)
      })

      frame.on('left-meeting', () => {
        console.log('Left meeting')
        setIsJoined(false)
        navigate('/live-classes')
      })

      return () => {
        if (frame) {
          frame.destroy()
        }
      }
    }
  }, [isJoined, callFrame, roomUrl, navigate])

  const updateParticipants = (frame) => {
    if (frame) {
      const participantsList = frame.participants()
      const participantsArray = Object.values(participantsList)
      setParticipants(participantsArray)
    }
  }

  const handleJoinClass = () => {
    setIsJoined(true)
  }

  const handleToggleMute = () => {
    if (callFrame) {
      callFrame.setLocalAudio(!isMuted)
      setIsMuted(!isMuted)
    }
  }

  const handleToggleVideo = () => {
    if (callFrame) {
      callFrame.setLocalVideo(!isVideoOff)
      setIsVideoOff(!isVideoOff)
    }
  }

  const handleLeaveClass = () => {
    if (callFrame) {
      callFrame.leave()
    } else {
      navigate('/live-classes')
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        user: 'You',
        message: message.trim(),
        time: new Date().toLocaleTimeString()
      }
      setChatMessages([...chatMessages, newMessage])
      
      // Send via Daily.co app message
      if (callFrame) {
        callFrame.sendAppMessage({ message: message.trim() }, '*')
      }
      
      setMessage('')
    }
  }

  const handleRaiseHand = () => {
    if (callFrame) {
      callFrame.sendAppMessage({ type: 'raise-hand' }, '*')
      alert('Hand raised! The instructor will be notified.')
    }
  }

  // Pre-join screen
  if (!isJoined) {
    return (
      <div className="flex">
        <WebSidebar />
        
        <div className="flex-1 ml-64">
          <WebHeader title="Join Live Class" />
          
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-pastel-blue to-pastel-purple flex items-center justify-center p-8">
            <div className="card max-w-2xl w-full animate-scale-in">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Chemistry Live Class</h1>
                <p className="text-gray-600">Get ready to join the live session</p>
              </div>

              <div className="space-y-6">
                {/* Preview */}
                <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl">👨‍🎓</span>
                    </div>
                    <p className="text-white font-semibold">Your Video Preview</p>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isMuted
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isMuted ? <MicOff className="w-6 h-6 text-red-600" /> : <Mic className="w-6 h-6 text-gray-700" />}
                      <span className={isMuted ? 'text-red-600 font-medium' : 'text-gray-700'}>
                        {isMuted ? 'Microphone Off' : 'Microphone On'}
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isVideoOff
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isVideoOff ? <VideoOff className="w-6 h-6 text-red-600" /> : <Video className="w-6 h-6 text-gray-700" />}
                      <span className={isVideoOff ? 'text-red-600 font-medium' : 'text-gray-700'}>
                        {isVideoOff ? 'Camera Off' : 'Camera On'}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Join Button */}
                <button
                  onClick={handleJoinClass}
                  className="btn-primary w-full py-4 text-lg font-semibold"
                >
                  Join Live Class Now
                </button>

                <button
                  onClick={() => navigate('/live-classes')}
                  className="btn-secondary w-full"
                >
                  Back to Classes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Live class room
  return (
    <div className="flex">
      <WebSidebar />
      
      <div className="flex-1 ml-64">
        <WebHeader title="Live Class - Chemistry" />
        
        <div className="p-8">
          <div className="grid grid-cols-4 gap-6">
            {/* Main Video Area */}
            <div className="col-span-3">
              <div className="card mb-6">
                {/* Daily.co Video Container */}
                <div 
                  id="daily-video-container" 
                  className="w-full h-[500px] bg-gray-900 rounded-xl mb-4 relative overflow-hidden"
                >
                  {/* Live Indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 px-3 py-2 rounded-lg z-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-semibold">LIVE</span>
                  </div>

                  {/* Participants Count */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg z-10">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-semibold">{participants.length} in class</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleToggleMute}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all hover:scale-105 ${
                      isMuted ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={handleToggleVideo}
                    className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all hover:scale-105 ${
                      isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                  >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                  </button>

                  <button 
                    onClick={handleRaiseHand}
                    className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center hover:bg-primary-200 transition-all hover:scale-105"
                    title="Raise hand"
                  >
                    <Hand className="w-6 h-6" />
                  </button>

                  <button 
                    className="w-14 h-14 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all hover:scale-105"
                    title="Settings"
                  >
                    <Settings className="w-6 h-6" />
                  </button>

                  <div className="flex-1"></div>

                  <button 
                    onClick={handleLeaveClass}
                    className="px-8 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <PhoneOff className="w-5 h-5" />
                    Leave Class
                  </button>
                </div>
              </div>

              {/* Class Info */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  Participants ({participants.length})
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {participants.length > 0 ? (
                    participants.map((participant, index) => (
                      <div key={participant.session_id || index} className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="w-12 h-12 bg-primary-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-2xl">
                            {participant.owner ? '👨‍🏫' : '👨‍🎓'}
                          </span>
                        </div>
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {participant.user_name || 'Guest'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {participant.owner ? 'Instructor' : 'Student'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Waiting for participants to join...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Sidebar */}
            <div className="card flex flex-col h-[calc(100vh-12rem)]">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <MessageSquare className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="animate-slide-in-up">
                    <div className="flex items-start gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{msg.user}</p>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-400 focus:outline-none text-sm"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
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

export default LiveClassRoom
