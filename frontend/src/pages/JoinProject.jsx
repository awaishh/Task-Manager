import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { joinProjectByCode } from '../api/projects'
import { useAuth } from '../context/AuthContext'

export default function JoinProject() {
  const { joinCode } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    // If user is authenticated, auto-join
    if (user && !authLoading) {
      handleJoin()
    }
  }, [user, authLoading])

  const handleJoin = async () => {
    setJoining(true)
    setError('')
    try {
      const res = await joinProjectByCode(joinCode)
      setSuccess(res.data.data)
      
      // Redirect to project after 2 seconds
      setTimeout(() => {
        navigate(`/projects/${res.data.data.project._id}`)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join project')
    } finally {
      setJoining(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#faf9fb' }}>
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: '#5300b7' }}>
            progress_activity
          </span>
          <p className="mt-4 text-sm text-stone-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in - show login prompt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#faf9fb' }}>
        <div className="max-w-md w-full bg-white rounded-xl border border-stone-100 shadow-sm p-8 text-center">
          <span className="material-symbols-outlined text-5xl mb-4" style={{ color: '#5300b7' }}>
            login
          </span>
          <h2 className="font-headline text-2xl mb-2" style={{ color: '#1a1c1c' }}>
            Sign in to Join Project
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            You need to be logged in to join a project
          </p>
          <Link
            to={`/login?redirect=/join/${joinCode}`}
            className="block w-full py-3 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}
          >
            Sign In
          </Link>
          <Link
            to={`/register?redirect=/join/${joinCode}`}
            className="block mt-3 py-3 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#faf9fb' }}>
      <div className="max-w-md w-full bg-white rounded-xl border border-stone-100 shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="material-symbols-outlined text-5xl mb-4" style={{ color: '#5300b7' }}>
            group_add
          </span>
          <h2 className="font-headline text-2xl mb-2" style={{ color: '#1a1c1c' }}>
            Join Project
          </h2>
          <p className="text-sm text-stone-500">
            You've been invited to collaborate
          </p>
        </div>

        {/* Success State */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-4">
            <span className="material-symbols-outlined text-4xl text-green-500 mb-2">
              check_circle
            </span>
            <h3 className="font-medium text-green-800 mb-1">Successfully Joined!</h3>
            <p className="text-sm text-green-700">{success.project.name}</p>
            <p className="text-xs text-green-600 mt-2">Redirecting...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-error-container rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={handleJoin}
              className="mt-3 w-full py-2.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {joining && (
          <div className="flex flex-col items-center py-8">
            <span className="material-symbols-outlined text-4xl animate-spin mb-3" style={{ color: '#5300b7' }}>
              progress_activity
            </span>
            <p className="text-sm text-stone-500">Joining project...</p>
          </div>
        )}

        {/* User Info */}
        <div className="bg-surface-container-low rounded-lg p-4 flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}
          >
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#1a1c1c' }}>{user.username}</p>
            <p className="text-xs text-stone-400 truncate">{user.email}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link
            to="/dashboard"
            className="flex-1 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all text-center"
          >
            Cancel
          </Link>
          {!joining && !error && (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="flex-1 py-2.5 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}
            >
              <span className="material-symbols-outlined text-base">group_add</span>
              Join Project
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
