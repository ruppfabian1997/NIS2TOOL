import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/Dashboard'
import { AssessmentPage } from './pages/Assessment'
import { ResultsPage } from './pages/Results'
import { KanbanPage } from './pages/Kanban'
import { login, register, setAuthToken } from './services/api'
import './index.css'

function AuthBar({ onToken }: { onToken: (token: string) => void }) {
  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async (mode: 'login' | 'register') => {
    setLoading(true)
    setError('')
    try {
      const token =
        mode === 'login' ? await login(email, password) : await register(email, password)
      onToken(token)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Auth fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <input
        className="border rounded px-2 py-1 text-sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        className="border rounded px-2 py-1 text-sm"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="passwort"
      />
      <button className="btn" onClick={() => handle('login')} disabled={loading}>
        Login
      </button>
      <button className="btn btn-primary" onClick={() => handle('register')} disabled={loading}>
        Registrieren
      </button>
      {error && <span className="text-red-600 text-xs">{error}</span>}
    </div>
  )
}

function Layout({ children, token }: { children: React.ReactNode; token: string }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-semibold text-primary">
              NIS2 Dashboard
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-700">
              <Link to="/assessment">Assessment</Link>
              <Link to="/results">Ergebnisse</Link>
              <Link to="/kanban">Kanban</Link>
            </nav>
          </div>
          <div className="text-xs text-slate-500">Eingeloggt als {token.slice(0, 8)}...</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-6">{children}</main>
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('nis2_token')
    if (stored) {
      setToken(stored)
      setAuthToken(stored)
    }
  }, [])

  const handleToken = (tok: string) => {
    setToken(tok)
    localStorage.setItem('nis2_token', tok)
    setAuthToken(tok)
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">NIS2 Compliance Dashboard</h1>
            <AuthBar onToken={handleToken} />
          </div>
          <p className="text-slate-600">Bitte einloggen oder registrieren, um fortzufahren.</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Layout token={token}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
