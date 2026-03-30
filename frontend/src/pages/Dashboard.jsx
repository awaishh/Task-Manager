import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { getProjects } from '../api/projects'

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const roleColor = {
    admin: 'bg-primary-fixed text-primary',
    'project-admin': 'bg-secondary-fixed text-on-secondary-fixed',
    member: 'bg-stone-100 text-stone-600',
  }

  return (
    <Layout>
      <div className="p-6 lg:p-10 max-w-screen-xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</span>
          <h1 className="font-headline text-4xl lg:text-5xl text-on-surface mt-1 leading-tight">
            Welcome back, <span className="italic font-normal">{user?.username}.</span>
          </h1>
          <p className="mt-2 text-on-surface-variant text-sm">
            {user?.email} &mdash; Your strategic workspace is ready.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Projects', value: projects.length, icon: 'folder_open', color: 'text-primary' },
            { label: 'As Admin', value: projects.filter(p => p.role === 'admin').length, icon: 'admin_panel_settings', color: 'text-secondary' },
            { label: 'As Member', value: projects.filter(p => p.role === 'member').length, icon: 'group', color: 'text-stone-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-stone-100 shadow-sm">
              <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
              <p className="font-headline text-3xl text-on-surface mt-2">{loading ? '—' : s.value}</p>
              <p className="text-xs text-stone-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Active Manuscripts</span>
              <h2 className="font-headline text-2xl text-on-surface mt-0.5">Your Projects</h2>
            </div>
            <Link to="/projects" className="text-sm text-primary font-medium hover:underline underline-offset-4">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm animate-pulse h-40" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-12 text-center">
              <span className="material-symbols-outlined text-stone-300 text-5xl">folder_open</span>
              <p className="mt-4 text-on-surface-variant text-sm">No projects yet.</p>
              <Link
                to="/projects"
                className="mt-5 inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all" style={{ background: "linear-gradient(to right, #5300b7, #6d28d9)" }}
              >
                <span className="material-symbols-outlined text-base">add</span>
                Create First Project
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project, i) => (
                <Link
                  key={project._id}
                  to={`/projects/${project._id}`}
                  className={`rounded-xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[160px] ${
                    i === 0 ? 'text-white' : 'bg-white'
                  }`}
                  style={i === 0 ? { backgroundColor: '#5300b7' } : {}}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        i === 0 ? 'bg-white/20 text-white' : roleColor[project.role] || 'bg-stone-100 text-stone-600'
                      }`}>
                        {project.role}
                      </span>
                      <span className="material-symbols-outlined text-sm opacity-40">arrow_outward</span>
                    </div>
                    <h3 className={`font-headline text-lg leading-snug ${i === 0 ? 'text-white' : 'text-on-surface'}`}>
                      {project.name}
                    </h3>
                    <p className={`text-xs mt-1 line-clamp-2 ${i === 0 ? 'text-white/70' : 'text-on-surface-variant'}`}>
                      {project.description}
                    </p>
                  </div>
                  <p className={`text-[10px] mt-4 uppercase tracking-widest ${i === 0 ? 'text-white/50' : 'text-stone-400'}`}>
                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-40">
        <Link
          to="/projects"
          className="w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          style={{ backgroundColor: '#5300b7' }}
        >
          <span className="material-symbols-outlined">add</span>
        </Link>
      </div>
    </Layout>
  )
}
