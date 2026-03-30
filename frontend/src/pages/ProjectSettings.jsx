import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { getProjectById, updateProject, deleteProject } from '../api/projects'

export default function ProjectSettings() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    getProjectById(projectId)
      .then(res => {
        const p = res.data.data
        setProject(p)
        setForm({ name: p.name, description: p.description })
      })
      .catch(() => navigate('/projects'))
      .finally(() => setLoading(false))
  }, [projectId, navigate])

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await updateProject(projectId, form)
      setSuccess('Project updated successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteProject(projectId)
      navigate('/projects')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project.')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link to={`/projects/${projectId}`} className="hover:text-primary transition-colors">{project?.name}</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface">Settings</span>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Configuration</span>
          <h1 className="font-headline text-3xl text-on-surface mt-1">Project Settings</h1>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-xl border border-stone-100 shadow-sm p-6">
          <h2 className="font-medium text-on-surface mb-5">General</h2>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-800 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              {success}
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Project Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-60" style={{ background: "linear-gradient(to right, #5300b7, #6d28d9)" }}
            >
              {saving && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6">
          <h2 className="font-medium text-error mb-2">Danger Zone</h2>
          <p className="text-sm text-on-surface-variant mb-4">
            Deleting this project will permanently remove all tasks, notes, and members. This cannot be undone.
          </p>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-200 text-error text-sm font-medium hover:bg-red-50 transition-all"
            >
              <span className="material-symbols-outlined text-base">delete</span>
              Delete Project
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(false)} className="px-5 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-error text-white text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60"
              >
                {deleting && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
