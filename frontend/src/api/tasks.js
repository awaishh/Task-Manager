import api from './axios'

export const getTasks = (projectId) => api.get(`/tasks/${projectId}`)
export const createTask = (projectId, data) => api.post(`/tasks/${projectId}`, data)
export const getTaskById = (projectId, taskId) => api.get(`/tasks/${projectId}/t/${taskId}`)
export const updateTask = (projectId, taskId, data) => api.put(`/tasks/${projectId}/t/${taskId}`, data)
export const deleteTask = (projectId, taskId) => api.delete(`/tasks/${projectId}/t/${taskId}`)

export const createSubtask = (projectId, taskId, data) => api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, data)
export const updateSubtask = (projectId, subTaskId, data) => api.put(`/tasks/${projectId}/st/${subTaskId}`, data)
export const deleteSubtask = (projectId, subTaskId) => api.delete(`/tasks/${projectId}/st/${subTaskId}`)
