import { useEffect, useState } from 'react'
import { getTaskById, updateTask, createSubtask, updateSubtask, deleteSubtask } from '../api/tasks'

export default function TaskDetail({ projectId, task, role, onClose, onUpdate }) {
  const [detail, setDetail] = useState(null)
  const [subtasks, setSubtasks] = useState([])
  const [newSubtask, setNewSubtask] = useState('')
  const [editStatus, setEditStatus] = useState(task.status)
  const canManage = role === 'admin' || role === 'project-admin'

  const load = () => {
    getTaskById(projectId, task._id)
      .then(res => {
        setDetail(res.data.data.task)
        setSubtasks(res.data.data.subtasks || [])
      })
      .catch(() => {})
  }

  useEffect(() => { load() }, [task._id, projectId])

  const handleStatusUpdate = async (status) => {
    setEditStatus(status)
    try {
      await updateTask(projectId, task._id, { title: task.title, status })
      onUpdate()
    } catch {}
  }

  const handleAddSubtask = async (e) => {
    e.preventDefault()
    if (!newSubtask.trim()) return
    try {
      await createSubtask(projectId, task._id, { title: newSubtask })
      setNewSubtask('')
      load()
    } catch {}
  }

  const handleToggleSubtask = async (subtask) => {
    try {
      await updateSubtask(projectId, subtask._id, { isCompleted: !subtask.isCompleted })
      load()
    } catch {}
  }

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubtask(projectId, subtaskId)
      load()
    } catch {}
  }

  const STATUS_COLORS = {
    todo: 'bg-stone-100 text-stone-600',
    'in-progress': 'bg-secondary-fixed text-on-secondary-fixed',
    done: 'bg-green-100 text-green-700',
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${STATUS_COLORS[detail?.status || task.status]}`}>
                {(detail?.status || task.status).replace('-', ' ')}
              </span>
            </div>
            <h2 className="font-headline text-2xl text-on-surface">{detail?.title || task.title}</h2>
            {(detail?.description || task.description) && (
              <p className="mt-2 text-sm text-on-surface-variant">{detail?.description || task.description}</p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-50 transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Status */}
          {canManage && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-2">Update Status</p>
              <div className="flex gap-2">
                {['todo', 'in-progress', 'done'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusUpdate(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      editStatus === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-primary/30' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {s.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assigned To */}
          {detail?.assignedTo && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-2">Assigned To</p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold uppercase">
                  {detail.assignedTo.username?.[0]}
                </div>
                <span className="text-sm text-on-surface">{detail.assignedTo.username}</span>
              </div>
            </div>
          )}

          {/* Attachments */}
          {detail?.attachments?.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-2">Attachments</p>
              <div className="space-y-2">
                {detail.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100 text-xs text-primary hover:bg-stone-100 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">attach_file</span>
                    {att.url.split('/').pop()}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500 mb-3">
              Subtasks
              {subtasks.length > 0 && (
                <span className="ml-2 text-primary">
                  {subtasks.filter(s => s.isCompleted).length}/{subtasks.length}
                </span>
              )}
            </p>

            {subtasks.length > 0 && (
              <div className="space-y-2 mb-3">
                {subtasks.map(subtask => (
                  <div key={subtask._id} className="flex items-center gap-3 group">
                    <button onClick={() => handleToggleSubtask(subtask)} className="shrink-0">
                      <span className={`material-symbols-outlined text-xl ${subtask.isCompleted ? 'text-green-500' : 'text-stone-300'}`}>
                        {subtask.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                    </button>
                    <span className={`flex-1 text-sm ${subtask.isCompleted ? 'line-through text-stone-400' : 'text-on-surface'}`}>
                      {subtask.title}
                    </span>
                    {canManage && (
                      <button
                        onClick={() => handleDeleteSubtask(subtask._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-300 hover:text-error transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1 px-3 py-2 rounded-lg border border-stone-200 bg-surface-container-low text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-all"
                style={{ backgroundColor: '#5300b7' }}
              >
                <span className="material-symbols-outlined text-base">add</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
