import { useState } from 'react'
import { Link } from 'react-router-dom'

const PURPLE = '#5300b7'

const faqs = [
  {
    q: 'How do I verify my email?',
    a: 'After registering, check your inbox for an email from Task Manager. Click "Confirm your account". The link expires in 20 minutes — if it expires, use the resend option on the verification page.'
  },
  {
    q: 'How do I invite someone to my project?',
    a: 'They need to register and verify their account first. Then go to your project → Members tab → Add Member, and enter their email address. Choose their role and click Add.'
  },
  {
    q: 'What are the different roles?',
    a: 'Admin has full control — can manage members, settings, tasks, and notes. Project-Admin can create and manage tasks and notes. Member can view tasks and notes and toggle subtask completion.'
  },
  {
    q: 'I forgot my password. What do I do?',
    a: 'Go to the login page and click "Forgot password?". Enter your email and we\'ll send you a reset link. The link expires in 20 minutes.'
  },
  {
    q: 'Why does my verification link say "Link Expired"?',
    a: 'Verification links are valid for 20 minutes. If yours expired, enter your email on that page and click "Resend Verification Email" to get a new one.'
  },
  {
    q: 'Can I delete a project?',
    a: 'Yes, but only if you are the project admin. Go to the project → Settings → Danger Zone → Delete Project. This permanently removes all tasks, notes, and members.'
  },
  {
    q: 'How do I add subtasks?',
    a: 'Click on any task to open the detail panel. At the bottom you\'ll see a subtask input — type a subtask title and press the + button. You can check them off as you complete them.'
  },
]

export default function Support() {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9f9f9', color: '#1a1c1c', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 22, color: '#1a1c1c', textDecoration: 'none' }}>Prose &amp; Process</Link>
          <Link to="/" style={{ fontSize: 13, color: PURPLE, textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: PURPLE }}>Help Center</span>
        <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: 48, fontWeight: 600, margin: '12px 0 8px', color: '#1a1c1c' }}>Support</h1>
        <p style={{ fontSize: 15, color: '#4a4455', marginBottom: 48, lineHeight: 1.7 }}>
          Find answers to common questions below. If you need further help, reach out directly.
        </p>

        {/* FAQ */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 26, fontWeight: 600, color: '#1a1c1c', margin: '0 0 24px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{ backgroundColor: '#fff', borderRadius: 12, border: '1px solid #eeeeee', overflow: 'hidden' }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{ width: '100%', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500, color: '#1a1c1c' }}>{faq.q}</span>
                  <span style={{ fontSize: 20, color: '#9ca3af', marginLeft: 16, flexShrink: 0 }}>{open === i ? '−' : '+'}</span>
                </button>
                {open === i && (
                  <div style={{ padding: '0 20px 18px', fontSize: 14, lineHeight: 1.7, color: '#4a4455' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ backgroundColor: '#fff', borderRadius: 16, border: '1px solid #eeeeee', padding: '32px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${PURPLE}, #6d28d9)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 22 }}>mail</span>
          </div>
          <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: 22, fontWeight: 600, color: '#1a1c1c', margin: '0 0 8px' }}>Still need help?</h3>
          <p style={{ fontSize: 14, color: '#4a4455', margin: '0 0 20px' }}>Send us an email and we'll get back to you.</p>
          <a
            href="mailto:awaishehsan86@gmail.com"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#fff', textDecoration: 'none', background: `linear-gradient(135deg, ${PURPLE}, #6d28d9)` }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>
            awaishehsan86@gmail.com
          </a>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #eeeeee', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>© 2026 Prose &amp; Process. Built with ❤️ by <strong>Awaish</strong></p>
      </footer>
    </div>
  )
}
