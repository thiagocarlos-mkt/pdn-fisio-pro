import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AREAS, ESCALA, PERCEPCAO_GLOBAL_CAMPOS, MOMENTOS } from '../data/pdn'
import Campo from '../components/Campo'
import { calcularScores, identificarGargalos } from '../lib/scoring'
import { useAuth } from '../context/AuthContext'

const TOTAL_ETAPAS = AREAS.length + 1 // 6 áreas + percepção global

export default function Diagnostico({ momentoInicial = 'entrada', onDone }) {
  const { session } = useAuth()
  const [momento, setMomento] = useState(momentoInicial)
  const [etapa, setEtapa] = useState(0)
  const [respostas, setRespostas] = useState({})
  const [percepcao, setPercepcao] = useState({})
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('diagnosticos').select('*')
        .eq('aluno_id', session.user.id).eq('momento', momento).maybeSingle()
      if (data) {
        setRespostas(data.respostas || {})
        setPercepcao(data.percepcao_global || {})
      } else {
        setRespostas({})
        setPercepcao({})
      }
      setEtapa(0)
    }
    if (session) carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, momento])

  const areaAtual = etapa < AREAS.length ? AREAS[etapa] : null
  const progresso = Math.round(((etapa) / TOTAL_ETAPAS) * 100)

  function setLikert(areaId, idx, valor) {
    setRespostas(r => {
      const areaResp = r[areaId] || { likert: [], abertas: {} }
      const likert = [...(areaResp.likert || [])]
      likert[idx] = valor
      return { ...r, [areaId]: { ...areaResp, likert } }
    })
  }

  function setAberta(areaId, idx, valor) {
    setRespostas(r => {
      const areaResp = r[areaId] || { likert: [], abertas: {} }
      return { ...r, [areaId]: { ...areaResp, abertas: { ...areaResp.abertas, [idx]: valor } } }
    })
  }

  function setPercepcaoCampo(id, valor) {
    setPercepcao(p => ({ ...p, [id]: valor }))
  }

  const scores = useMemo(() => calcularScores(respostas), [respostas])

  async function salvarEAvancar() {
    if (etapa < TOTAL_ETAPAS - 1) {
      setEtapa(e => e + 1)
      window.scrollTo(0, 0)
      return
    }
    // última etapa: calcular tudo e persistir
    setSalvando(true); setErro('')
    const gargalos = identificarGargalos(scores, percepcao.maior_gargalo)
    const { error } = await supabase.from('diagnosticos').upsert({
      aluno_id: session.user.id,
      momento,
      respostas,
      percepcao_global: percepcao,
      scores,
      gargalo_primario: gargalos.gargaloPrimario,
      gargalo_secundario: gargalos.gargaloSecundario,
      gargalo_percebido: gargalos.gargaloPercebido,
    }, { onConflict: 'aluno_id,momento' })
    setSalvando(false)
    if (error) { setErro(error.message); return }
    onDone?.()
  }

  function voltar() {
    if (etapa > 0) { setEtapa(e => e - 1); window.scrollTo(0, 0) }
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1>Diagnóstico de Gestão</h1>
        <label className="momento-select">Momento da aplicação
          <select value={momento} onChange={e => setMomento(e.target.value)}>
            {MOMENTOS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </label>
      </div>

      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progresso}%` }} /></div>
      <p className="progress-label">
        {areaAtual ? `Área ${etapa + 1} de ${AREAS.length}: ${areaAtual.nome}` : 'Percepção global'}
      </p>

      {areaAtual && (
        <div className="area-block">
          <h2>{areaAtual.nome}</h2>
          <p className="area-hint">Avalie cada afirmação de acordo com sua realidade atual.</p>
          {areaAtual.afirmacoes.map((afirmacao, idx) => (
            <div key={idx} className="likert-row">
              <p>{afirmacao}</p>
              <div className="likert-opcoes">
                {ESCALA.map(op => (
                  <button
                    type="button"
                    key={String(op.valor)}
                    className={'likert-btn' + ((respostas[areaAtual.id]?.likert || [])[idx] === op.valor ? ' likert-on' : '')}
                    onClick={() => setLikert(areaAtual.id, idx, op.valor)}
                    title={op.label}
                  >
                    {op.valor ?? 'N/A'}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <h3>Perguntas abertas</h3>
          {areaAtual.perguntasAbertas.map((pergunta, idx) => (
            <label className="campo" key={idx}>
              {pergunta}
              <textarea rows={2}
                value={respostas[areaAtual.id]?.abertas?.[idx] || ''}
                onChange={e => setAberta(areaAtual.id, idx, e.target.value)} />
            </label>
          ))}
        </div>
      )}

      {!areaAtual && (
        <div className="area-block">
          <h2>Percepção Global</h2>
          <div className="form-grid">
            {PERCEPCAO_GLOBAL_CAMPOS.map(campo => (
              <Campo key={campo.id} campo={campo} valor={percepcao[campo.id]} onChange={setPercepcaoCampo} />
            ))}
          </div>
        </div>
      )}

      {erro && <p className="auth-error">{erro}</p>}

      <div className="wizard-actions">
        <button type="button" className="btn-secondary" onClick={voltar} disabled={etapa === 0}>Voltar</button>
        <button type="button" className="btn-primary" onClick={salvarEAvancar} disabled={salvando}>
          {etapa < TOTAL_ETAPAS - 1 ? 'Próxima área' : (salvando ? 'Salvando…' : 'Concluir diagnóstico')}
        </button>
      </div>
    </div>
  )
}
