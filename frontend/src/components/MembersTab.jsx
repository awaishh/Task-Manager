import { useEffect, useState } from 'react'
import Modal from './Modal'
import { getMembers, addMember, updateMemberRole, removeMember } from '../api/projects'
import { useSocket } from '../context/SocketContext'

const ROLES = ['admin', 'project-admin', 'member']
const roleColor = {
  admin: 'bg-primary-fixed text-primary',
  'project-admin': 'bg-secondary-fixed text-on-secondary-fixed',
  member: 'bg-stone-100 text-stone-600',
}

export default function MembersTab({ projectId, role }) {
  const { onlineUsers } = useSocket()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ email: '', role: 'member' })
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [removeTarget, setRemoveTarget] = useState(null)

  const isAdmin = role === 'admin'

  // Create a set of online user IDs for quick lookup
  const onlineUserIds = new Set(onlineUsers.map(u => u._id))

  const load = () => {
    getMembers(projectId)
      .then(res => setMembers(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [projectId])

  const handleAdd = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      await addMember(projectId, form)
      setModalOpen(false)
      setForm({ email: '', role: 'member' })
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add member.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRoleChange = async (member, newRole) => {
    try {
      await updateMemberRole(projectId, member._id, { role: newRole })
      load()
    } catch {}
  }

  const handleRemove = async () => {
    if (!removeTarget) return
    try {
      await removeMember(projectId, removeTarget._id)
      setRemoveTarget(null)
      load()
    } catch {}
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <p className="text-sm text-on-surface-variant">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        {isAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all" style={{ background: "linear-gradient(to right, #5300b7, #6d28d9)" }}
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Add Member
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-stone-100" />)}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-100 p-12 text-center">
          <span className="material-symbols-outlined text-stone-300 text-4xl">group</span>
          <p className="mt-3 text-sm text-on-surface-variant">No members yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map(member => {
            const isOnline = onlineUserIds.has(member._id)
            return (
              <div key={member._id} className="bg-white rounded-xl border border-stone-100 shadow-sm p-4 flex items-center gap-4">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-sm font-bold uppercase shrink-0">
                    {member.username?.[0]}
                  </div>
                  {/* Online indicator */}
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-on-surface">{member.username}</p>
                    {isOnline && (
                      <span className="text-[9px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        Online
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 truncate">{member.email}</p>
                </div>
                {isAdmin ? (
                  <select
                    value={member.role}
                    onChange={e => handleRoleChange(member, e.target.value)}
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded border-none focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer ${roleColor[member.role]}`}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                ) : (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${roleColor[member.role]}`}>
                    {member.role}
                  </span>
                )}
                {isAdmin && (
                  <button
                    onClick={() => setRemoveTarget(member)}
                    className="p-1.5 text-stone-300 hover:text-error rounded-md transition-all"
                  >
                    <span className="material-symbols-outlined text-base">person_remove</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add Member Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setFormError('') }} title="Add Member">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && (
            <div className="px-4 py-3 rounded-lg bg-error-container text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {formError}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              placeholder="member@example.com"
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
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
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Remove Confirm */}
      <Modal open={!!removeTarget} onClose={() => setRemoveTarget(null)} title="Remove Member">
        <p className="text-sm text-on-surface-variant mb-6">
          Remove <span className="font-semibold text-on-surface">{removeTarget?.username}</span> from this project?
        </p>
        <div className="flex gap-3">
          <button onClick={() => setRemoveTarget(null)} className="flex-1 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-all">Cancel</button>
          <button onClick={handleRemove} className="flex-1 py-2.5 rounded-lg bg-error text-white font-medium text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">person_remove</span>
            Remove
          </button>
        </div>
      </Modal>
    </div>
  )
}
