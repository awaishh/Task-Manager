import { useSocket } from '../context/SocketContext'

/**
 * OnlineUsersBadge - Shows currently online users in the project
 * Displays avatars of online users with a live indicator
 */
export default function OnlineUsersBadge() {
  const { onlineUsers, isConnected } = useSocket()

  if (!isConnected || onlineUsers.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-stone-100">
      {/* Live connection indicator */}
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* User avatars */}
      <div className="flex -space-x-2">
        {onlineUsers.slice(0, 5).map((user) => (
          <div
            key={user._id || user.socketId}
            className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm"
            title={user.username}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.username?.charAt(0).toUpperCase()
            )}
          </div>
        ))}
        {onlineUsers.length > 5 && (
          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-600 border-2 border-white">
            +{onlineUsers.length - 5}
          </div>
        )}
      </div>

      {/* Count */}
      <span className="text-xs text-stone-500 font-medium">
        {onlineUsers.length} online
      </span>
    </div>
  )
}
