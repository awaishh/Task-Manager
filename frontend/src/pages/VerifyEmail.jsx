import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'

export default function VerifyEmail() {
  const { verificationToken } = useParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get(`/auth/verify-email/${verificationToken}`)
      .then(res => {
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully!')
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.')
      })
  }, [verificationToken])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <Link to="/" className="font-headline italic text-2xl text-stone-900">Prose &amp; Process</Link>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          {status === 'loading' && (
            <>
              <span className="material-symbols-outlined text-primary text-5xl animate-spin">progress_activity</span>
              <p className="mt-4 text-on-surface-variant">Verifying your email...</p>
            </>
          )}
          {status === 'success' && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-10">
              <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
              <h1 className="font-headline text-3xl text-on-surface mt-4">Email Verified</h1>
              <p className="mt-3 text-sm text-on-surface-variant">{message}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all" style={{ background: "linear-gradient(to right, #5300b7, #6d28d9)" }}
              >
                <span className="material-symbols-outlined text-base">login</span>
                Sign In Now
              </Link>
            </div>
          )}
          {status === 'error' && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-10">
              <span className="material-symbols-outlined text-error text-5xl">error</span>
              <h1 className="font-headline text-3xl text-on-surface mt-4">Verification Failed</h1>
              <p className="mt-3 text-sm text-on-surface-variant">{message}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline underline-offset-4"
              >
                ← Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
