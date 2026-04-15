import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { getProjectById } from '../api/projects'
import TasksTab from '../components/TasksTab'
import NotesTab from '../components/NotesTab'
import MembersTab from '../components/MembersTab'
import ChatTab from '../components/ChatTab'
import OnlineUsersBadge from '../components/OnlineUsersBadge'
import QRCodeModal from '../components/QRCodeModal'

const TABS = ['Tasks', 'Notes', 'Members', 'Chat']

export default function ProjectDetail() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('Tasks')
  const [qrModalOpen, setQrModalOpen] = useState(false)

  useEffect(() => {
    getProjectById(projectId)
      .then(res => setProject(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [projectId])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined text-4xl animate-spin" style={{ color: '#5300b7' }}>
            progress_activity
          </span>
        </div>
      </Layout>
    )
  }

  if (!project) {
    return (
      <Layout>
        <div className="p-10 text-center">
          <p className="text-stone-500">Project not found.</p>
          <Link to="/projects" className="mt-4 inline-block text-sm hover:underline" style={{ color: '#5300b7' }}>
            ← Back to Projects
          </Link>
        </div>
      </Layout>
    )
  }

  const roleColor = {
    admin: 'bg-primary-fixed text-primary',
    'project-admin': 'bg-secondary-fixed text-on-secondary-fixed',
    member: 'bg-stone-100 text-stone-600',
  }

  return (
    <Layout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Link to="/projects" className="hover:text-stone-700 transition-colors">Projects</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-stone-700">{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${roleColor[project.role] || 'bg-stone-100 text-stone-600'}`}>
                {project.role}
              </span>
            </div>
            <h1 className="font-headline text-4xl" style={{ color: '#1a1c1c' }}>{project.name}</h1>
            <p className="mt-2 max-w-2xl text-sm" style={{ color: '#4a4455' }}>{project.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <OnlineUsersBadge />
            <button
              onClick={() => setQrModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all"
              title="Share QR Code"
            >
              <span className="material-symbols-outlined text-base">qr_code</span>
              Share
            </button>
            {project.role === 'admin' && (
              <Link
                to={`/projects/${projectId}/settings`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all"
              >
                <span className="material-symbols-outlined text-base">settings</span>
                Settings
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-stone-100">
          <div className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                  tab === t ? 'border-b-2 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
                style={tab === t ? { borderBottomColor: '#5300b7', color: '#5300b7' } : {}}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {tab === 'Tasks' && <TasksTab projectId={projectId} role={project.role} />}
          {tab === 'Notes' && <NotesTab projectId={projectId} role={project.role} />}
          {tab === 'Members' && <MembersTab projectId={projectId} role={project.role} />}
          {tab === 'Chat' && <ChatTab projectId={projectId} role={project.role} />}
        </div>

        {/* QR Code Modal */}
        {qrModalOpen && (
          <QRCodeModal
            projectId={projectId}
            projectName={project.name}
            onClose={() => setQrModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  )
}
