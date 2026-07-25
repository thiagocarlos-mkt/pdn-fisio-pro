import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { CADASTRO_CAMPOS } from '../data/pdn'
import Campo from '../components/Campo'
import { useAuth } from '../context/AuthContext'

export default function Onboarding({ onDone }) {
  const { session, refreshProfile } = useAuth()
  const [nome, setNome] = useState('')
  const [dados, setDados] = useState({ email: session?.user?.email || '' })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('cadastros').select('*').eq('aluno_id', session.user.id).maybeSingle()
      if (data) {
        setNome(data.nome_completo || '')
        setDados({ ...data, email: session?.user?.email })
      }
    }
    if (session) carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  function setCampo(id, valor) {
    setDados(d => ({ ...d, [id]: valor }))
  }

  async function salvar(e) {
    e.preventDefault()
    setSalvando(true); setErro('')
    const { email, ...resto } = dados
    const { error: cadastroErr } = await supabase.from('cadastros').upsert({ aluno_id: session.user.id, nome_completo: nome, ...resto })
    if (cadastroErr) { setErro(cadastroErr.message); setSalvando(false); return }

    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: session.user.id,
      nome,
      email: session.user.email,
      role: 'aluno'
    })
    setSalvando(false)
    if (profileErr) { setErro(profileErr.message); return }

    await refreshProfile()
    onDone?.()
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1>Cadastro inicial</h1>
        <p>Antes do diagnóstico, precisamos entender o momento atual do seu negócio.</p>
      </div>
      <form onSubmit={salvar} className="form-grid">
        {CADASTRO_CAMPOS.map(campo => {
          if (campo.id === 'nome_completo') {
            return <div className="campo" key={campo.id}><span>Nome completo</span><input required value={nome} onChange={e => setNome(e.target.value)} /></div>
          }
          if (campo.id === 'email') {
            return <div className="campo" key={campo.id}><span>E-mail</span><input disabled value={session?.user?.email || ''} /></div>
          }
          return <Campo key={campo.id} campo={campo} valor={dados[campo.id]} onChange={setCampo} />
        })}
        {erro && <p className="auth-error">{erro}</p>}
        <button className="btn-primary" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar e continuar para o diagnóstico'}</button>
      </form>
    </div>
  )
}
