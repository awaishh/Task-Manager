import { useEffect, useState } from 'react'
import Modal from './Modal'
import { getNotes, createNote, updateNote, deleteNote } from '../api/notes'

export default function NotesTab({ projectId, role }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editNote, setEditNote] = useState(null)
  const [form, setForm] = useState({ title: '', content: '' })
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const canManage = role === 'admin'

  const load = () => {
    getNotes(projectId)
      .then(res => setNotes(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [projectId])

  const openCreate = () => {
    setEditNote(null)
    setForm({ title: '', content: '' })
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (note) => {
    setEditNote(note)
    setForm({ title: note.title || '', content: note.content || '' })
    setFormError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      if (editNote) {
        await updateNote(projectId, editNote._id, form)
      } else {
        await createNote(projectId, form)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save note.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteNote(projectId, deleteTarget._id)
      setDeleteTarget(null)
      load()
    } catch {}
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-on-surface-variant">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        {canManage && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all" style={{ background: "linear-gradient(to right, #5300b7, #6d28d9)" }}
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Note
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl h-36 animate-pulse border border-stone-100" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-100 p-12 text-center">
          <span className="material-symbols-outlined text-stone-300 text-4xl">sticky_note_2</span>
          <p className="mt-3 text-sm text-on-surface-variant">No notes yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {notes.map(note => (
            <div key={note._id} className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-headline text-lg text-on-surface leading-snug">{note.title}</h4>
                {canManage && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => openEdit(note)} className="p-1 text-stone-400 hover:text-primary rounded transition-colors">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button onClick={() => setDeleteTarget(note)} className="p-1 text-stone-400 hover:text-error rounded transition-colors">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-on-surface-variant flex-1 line-clamp-4 whitespace-pre-wrap">{note.content}</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-stone-400 uppercase tracking-widest">
                {note.createdBy && (
                  <>
                    <span className="material-symbols-outlined text-xs">person</span>
                    <span>{note.createdBy.username}</span>
                    <span>·</span>
                  </>
                )}
                <span>{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editNote ? 'Edit Note' : 'New Note'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {formError}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              placeholder="Note title"
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              required
              rows={5}
              placeholder="Write your note..."
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
              {submitting && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
              {submitting ? 'Saving...' : editNote ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Note">
        <p className="text-sm text-on-surface-variant mb-6">
          Delete <span className="font-semibold text-on-surface">{deleteTarget?.title}</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all">Cancel</button>
          <button onClick={handleDelete} className="flex-1 py-2.5 rounded-lg bg-error text-white font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">delete</span>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  )
}
