import { Link } from 'react-router-dom'

const PURPLE = '#5300b7'
const PURPLE_DARK = '#3b0080'

export default function Landing() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9f9f9', color: '#1a1c1c' }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f0f0f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 22, color: '#1a1c1c' }}>Prose &amp; Process</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/login" style={{ padding: '8px 18px', fontSize: 13, fontWeight: 500, color: '#4a4455', textDecoration: 'none', borderRadius: 8 }}>
              Sign In
            </Link>
            <Link to="/register" style={{ padding: '8px 20px', fontSize: 13, fontWeight: 600, color: '#fff', borderRadius: 8, textDecoration: 'none', background: `linear-gradient(135deg, ${PURPLE}, #6d28d9)` }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: PURPLE, marginBottom: 20 }}>
            
          </span>
          <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(42px, 5vw, 72px)', lineHeight: 1.05, fontWeight: 600, margin: '0 0 24px', color: '#1a1c1c' }}>
            The Art of Process<br />meets the Depth of Prose.</h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: '#4a4455', maxWidth: 480, margin: '0 0 36px' }}>
            A curated workspace for high-stakes narratives and long-form strategy. Manage the architecture of your ideas with the precision of an editor.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/register" style={{ padding: '14px 28px', fontSize: 14, fontWeight: 600, color: '#fff', borderRadius: 10, textDecoration: 'none', background: `linear-gradient(135deg, ${PURPLE}, #6d28d9)`, boxShadow: '0 8px 24px rgba(83,0,183,0.25)' }}>
              Initialize Project
            </Link>
            <Link to="/login" style={{ padding: '14px 28px', fontSize: 14, fontWeight: 500, color: '#4a4455', borderRadius: 10, textDecoration: 'none', backgroundColor: '#eeeeee', border: '1px solid #e0e0e0' }}>
              Sign In
            </Link>
          </div>
          <div style={{ marginTop: 48, display: 'flex', gap: 32 }}>
            {[['500+', 'Projects Managed'], ['98%', 'Team Satisfaction'], ['3x', 'Faster Delivery']].map(([val, label]) => (
              <div key={label}>
                <p style={{ fontFamily: 'Newsreader, serif', fontSize: 28, fontWeight: 600, color: '#1a1c1c', margin: 0 }}>{val}</p>
                <p style={{ fontSize: 11, color: '#7b7486', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '4px 0 0' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual — layered cards, no obvious image box */}
        <div style={{ position: 'relative', height: 480 }}>
          {/* Background blob */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 24, background: 'linear-gradient(135deg, #ebddff 0%, #f3f3f4 60%, #e8e8e8 100%)', transform: 'rotate(-2deg)' }} />
          {/* Main card */}
          <div style={{ position: 'absolute', top: 24, left: 24, right: 24, bottom: 24, borderRadius: 20, overflow: 'hidden', boxShadow: '0 24px 64px rgba(83,0,183,0.12)' }}>
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Gradient overlay — makes it feel like a design element, not a photo */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(83,0,183,0.6) 0%, rgba(109,40,217,0.35) 40%, rgba(0,0,0,0.15) 100%)' }} />
            {/* Floating stat card */}
            <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28, backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '18px 22px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 6px' }}>Active Chapter</p>
              <p style={{ fontFamily: 'Newsreader, serif', fontSize: 20, color: '#fff', margin: 0, fontWeight: 600 }}>Global Expansion Framework 2025</p>
              <div style={{ marginTop: 12, height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99 }}>
                <div style={{ width: '78%', height: '100%', backgroundColor: '#fff', borderRadius: 99 }} />
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', margin: '6px 0 0' }}>78% complete</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: PURPLE }}>How It Works</span>
          <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 600, margin: '12px 0 0', color: '#1a1c1c' }}>
            Built for the way<br />strategists think.
            
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: 'folder_open', title: 'Project Architecture', desc: 'Structure your work like a manuscript. Every project has chapters, contributors, and a clear narrative arc.', color: '#ebddff', iconColor: PURPLE },
            { icon: 'task_alt', title: 'Task Orchestration', desc: 'Tasks with subtasks, status tracking, and file attachments. Assign, prioritize, and ship with clarity.', color: '#e8f5e9', iconColor: '#2e7d32' },
            { icon: 'group', title: 'Team Roles', desc: 'Admins, project leads, and members — each with the right level of access to keep strategy tight.', color: '#fff3e0', iconColor: '#e65100' },
            { icon: 'sticky_note_2', title: 'Editorial Notes', desc: 'Capture decisions, context, and rationale directly inside each project. No more lost Slack threads.', color: '#fce4ec', iconColor: '#c62828' },
            { icon: 'verified_user', title: 'Secure by Default', desc: 'JWT auth, email verification, and role-based access control baked in from day one.', color: '#e3f2fd', iconColor: '#1565c0' },
            { icon: 'timeline', title: 'Progress Tracking', desc: 'See what\'s todo, in-progress, and done at a glance. Filter, sort, and stay on top of every deliverable.', color: '#f3e5f5', iconColor: '#6a1b9a' },
          ].map(f => (
            <div key={f.title} style={{ backgroundColor: '#fff', borderRadius: 16, padding: '28px 28px 32px', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <span className="material-symbols-outlined" style={{ color: f.iconColor, fontSize: 22 }}>{f.icon}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1a1c1c', margin: '0 0 10px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#4a4455', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENTO SHOWCASE ── */}
      <section style={{ backgroundColor: '#1a1c1c', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#d3bbff' }}>Active Manuscripts</span>
            <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 600, color: '#fff', margin: '12px 0 0' }}>
              Work in <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Progress.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {/* Card 1 — image */}
            <div style={{ gridRow: 'span 2', borderRadius: 20, overflow: 'hidden', position: 'relative', minHeight: 380 }}>
              <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(83,0,183,0.3) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Strategy</span>
                <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: 22, color: '#fff', margin: '6px 0 12px', fontWeight: 600 }}>Editorial Guidelines for Q3 Campaign</h3>
                <div style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 99 }}>
                  <div style={{ width: '84%', height: '100%', backgroundColor: '#d3bbff', borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '6px 0 0' }}>84% complete</p>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{ borderRadius: 20, backgroundColor: '#2f3131', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 10, color: '#7b7486', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Archive</span>
                <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: 20, color: '#fff', margin: '8px 0 10px', fontWeight: 600 }}>The Meta-Physical Roadmap</h3>
                <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>A foundational document exploring the philosophical alignment of our engineering team.</p>
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                  <div style={{ width: '30%', height: '100%', backgroundColor: '#7b7486', borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 11, color: '#7b7486', margin: '6px 0 0' }}>Drafting Phase</p>
              </div>
            </div>

            {/* Card 3 — priority */}
            <div style={{ borderRadius: 20, background: `linear-gradient(135deg, ${PURPLE}, #6d28d9)`, padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 99 }}>Priority</span>
                <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }}>auto_awesome</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: 20, color: '#fff', margin: '16px 0 8px', fontWeight: 600 }}>Board Presentation: Narrative Deck</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 16px' }}>Critical synthesis of quarterly metrics and future-state vision.</p>
                <div style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99 }}>
                  <div style={{ width: '95%', height: '100%', backgroundColor: '#fff', borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '6px 0 0' }}>Active Now · 95%</p>
              </div>
            </div>

            {/* Card 4 — team */}
            <div style={{ borderRadius: 20, backgroundColor: '#2f3131', padding: '28px' }}>
              <span style={{ fontSize: 10, color: '#7b7486', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Team</span>
              <h3 style={{ fontFamily: 'Newsreader, serif', fontSize: 20, color: '#fff', margin: '8px 0 16px', fontWeight: 600 }}>Collaborative by Design</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {['#ebddff', '#d3bbff', '#c7aaff', '#a78bfa'].map((c, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: PURPLE }}>
                    {['A', 'M', 'S', '+4'][i]}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: '14px 0 0', lineHeight: 1.6 }}>Roles, permissions, and real-time collaboration built in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE SECTION ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 24px', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 80, alignItems: 'start' }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: PURPLE }}>Utility View</span>
          <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 600, color: '#1a1c1c', margin: '12px 0 20px', lineHeight: 1.1 }}>
            Timeline of<br /><span style={{ fontStyle: 'italic', fontWeight: 400 }}>Thought.</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#4a4455', margin: '0 0 32px' }}>
            Track changes not as diffs, but as narrative shifts. See the evolution of strategy over time with our editorial timeline.
          </p>
          {['Semantic Versioning', 'Contextual Tagging', 'Logic Mapping'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span className="material-symbols-outlined" style={{ color: PURPLE, fontSize: 20 }}>check_circle</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1c1c' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Timeline widget */}
        <div style={{ backgroundColor: '#fff', borderRadius: 20, border: '1px solid #eeeeee', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, cursor: 'pointer' }}>Timeline</button>
              <button style={{ padding: '6px 14px', fontSize: 12, color: '#7b7486', backgroundColor: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Grid</button>
            </div>
            <div style={{ display: 'flex', gap: -4 }}>
              {['#ebddff', '#e0e7ff', '#f3f4f6'].map((c, i) => (
                <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: c, border: '2px solid #fff', marginLeft: i > 0 ? -6 : 0 }} />
              ))}
            </div>
          </div>
          <div style={{ padding: '28px 28px 28px 48px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 28, top: 28, bottom: 28, width: 1, backgroundColor: '#f0f0f0' }} />
            {[
              { date: 'Oct 12 — 09:45 AM', title: 'Draft: Executive Summary', desc: "Revised the tone from 'aggressive' to 'assertive' following stakeholder feedback.", active: true },
              { date: 'Oct 11 — 03:20 PM', title: 'Integration: Resource Matrix', desc: 'Linked financial projections and headcount data to the strategic overview.', active: false },
              { date: 'Oct 10 — 11:00 AM', title: 'System Initialized', desc: 'Project workspace created and team members onboarded.', active: false, dim: true },
            ].map((entry, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: i < 2 ? 28 : 0, opacity: entry.dim ? 0.5 : 1 }}>
                <div style={{ position: 'absolute', left: -26, top: 4, width: 10, height: 10, borderRadius: '50%', border: `2px solid ${entry.active ? PURPLE : '#e0e0e0'}`, backgroundColor: '#fff', boxShadow: entry.active ? `0 0 0 3px rgba(83,0,183,0.1)` : 'none' }} />
                <p style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>{entry.date}</p>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1a1c1c', margin: '0 0 4px' }}>{entry.title}</h4>
                <p style={{ fontSize: 13, color: '#7b7486', margin: 0, lineHeight: 1.5 }}>{entry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={{ backgroundColor: '#fff', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <span className="material-symbols-outlined" style={{ color: PURPLE, fontSize: 40, display: 'block', marginBottom: 24 }}>format_quote</span>
          <p style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(20px, 2.5vw, 30px)', fontStyle: 'italic', lineHeight: 1.55, color: '#1a1c1c', margin: '0 0 32px' }}>
            "The problem with most organizations is not that they lack information — it's that they lack the discipline to act on it. Process is not bureaucracy. Process is how you turn insight into power."
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${PURPLE}, #6d28d9)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>AK</div>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a1c1c' }}>Alex Karp</span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>CEO, Palantir Technologies</span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: `linear-gradient(135deg, ${PURPLE} 0%, #6d28d9 100%)` }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Newsreader, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: '#fff', margin: '0 0 16px', lineHeight: 1.1 }}>
            Ready to curate<br /><span style={{ fontStyle: 'italic', fontWeight: 400 }}>your legacy?</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', margin: '0 0 36px', lineHeight: 1.6 }}>
            Join teams who treat strategy as a craft. Start your first project in minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/register" style={{ padding: '14px 32px', fontSize: 14, fontWeight: 600, color: PURPLE, backgroundColor: '#fff', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              Get Started Free
            </Link>
            <Link to="/login" style={{ padding: '14px 32px', fontSize: 14, fontWeight: 500, color: '#fff', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#1a1c1c', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 20, color: '#fff' }}>Prose &amp; Process</span>
            <p style={{ fontSize: 12, color: '#7b7486', margin: '6px 0 0' }}>© 2026 All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Support', '/support']].map(([label, to]) => (
              <Link key={label} to={to} style={{ fontSize: 13, color: '#7b7486', textDecoration: 'none' }}>{label}</Link>
            ))}
            <Link to="/login" style={{ fontSize: 13, color: '#d3bbff', textDecoration: 'none' }}>Sign In</Link>
            <Link to="/register" style={{ fontSize: 13, color: '#d3bbff', textDecoration: 'none', fontWeight: 600 }}>Get Started →</Link>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: '24px auto 0', paddingTop: 24, borderTop: '1px solid #2f3131', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#4a4455', margin: 0 }}>
            Built with ❤️ by <span style={{ color: '#d3bbff', fontWeight: 600 }}>Awaish</span>
          </p>
        </div>
      </footer>

    </div>
  )
}
