import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [modo, setModo] = useState('entrar') // 'entrar' | 'criar-gestor' | 'criar-aluno'
  const [mostrarGestor, setMostrarGestor] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('modo') === 'gestor') {
      setMostrarGestor(true)
    }
  }, [])

  async function entrar(e) {
    e.preventDefault()
    setErro(''); setMsg(''); setCarregando(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setErro(error.message)
    setCarregando(false)
  }

  async function criarGestor(e) {
    e.preventDefault()
    setErro(''); setMsg(''); setCarregando(true)
    const { data, error } = await supabase.auth.signUp({ email, password: senha })
    if (error) { setErro(error.message); setCarregando(false); return }

    if (!data.session) {
      setMsg('Conta criada. Verifique seu e-mail para confirmar o acesso e depois faça login.')
      setCarregando(false)
      return
    }

    const { error: profErr } = await supabase.from('profiles').insert({
      id: data.user.id,
      role: 'gestor',
      nome,
      email,
    })
    if (profErr) setErro(profErr.message)
    setCarregando(false)
  }

  async function criarAluno(e) {
    e.preventDefault()
    setErro(''); setMsg(''); setCarregando(true)
    const { data, error } = await supabase.auth.signUp({ email, password: senha })
    if (error) { setErro(error.message); setCarregando(false); return }

    if (!data.session) {
      setMsg('Conta criada. Verifique seu e-mail para confirmar o acesso e depois faça login.')
      setCarregando(false)
      return
    }

    const { error: profErr } = await supabase.from('profiles').insert({
      id: data.user.id,
      role: 'aluno',
      nome,
      email,
    })
    if (profErr) setErro(profErr.message)
    setCarregando(false)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">PDN</span>
          <span className="auth-brand-name">FISIO PRO</span>
        </div>
        <p className="auth-sub">Diagnóstico e acompanhamento de gestão em saúde</p>

        <div className="auth-tabs">
          <button className={modo === 'entrar' ? 'active' : ''} onClick={() => setModo('entrar')}>Entrar</button>
          <button className={modo === 'criar-aluno' ? 'active' : ''} onClick={() => setModo('criar-aluno')}>Criar conta Aluno</button>
          {mostrarGestor && <button className={modo === 'criar-gestor' ? 'active' : ''} onClick={() => setModo('criar-gestor')}>Sou gestor</button>}
        </div>

        {modo === 'entrar' ? (
          <form onSubmit={entrar} className="auth-form">
            <label>E-mail
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" />
            </label>
            <label>Senha
              <input type="password" required value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" />
            </label>
            <button className="btn-primary" disabled={carregando}>{carregando ? 'Entrando…' : 'Entrar'}</button>
          </form>
        ) : modo === 'criar-aluno' ? (
          <form onSubmit={criarAluno} className="auth-form">
            <label>Nome
              <input required value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
            </label>
            <label>E-mail
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" />
            </label>
            <label>Senha
              <input type="password" required minLength={6} value={senha} onChange={e => setSenha(e.target.value)} placeholder="mínimo 6 caracteres" />
            </label>
            <button className="btn-primary" disabled={carregando}>{carregando ? 'Criando…' : 'Criar minha conta'}</button>
          </form>
        ) : (
          <form onSubmit={criarGestor} className="auth-form">
            <label>Nome
              <input required value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
            </label>
            <label>E-mail
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" />
            </label>
            <label>Senha
              <input type="password" required minLength={6} value={senha} onChange={e => setSenha(e.target.value)} placeholder="mínimo 6 caracteres" />
            </label>
            <button className="btn-primary" disabled={carregando}>{carregando ? 'Criando…' : 'Criar conta de gestor'}</button>
          </form>
        )}

        {erro && <p className="auth-error">{erro}</p>}
        {msg && <p className="auth-msg">{msg}</p>}
      </div>
    </div>
  )
}
