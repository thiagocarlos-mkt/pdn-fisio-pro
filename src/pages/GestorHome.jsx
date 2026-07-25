import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { supabase, FUNCTIONS_URL } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { AREAS, MOMENTOS, faixaMaturidade } from '../data/pdn'
import { mediaGeral } from '../lib/scoring'
import RelatorioDiagnostico from '../components/RelatorioDiagnostico'
import DadosMensais from './DadosMensais'

export default function GestorHome() {
  const { session, profile, signOut } = useAuth()
  const [alunos, setAlunos] = useState([])
  const [diagnosticosPorAluno, setDiagnosticosPorAluno] = useState({})
  const [selecionado, setSelecionado] = useState(null)
  const [abaAluno, setAbaAluno] = useState('relatorio')
  const [momentoVisto, setMomentoVisto] = useState('entrada')
  const [mostrarAdicionar, setMostrarAdicionar] = useState(false)
  const [nomeNovo, setNomeNovo] = useState('')
  const [emailNovo, setEmailNovo] = useState('')
  const [csvFile, setCsvFile] = useState(null)
  const [criando, setCriando] = useState(false)
  const [resultadoCriacao, setResultadoCriacao] = useState(null)
  const [erro, setErro] = useState('')
  const [visao, setVisao] = useState('lista') // lista | grupo

  async function carregarAlunos() {
    const { data } = await supabase.from('profiles').select('*').eq('gestor_id', session.user.id).order('nome')
    setAlunos(data || [])
    if (data?.length) {
      const { data: diags } = await supabase.from('diagnosticos').select('*').in('aluno_id', data.map(a => a.id))
      const agrupado = {}
      for (const d of diags || []) {
        agrupado[d.aluno_id] = agrupado[d.aluno_id] || {}
        agrupado[d.aluno_id][d.momento] = d
      }
      setDiagnosticosPorAluno(agrupado)
    }
  }

  useEffect(() => { if (session) carregarAlunos() }, [session])

  async function chamarCriarAluno(alunosPayload) {
    setCriando(true); setErro(''); setResultadoCriacao(null)
    const { data: { session: s } } = await supabase.auth.getSession()
    try {
      const resp = await fetch(`${FUNCTIONS_URL}/criar-aluno`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.access_token}` },
        body: JSON.stringify({ alunos: alunosPayload }),
      })
      const json = await resp.json()
      if (!resp.ok) throw new Error(json.error || 'Falha ao criar alunos')
      setResultadoCriacao(json.resultados)
      carregarAlunos()
    } catch (e) {
      setErro(e.message)
    }
    setCriando(false)
  }

  async function adicionarManual(e) {
    e.preventDefault()
    if (!nomeNovo || !emailNovo) return
    await chamarCriarAluno([{ nome: nomeNovo, email: emailNovo }])
    setNomeNovo(''); setEmailNovo('')
  }

  function processarCsv() {
    if (!csvFile) return
    Papa.parse(csvFile, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const linhas = results.data
          .map(row => ({ nome: (row[0] || '').trim(), email: (row[1] || '').trim() }))
          .filter(r => r.nome && r.email)
        if (linhas.length) chamarCriarAluno(linhas)
      },
    })
  }

  const alunoSelecionado = alunos.find(a => a.id === selecionado)
  const diagAtual = selecionado ? diagnosticosPorAluno[selecionado]?.[momentoVisto] : null

  // Visão de grupo: média de cada área entre todos os alunos com diagnóstico de entrada
  const mediasGrupo = AREAS.map(area => {
    const valores = alunos
      .map(a => diagnosticosPorAluno[a.id]?.entrada?.scores?.[area.id])
      .filter(v => v != null)
    const media = valores.length ? Math.round((valores.reduce((x, y) => x + y, 0) / valores.length) * 100) / 100 : null
    return { ...area, media }
  })

  const rankingAlunos = alunos.map(a => {
    const d = diagnosticosPorAluno[a.id]?.entrada
    return { aluno: a, geral: d ? mediaGeral(d.scores || {}) : null, gargalo: d?.gargalo_primario }
  }).sort((x, y) => (x.geral ?? 99) - (y.geral ?? 99))

  return (
    <div className="page-wrap">
      <div className="topbar">
        <div>
          <span className="topbar-eyebrow">Painel do gestor · {profile?.nome}</span>
          <h1>Alunos em acompanhamento</h1>
        </div>
        <button className="btn-secondary" onClick={signOut}>Sair</button>
      </div>

      <div className="gestor-layout">
        <aside className="gestor-sidebar">
          <div className="tabs-row">
            <button className={visao === 'lista' ? 'active' : ''} onClick={() => { setVisao('lista'); setSelecionado(null) }}>Individual</button>
            <button className={visao === 'grupo' ? 'active' : ''} onClick={() => { setVisao('grupo'); setSelecionado(null) }}>Grupo</button>
          </div>

          <button className="btn-primary btn-sm btn-block" onClick={() => setMostrarAdicionar(v => !v)}>
            {mostrarAdicionar ? 'Fechar' : '+ Adicionar aluno'}
          </button>

          {mostrarAdicionar && (
            <div className="add-aluno-box">
              <form onSubmit={adicionarManual} className="form-grid-tight">
                <input placeholder="Nome" value={nomeNovo} onChange={e => setNomeNovo(e.target.value)} />
                <input placeholder="E-mail" type="email" value={emailNovo} onChange={e => setEmailNovo(e.target.value)} />
                <button className="btn-primary btn-sm" disabled={criando}>{criando ? 'Criando…' : 'Adicionar'}</button>
              </form>
              <div className="csv-box">
                <label className="csv-label">CSV (nome,email por linha)
                  <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files?.[0] || null)} />
                </label>
                <button className="btn-secondary btn-sm" onClick={processarCsv} disabled={!csvFile || criando}>Importar CSV</button>
              </div>
              {erro && <p className="auth-error">{erro}</p>}
              {resultadoCriacao && (
                <div className="resultado-criacao">
                  {resultadoCriacao.map(r => (
                    <p key={r.email} className={r.ok ? 'linha-ok' : 'linha-erro'}>
                      {r.email}: {r.ok ? `criado, senha temporária ${r.senha}` : r.erro}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <ul className="aluno-lista">
            {alunos.map(a => {
              const d = diagnosticosPorAluno[a.id]?.entrada
              const geral = d ? mediaGeral(d.scores || {}) : null
              const faixa = faixaMaturidade(geral)
              return (
                <li key={a.id} className={selecionado === a.id ? 'aluno-item active' : 'aluno-item'} onClick={() => { setSelecionado(a.id); setVisao('lista') }}>
                  <span>{a.nome}</span>
                  <span className="aluno-score" style={{ color: faixa.cor }}>{geral ?? '—'}</span>
                </li>
              )
            })}
            {!alunos.length && <li className="tabela-vazia">Nenhum aluno cadastrado ainda.</li>}
          </ul>
        </aside>

        <main className="gestor-main">
          {visao === 'grupo' && (
            <div className="relatorio">
              <h2>Visão de grupo — média por área (momento: entrada)</h2>
              <div className="areas-grid">
                {mediasGrupo.map(a => {
                  const faixa = faixaMaturidade(a.media)
                  return (
                    <div className="area-card" key={a.id}>
                      <div className="area-card-head"><span>{a.nome}</span><span className="area-card-score" style={{ color: faixa.cor }}>{a.media ?? '—'}</span></div>
                      <div className="faixa-barra"><div style={{ width: `${((a.media ?? 0) / 5) * 100}%`, background: faixa.cor }} /></div>
                      <span className="faixa-label" style={{ color: faixa.cor }}>{faixa.label}</span>
                    </div>
                  )
                })}
              </div>
              <h3>Ranking por maturidade geral</h3>
              <table className="tabela-mensal">
                <thead><tr><th>Aluno</th><th>Média geral</th><th>Gargalo primário</th></tr></thead>
                <tbody>
                  {rankingAlunos.map(r => (
                    <tr key={r.aluno.id}><td>{r.aluno.nome}</td><td>{r.geral ?? '—'}</td><td>{r.gargalo ?? '—'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {visao === 'lista' && !selecionado && (
            <div className="empty-state">Selecione um aluno na lista para ver o relatório individual.</div>
          )}

          {visao === 'lista' && selecionado && alunoSelecionado && (
            <>
              <div className="tabs-row">
                <button className={abaAluno === 'relatorio' ? 'active' : ''} onClick={() => setAbaAluno('relatorio')}>Relatório</button>
                <button className={abaAluno === 'mensal' ? 'active' : ''} onClick={() => setAbaAluno('mensal')}>Dados mensais</button>
              </div>
              {abaAluno === 'relatorio' && (
                <>
                  <div className="momento-tabs">
                    {MOMENTOS.map(m => (
                      <button key={m.id} className={momentoVisto === m.id ? 'active' : ''} onClick={() => setMomentoVisto(m.id)}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                  <RelatorioDiagnostico diagnostico={diagAtual} />
                </>
              )}
              {abaAluno === 'mensal' && <DadosMensais alunoId={selecionado} somenteLeitura />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
