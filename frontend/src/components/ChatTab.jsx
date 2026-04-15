import { useEffect, useState, useRef, useCallback } from 'react'
import { getChatMessages } from '../api/chat'
import { useSocket } from '../context/SocketContext'
import { getSocket, sendSocketMessage } from '../socket/socket'
import { useAuth } from '../context/AuthContext'

export default function ChatTab({ projectId, role }) {
  const { user } = useAuth()
  const { isConnected } = useSocket()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const loadMessages = useCallback(() => {
    getChatMessages(projectId, { limit: 50 })
      .then(res => setMessages(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [projectId])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Listen for real-time chat messages
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNewMessage = (data) => {
      console.log('📡 Real-time event: chat-message', data)
      // Check if message already exists (to avoid duplicates with optimistic updates)
      setMessages(prev => {
        if (prev.find(m => m._id === data.message._id)) return prev;
        // Filter out any optimistic placeholder that matches this content from the same user
        const filtered = prev.filter(m => !(m.isOptimistic && m.content === data.message.content && m.sender?._id === data.message.sender?._id));
        return [...filtered, data.message];
      })
    }

    const handleMessageDeleted = (data) => {
      console.log('📡 Real-time event: chat-message-deleted', data)
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId))
    }

    socket.on('chat-message', handleNewMessage)
    socket.on('chat-message-deleted', handleMessageDeleted)

    return () => {
      socket.off('chat-message', handleNewMessage)
      socket.off('chat-message-deleted', handleMessageDeleted)
    }
  }, [projectId])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !isConnected) return

    const content = newMessage.trim()
    
    // OPTIMISTIC UPDATE: Add message to UI immediately
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      content,
      sender: user,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    }
    
    setMessages(prev => [...prev, optimisticMsg])
    setNewMessage('')
    
    try {
      sendSocketMessage(projectId, content)
    } catch (err) {
      console.error('Failed to send message:', err)
      // Remove optimistic message if failed
      setMessages(prev => prev.filter(m => m._id !== optimisticMsg._id))
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  return (
    <div className="space-y-4">
      {/* Chat Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-stone-100 shadow-sm">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>
          group_chat
        </span>
        <div>
          <h3 className="text-sm font-medium" style={{ color: '#1a1c1c' }}>Project Chat</h3>
          <p className="text-xs text-stone-400">
            {isConnected ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                Live
              </span>
            ) : (
              'Connecting...'
            )}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="bg-white rounded-xl border border-stone-100 shadow-sm h-96 overflow-y-auto p-4 space-y-3"
      >
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-stone-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-stone-200 rounded w-24"></div>
                  <div className="h-3 bg-stone-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <span className="material-symbols-outlined text-stone-300 text-5xl mb-3">chat_bubble_outline</span>
            <p className="text-sm text-stone-400">No messages yet</p>
            <p className="text-xs text-stone-400 mt-1">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwnMessage = message.sender?._id === user?._id
              const showDate = index === 0 || 
                new Date(message.createdAt).toDateString() !== 
                new Date(messages[index - 1]?.createdAt).toDateString()

              return (
                <div key={message._id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-3">
                      <div className="bg-stone-100 text-stone-500 text-xs px-3 py-1 rounded-full">
                        {formatDate(message.createdAt)}
                      </div>
                    </div>
                  )}
                  <div className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className="shrink-0">
                      {message.sender?.avatar ? (
                        <img 
                          src={message.sender.avatar} 
                          alt={message.sender.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}
                        >
                          {message.sender?.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`max-w-[70%] ${isOwnMessage ? 'text-right' : ''}`}>
                      {!isOwnMessage && (
                        <p className="text-[10px] font-medium mb-1" style={{ color: '#5300b7' }}>
                          {message.sender?.username}
                        </p>
                      )}
                      <div 
                        className={`inline-block px-3 py-2 rounded-lg text-sm ${
                          isOwnMessage 
                            ? 'text-white' 
                            : 'bg-surface-container-low text-on-surface'
                        }`}
                        style={isOwnMessage ? { background: 'linear-gradient(to right, #5300b7, #6d28d9)' } : {}}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1 px-1">
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending || !isConnected}
          className="flex-1 px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim() || !isConnected}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}
        >
          {sending ? (
            <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-base">send</span>
          )}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  )
}
