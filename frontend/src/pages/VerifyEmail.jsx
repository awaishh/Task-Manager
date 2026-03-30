import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function VerifyEmail() {
  const { verificationToken } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  useEffect(() => {
    api.get(`/auth/verify-email/${verificationToken}`)
      .then(res => {
        setStatus('success')
        setMessage(res.data.message || 'Email verified successfully!')
        setTimeout(() => navigate('/login'), 3000)
      })
      .catch(err => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Token is invalid or expired.')
      })
  }, [verificationToken])

  const handleResend = async () => {
    setResending(true)
    setResendMsg('')
    try {
      await api.post('/auth/resend-email-verification')
      setResendMsg('A new verification email has been sent. Please check your inbox.')
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Could not resend. Please log in first.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f9f9' }}>
      <nav className="bg-white sticky top-0 z-50 border-b border-stone-100 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <Link to="/" className="font-headline italic text-2xl text-stone-900">Prose & Process</Link>
        </div>
      </nav>
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          {status === 'loading' && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-10">
              <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: '#5300b7' }}>progress_activity</span>
              <p className="mt-4 text-sm text-stone-500">Verifying your email...</p>
            </div>
          )}
          {status === 'success' && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-10">
              <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span className="material-symbols-outlined" style={{ color: '#16a34a', fontSize: 28 }}>check_circle</span>
              </div>
              <h1 className="font-headline text-3xl text-stone-900 mt-2">Email Verified!</h1>
              <p className="mt-3 text-sm text-stone-500">{message}</p>
              <p className="mt-1 text-xs text-stone-400">Redirecting to sign in in 3 seconds...</p>
              <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-all" style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}>
                <span className="material-symbols-outlined text-base">login</span>
                Sign In Now
              </Link>
            </div>
          )}
          {status === 'error' && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-10">
              <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span className="material-symbols-outlined" style={{ color: '#d97706', fontSize: 28 }}>link_off</span>
              </div>
              <h1 className="font-headline text-3xl text-stone-900 mt-2">Link Expired</h1>
              <p className="mt-3 text-sm text-stone-500">{message}</p>
              <p className="mt-1 text-xs text-stone-400">Verification links expire after 20 minutes.</p>
              {resendMsg ? (
                <div className="mt-5 px-4 py-3 rounded-lg bg-green-50 text-green-800 text-sm">{resendMsg}</div>
              ) : (
                <button onClick={handleResend} disabled={resending} className="mt-6 inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium text-sm hover:opacity-90 transition-all disabled:opacity-60" style={{ background: 'linear-gradient(to right, #5300b7, #6d28d9)' }}>
                  {resending ? <><span className="material-symbols-outlined text-base animate-spin">progress_activity</span> Sending...</> : <><span className="material-symbols-outlined text-base">mark_email_unread</span> Resend Verification Email</>}
                </button>
              )}
              <div className="mt-4">
                <Link to="/login" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">← Back to Sign In</Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
