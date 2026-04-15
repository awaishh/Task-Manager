import { useEffect, useState, useCallback } from 'react'
import Modal from './Modal'
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import TaskDetail from './TaskDetail'
import { useSocket } from '../context/SocketContext'
import { getSocket } from '../socket/socket'

const STATUS_COLORS = {
  todo: 'bg-stone-100 text-stone-600',
  'in-progress': 'bg-secondary-fixed text-on-secondary-fixed',
  done: 'bg-green-100 text-green-700',
}
const STATUS_ICONS = { todo: 'radio_button_unchecked', 'in-progress': 'pending', done: 'check_circle' }
const STATUSES = ['todo', 'in-progress', 'done']

export default function TasksTab({ projectId, role }) {
  const { joinProject, leaveProject, isConnected } = useSocket()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', assignedTo: '' })
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [filter, setFilter] = useState('all')

  const canManage = role === 'admin' || role === 'project-admin'

  const load = () => {
    getTasks(projectId)
      .then(res => setTasks(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [projectId])

  // Join project room for real-time updates
  useEffect(() => {
    if (isConnected && projectId) {
      joinProject(projectId)
    }

    return () => {
      if (projectId) {
        leaveProject(projectId)
      }
    }
  }, [isConnected, projectId, joinProject, leaveProject])

  // Listen to real-time socket events
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    // Task created
    const handleTaskCreated = (data) => {
      console.log('📡 Real-time event: task-created', data)
      setTasks(prev => [...prev, data.task])
    }

    // Task updated
    const handleTaskUpdated = (data) => {
      console.log('📡 Real-time event: task-updated', data)
      setTasks(prev =>
        prev.map(task =>
          task._id === data.taskId
            ? { ...task, ...data.updates }
            : task
        )
      )
    }

    // Task deleted
    const handleTaskDeleted = (data) => {
      console.log('📡 Real-time event: task-deleted', data)
      setTasks(prev => prev.filter(task => task._id !== data.taskId))
      if (selectedTask?._id === data.taskId) {
        setSelectedTask(null)
      }
    }

    socket.on('task-created', handleTaskCreated)
    socket.on('task-updated', handleTaskUpdated)
    socket.on('task-deleted', handleTaskDeleted)

    // Cleanup listeners on unmount
    return () => {
      socket.off('task-created', handleTaskCreated)
      socket.off('task-updated', handleTaskUpdated)
      socket.off('task-deleted', handleTaskDeleted)
    }
  }, [projectId, selectedTask])

  const handleCreate = async (e) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      const payload = { title: form.title, description: form.description, status: form.status }
      if (form.assignedTo) payload.assignedTo = form.assignedTo
      await createTask(projectId, payload)
      setModalOpen(false)
      setForm({ title: '', description: '', status: 'todo', assignedTo: '' })
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create task.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (task, newStatus) => {
    try {
      await updateTask(projectId, task._id, { title: task.title, description: task.description, status: newStatus })
      load()
    } catch {}
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(projectId, taskId)
      load()
    } catch {}
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg">
          {['all', ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                filter === s ? 'bg-white shadow-sm text-on-surface' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ')}
              <span className="ml-1.5 text-[10px] opacity-60">
                {s === 'all' ? tasks.length : tasks.filter(t => t.status === s).length}
              </span>
            </button>
          ))}
        </div>
        {canManage && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all" style={{ background: "linear-gradient(to right, #5300b7, #6d28d9)" }}
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Task
          </button>
        )}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-stone-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-100 p-12 text-center">
          <span className="material-symbols-outlined text-stone-300 text-4xl">task_alt</span>
          <p className="mt-3 text-sm text-on-surface-variant">No tasks yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => (
            <div
              key={task._id}
              className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-4 group"
            >
              {/* Status toggle */}
              <button
                onClick={() => canManage && handleStatusChange(task, task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'done')}
                className={`shrink-0 ${canManage ? 'cursor-pointer' : 'cursor-default'}`}
                title="Cycle status"
              >
                <span className={`material-symbols-outlined text-2xl ${
                  task.status === 'done' ? 'text-green-500' : task.status === 'in-progress' ? 'text-secondary' : 'text-stone-300'
                }`}>
                  {STATUS_ICONS[task.status]}
                </span>
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedTask(task)}>
                <div className="flex items-center gap-2">
                  <h4 className={`font-medium text-sm ${task.status === 'done' ? 'line-through text-stone-400' : 'text-on-surface'}`}>
                    {task.title}
                  </h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[task.status]}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
                {task.description && (
                  <p className="text-xs text-stone-400 mt-0.5 truncate">{task.description}</p>
                )}
                {task.assignedTo && (
                  <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">person</span>
                    {task.assignedTo.username}
                  </p>
                )}
              </div>

              {/* Actions */}
              {canManage && (
                <button
                  onClick={() => handleDelete(task._id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-300 hover:text-error rounded-md transition-all"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setFormError('') }} title="New Task">
        <form onSubmit={handleCreate} className="space-y-4">
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
              placeholder="Task title"
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Optional description..."
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-stone-500 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
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
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Detail Drawer */}
      {selectedTask && (
        <TaskDetail
          projectId={projectId}
          task={selectedTask}
          role={role}
          onClose={() => setSelectedTask(null)}
          onUpdate={load}
        />
      )}
    </div>
  )
}
