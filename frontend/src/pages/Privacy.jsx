import { Link } from 'react-router-dom'

const PURPLE = '#5300b7'

export default function Privacy() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9f9f9', color: '#1a1c1c', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 22, color: '#1a1c1c', textDecoration: 'none' }}>Prose &amp; Process</Link>
          <Link to="/" style={{ fontSize: 13, color: PURPLE, textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: PURPLE }}>Legal</span>
        <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: 48, fontWeight: 600, margin: '12px 0 8px', color: '#1a1c1c' }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 48 }}>Last updated: January 2026</p>

        {[
          {
            title: 'Information We Collect',
            body: `We collect information you provide directly to us when you create an account, including your username, email address, and password. We also collect information about how you use the platform — such as projects created, tasks managed, and team members added.`
          },
          {
            title: 'How We Use Your Information',
            body: `We use the information we collect to operate and improve Prose & Process, send you transactional emails (such as email verification and password reset), and provide customer support. We do not sell your personal information to third parties.`
          },
          {
            title: 'Data Storage',
            body: `Your data is stored securely in MongoDB Atlas. Passwords are hashed using bcrypt and are never stored in plain text. Access tokens are short-lived and refresh tokens are rotated on each use.`
          },
          {
            title: 'Email Communications',
            body: `We send emails only for account-related purposes: email verification, password reset, and team invitations. You will not receive marketing emails unless you explicitly opt in.`
          },
          {
            title: 'File Uploads',
            body: `Files attached to tasks are uploaded to Cloudinary, a third-party cloud storage provider. By uploading files, you agree to Cloudinary's terms of service. We do not access or process the contents of your uploaded files.`
          },
          {
            title: 'Your Rights',
            body: `You may delete your account at any time. Upon deletion, your personal data will be removed from our systems within 30 days. You may also request a copy of your data by contacting us.`
          },
          {
            title: 'Contact',
            body: `If you have questions about this Privacy Policy, please contact us at awaishehsan86@gmail.com.`
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 22, fontWeight: 600, color: '#1a1c1c', margin: '0 0 10px' }}>{section.title}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#4a4455', margin: 0 }}>{section.body}</p>
          </div>
        ))}
      </main>

      <footer style={{ borderTop: '1px solid #eeeeee', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>© 2026 Prose &amp; Process. Built with ❤️ by <strong>Awaish</strong></p>
      </footer>
    </div>
  )
}
