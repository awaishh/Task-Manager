import { Link } from 'react-router-dom'

const PURPLE = '#5300b7'

export default function Terms() {
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
        <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: 48, fontWeight: 600, margin: '12px 0 8px', color: '#1a1c1c' }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 48 }}>Last updated: January 2026</p>

        {[
          {
            title: 'Acceptance of Terms',
            body: `By accessing or using Prose & Process, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.`
          },
          {
            title: 'Use of the Platform',
            body: `You may use Prose & Process for lawful purposes only. You agree not to use the platform to store, share, or transmit any content that is illegal, harmful, or infringes on the rights of others. You are responsible for all activity that occurs under your account.`
          },
          {
            title: 'Account Responsibilities',
            body: `You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account. We are not liable for any loss resulting from unauthorized access to your account.`
          },
          {
            title: 'Project and Team Data',
            body: `You retain ownership of all content you create within Prose & Process, including projects, tasks, and notes. By using the platform, you grant us a limited license to store and display your content solely for the purpose of providing the service.`
          },
          {
            title: 'Termination',
            body: `We reserve the right to suspend or terminate your account at any time if you violate these terms. You may also delete your account at any time from the account settings page.`
          },
          {
            title: 'Limitation of Liability',
            body: `Prose & Process is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.`
          },
          {
            title: 'Changes to Terms',
            body: `We may update these Terms of Service from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.`
          },
          {
            title: 'Contact',
            body: `For questions about these Terms, contact us at awaishehsan86@gmail.com.`
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
