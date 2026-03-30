import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await register(form.email, form.username, form.password)
      setSuccess(res.message || 'Registered! Please check your email to verify your account.')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <Link to="/" className="font-headline italic text-2xl text-stone-900">
            Prose &amp; Process
          </Link>
          <div className="flex items-center gap-3 text-sm text-stone-500">
            <span>Have an account?</span>
            <Link to="/login" className="text-primary font-medium hover:underline underline-offset-4">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
              Get Started
            </span>
            <h1 className="font-headline text-4xl text-on-surface leading-tight">
              Create your <span className="italic font-normal">workspace.</span>
            </h1>
            <p className="mt-3 text-sm text-on-surface-variant">
              Begin curating your strategic narrative today.
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
                <span className="material-symbols-outlined text-base">check_circle</span>
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
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm text-on-surface placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="yourhandle (lowercase)"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm text-on-surface placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 6 characters"
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">person_add</span>
                    Create Account
                  </>
                )}
              </button>
            </form>

            {success && (
              <div className="mt-4 text-center">
                <Link
                  to="/login"
                  className="text-sm text-primary font-medium hover:underline underline-offset-4"
                >
                  Go to Sign In →
                </Link>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center font-headline italic text-stone-400 text-sm">
            &ldquo;The art of process begins with a single step.&rdquo;
          </p>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-stone-400 border-t border-stone-100">
        © 2026 Prose &amp; Process. All rights reserved.
      </footer>
    </div>
  )
}
