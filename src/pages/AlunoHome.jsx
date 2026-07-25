import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { MOMENTOS } from '../data/pdn'
import Onboarding from './Onboarding'
import Diagnostico from './Diagnostico'
import DadosMensais from './DadosMensais'
import RelatorioDiagnostico from '../components/RelatorioDiagnostico'

export default function AlunoHome() {
  const { session, profile, signOut } = useAuth()
  const [temCadastro, setTemCadastro] = useState(null)
  const [diagnosticos, setDiagnosticos] = useState([])
  const [aba, setAba] = useState('relatorio')
  const [momentoVisto, setMomentoVisto] = useState('entrada')
  const [respondendo, setRespondendo] = useState(false)

  async function carregar() {
    const { data: cad } = await supabase.from('cadastros').select('aluno_id').eq('aluno_id', session.user.id).maybeSingle()
    setTemCadastro(!!cad)
    const { data: diags } = await supabase.from('diagnosticos').select('*').eq('aluno_id', session.user.id)
    setDiagnosticos(diags || [])
  }

  useEffect(() => { if (session) carregar() }, [session])

  if (temCadastro === null) return <div className="loading-state">Carregando…</div>
  if (!temCadastro) return <Onboarding onDone={carregar} />

  const temDiagnosticoEntrada = diagnosticos.some(d => d.momento === 'entrada')
  if (!temDiagnosticoEntrada && !respondendo) {
    return (
      <div className="page-wrap">
        <div className="page-header"><h1>Vamos ao diagnóstico</h1><p>Com seu cadastro completo, o próximo passo é o diagnóstico inicial de gestão.</p></div>
        <button className="btn-primary" onClick={() => setRespondendo(true)}>Iniciar diagnóstico de entrada</button>
      </div>
    )
  }
  if (respondendo) {
    return <Diagnostico momentoInicial={temDiagnosticoEntrada ? momentoVisto : 'entrada'} onDone={() => { setRespondendo(false); carregar() }} />
  }

  const diagnosticoAtual = diagnosticos.find(d => d.momento === momentoVisto)

  return (
    <div className="page-wrap">
      <div className="topbar">
        <div>
          <span className="topbar-eyebrow">Olá, {profile?.nome}</span>
          <h1>Meu acompanhamento</h1>
        </div>
        <button className="btn-secondary" onClick={signOut}>Sair</button>
      </div>

      <div className="tabs-row">
        <button className={aba === 'relatorio' ? 'active' : ''} onClick={() => setAba('relatorio')}>Relatório</button>
        <button className={aba === 'mensal' ? 'active' : ''} onClick={() => setAba('mensal')}>Dados mensais</button>
      </div>

      {aba === 'relatorio' && (
        <>
          <div className="momento-row">
            <div className="momento-tabs">
              {MOMENTOS.map(m => (
                <button key={m.id} className={momentoVisto === m.id ? 'active' : ''} onClick={() => setMomentoVisto(m.id)}>
                  {m.label}{diagnosticos.some(d => d.momento === m.id) ? '' : ' (pendente)'}
                </button>
              ))}
            </div>
            <button className="btn-primary btn-sm" onClick={() => setRespondendo(true)}>
              {diagnosticoAtual ? 'Refazer este momento' : 'Responder este momento'}
            </button>
          </div>
          <RelatorioDiagnostico diagnostico={diagnosticoAtual} />
        </>
      )}

      {aba === 'mensal' && <DadosMensais alunoId={session.user.id} />}
    </div>
  )
}
