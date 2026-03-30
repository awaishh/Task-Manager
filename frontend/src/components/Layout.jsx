import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/projects', icon: 'folder_open', label: 'Projects' },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-100 shadow-sm">
        <div className="flex justify-between items-center w-full px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="p-2 text-stone-500 hover:bg-stone-50 rounded-md transition-all"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <Link to="/dashboard" className="font-headline italic text-xl text-stone-900">
              Prose &amp; Process
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-surface-container-low px-3 py-1.5 rounded-md border border-stone-200">
              <span className="material-symbols-outlined text-stone-400 text-sm mr-2">search</span>
              <input className="bg-transparent border-none text-xs focus:outline-none w-36 placeholder:text-stone-400" placeholder="Search..." type="text" />
            </div>
            <button className="p-2 text-stone-500 hover:bg-stone-50 rounded-md transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-stone-100">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold uppercase">
                {user?.username?.[0] || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium text-stone-700">{user?.username}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'} transition-all duration-200 bg-white border-r border-stone-100 flex flex-col shrink-0`}>
          <nav className="flex-1 p-3 space-y-1 pt-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'bg-primary-fixed text-primary '
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-3 border-t border-stone-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-primary transition-all w-full"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
