import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      setSuccess(res.data.message || 'Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <Link to="/" className="font-headline italic text-2xl text-stone-900">Prose &amp; Process</Link>
          <Link to="/login" className="text-sm text-primary font-medium hover:underline underline-offset-4">
            Back to Sign In
          </Link>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              Account Recovery
            </span>
            <h1 className="font-headline text-4xl text-on-surface leading-tight">
              Reset your <span className="italic font-normal">password.</span>
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-8">
            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 text-green-800 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">mark_email_read</span>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm text-on-surface placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full py-3.5 rounded-lg text-white font-medium text-sm tracking-tight hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-stone-100 text-center">
              <Link to="/login" className="text-xs text-primary font-medium hover:underline underline-offset-4">
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-stone-400 border-t border-stone-100">
        © 2026 Prose &amp; Process. All rights reserved.
      </footer>
    </div>
  )
}
