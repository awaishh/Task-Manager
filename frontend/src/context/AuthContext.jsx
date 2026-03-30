import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/auth/current-user')
      .then(res => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password, username) => {
    // Send whichever identifiers are provided
    const payload = { password }
    if (email) payload.email = email
    if (username) payload.username = username
    const res = await api.post('/auth/login', payload)
    setUser(res.data.data.user)
    return res.data
  }

  const register = async (email, username, password) => {
    const res = await api.post('/auth/register', { email, username, password })
    return res.data
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
