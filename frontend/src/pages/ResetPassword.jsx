import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function ResetPassword() {
  const { resetToken } = useParams()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post(`/auth/reset-password/${resetToken}`, { newPassword })
      navigate('/login', { state: { message: 'Password reset successfully. Please sign in.' } })
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <Link to="/" className="font-headline italic text-2xl text-stone-900">Prose &amp; Process</Link>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              New Password
            </span>
            <h1 className="font-headline text-4xl text-on-surface leading-tight">
              Set a new <span className="italic font-normal">password.</span>
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-8">
            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm text-on-surface placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg text-white font-medium text-sm tracking-tight hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    Resetting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">lock_reset</span>
                    Reset Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-stone-400 border-t border-stone-100">
        © 2026 Prose &amp; Process. All rights reserved.
      </footer>
    </div>
  )
}
