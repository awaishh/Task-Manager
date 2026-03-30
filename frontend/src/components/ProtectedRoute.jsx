import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f9f9f9' }}>
        <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: '#5300b7' }}>
          progress_activity
        </span>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
