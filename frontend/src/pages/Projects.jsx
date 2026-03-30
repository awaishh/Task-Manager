import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { getProjects, createProject, deleteProject } from '../api/projects'

const roleColor = {
  admin: 'bg-primary-fixed text-primary',
  'project-admin': 'bg-secondary-fixed text-on-secondary-fixed',
  member: 'bg-stone-100 text-stone-600',
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = () => {
    setLoading(true)
    getProjects()
      .then(res => setProjects(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      await createProject(form)
      setModalOpen(false)
      setForm({ name: '', description: '' })
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create project.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteProject(deleteTarget._id)
      setDeleteTarget(null)
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project.')
    }
  }

  return (
    <Layout>
      <div className="p-6 lg:p-10 max-w-screen-xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Library</span>
            <h1 className="font-headline text-4xl text-on-surface mt-1">All Projects</h1>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all" style={{ background: "linear-gradient(to right, #5300b7, #6d28d9)" }}
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Project
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm animate-pulse h-48" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-16 text-center">
            <span className="material-symbols-outlined text-stone-300 text-5xl">folder_open</span>
            <p className="mt-4 text-on-surface-variant">No projects yet. Create your first one.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-5 inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all" style={{ background: "linear-gradient(to right, #5300b7, #6d28d9)" }}
            >
              <span className="material-symbols-outlined text-base">add</span>
              Initialize Project
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {projects.map(project => (
              <div key={project._id} className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                <Link to={`/projects/${project._id}`} className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${roleColor[project.role] || 'bg-stone-100 text-stone-600'}`}>
                      {project.role}
                    </span>
                    <span className="material-symbols-outlined text-stone-300 text-sm">arrow_outward</span>
                  </div>
                  <h3 className="font-headline text-xl text-on-surface leading-snug">{project.name}</h3>
                  <p className="text-sm text-on-surface-variant mt-2 line-clamp-3">{project.description}</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-4">
                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </Link>
                {project.role === 'admin' && (
                  <div className="px-6 pb-4 flex gap-2 border-t border-stone-50 pt-3">
                    <Link
                      to={`/projects/${project._id}/settings`}
                      className="flex items-center gap-1 text-xs text-stone-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">settings</span>
                      Settings
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(project)}
                      className="flex items-center gap-1 text-xs text-stone-400 hover:text-error transition-colors ml-auto"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setFormError('') }} title="Initialize Project">
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {formError}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Project Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="e.g. Global Expansion Framework"
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
              rows={3}
              placeholder="Describe the strategic intent of this project..."
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: "linear-gradient(to right, #5300b7, #6d28d9)" }}
            >
              {submitting ? <span className="material-symbols-outlined text-base animate-spin">progress_activity</span> : null}
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Project">
        <p className="text-sm text-on-surface-variant mb-6">
          Are you sure you want to delete <span className="font-semibold text-on-surface">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-2.5 rounded-lg bg-error text-white font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            Delete
          </button>
        </div>
      </Modal>
    </Layout>
  )
}
