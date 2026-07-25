import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import AlunoHome from './pages/AlunoHome'
import GestorHome from './pages/GestorHome'
import './index.css'

function Roteador() {
  const { session, profile, loading } = useAuth()

  if (loading) return <div className="loading-state">Carregando…</div>
  if (!session) return <Login />
  if (!profile) return <div className="loading-state">Preparando sua conta…</div>
  if (profile.role === 'gestor') return <GestorHome />
  return <AlunoHome />
}

export default function App() {
  return (
    <AuthProvider>
      <Roteador />
    </AuthProvider>
  )
}
