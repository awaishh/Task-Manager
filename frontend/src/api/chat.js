import api from './axios'

export const getChatMessages = (projectId, params = {}) => {
  return api.get(`/chat/${projectId}`, { params })
}

export const sendChatMessage = (projectId, content) => {
  return api.post(`/chat/${projectId}`, { content })
}

export const deleteChatMessage = (projectId, messageId) => {
  return api.delete(`/chat/${projectId}/${messageId}`)
}
