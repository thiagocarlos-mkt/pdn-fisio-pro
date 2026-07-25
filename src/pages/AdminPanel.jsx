import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { faixaMaturidade } from '../data/pdn'
import { mediaGeral } from '../lib/scoring'
import RelatorioDiagnostico from '../components/RelatorioDiagnostico'

export default function AdminPanel() {
  const { session, signOut } = useAuth()
  const [alunos, setAlunos] = useState([])
  const [diagnosticos, setDiagnosticos] = useState({})
  const [filtro, setFiltro] = useState('30dias')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [alunoSelecionado, setAlunoSelecionado] = useState(null)
  const [diagSelecionado, setDiagSelecionado] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [filtro, dataInicio, dataFim])

  async function carregarDados() {
    setCarregando(true)
    let dataQuery = supabase.from('profiles').select('*').eq('role', 'aluno').order('created_at', { ascending: false })

    if (filtro === 'diario') {
      const hoje = new Date().toISOString().split('T')[0]
      dataQuery = dataQuery.gte('created_at', hoje)
    } else if (filtro === '30dias') {
      const data30 = new Date()
      data30.setDate(data30.getDate() - 30)
      const dataStr = data30.toISOString().split('T')[0]
      dataQuery = dataQuery.gte('created_at', dataStr)
    } else if (filtro === 'personalizado' && dataInicio && dataFim) {
      dataQuery = dataQuery.gte('created_at', dataInicio).lte('created_at', dataFim)
    }

    const { data: alunosData } = await dataQuery
    setAlunos(alunosData || [])

    if (alunosData?.length) {
      const { data: diagData } = await supabase.from('diagnosticos').select('*').in('aluno_id', alunosData.map(a => a.id))
      const agrupado = {}
      for (const d of diagData || []) {
        agrupado[d.aluno_id] = agrupado[d.aluno_id] || {}
        agrupado[d.aluno_id][d.momento] = d
      }
      setDiagnosticos(agrupado)
    }
    setCarregando(false)
  }

  function abrirDiagnostico(aluno) {
    setAlunoSelecionado(aluno)
    setDiagSelecionado(diagnosticos[aluno.id]?.entrada || null)
  }

  const alunosFiltrados = alunos
  const temDiagnosticos = Object.keys(diagnosticos).length > 0

  return (
    <div className="page-wrap">
      <div className="topbar">
        <div>
          <span className="topbar-eyebrow">Painel Administrativo</span>
          <h1>Todos os diagnósticos</h1>
        </div>
        <button className="btn-secondary" onClick={signOut}>Sair</button>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="filtros-box">
            <h3>Filtrar por data</h3>
            <label>
              <input type="radio" checked={filtro === 'diario'} onChange={() => setFiltro('diario')} />
              Diário
            </label>
            <label>
              <input type="radio" checked={filtro === '30dias'} onChange={() => setFiltro('30dias')} />
              Últimos 30 dias
            </label>
            <label>
              <input type="radio" checked={filtro === 'personalizado'} onChange={() => setFiltro('personalizado')} />
              Personalizado
            </label>

            {filtro === 'personalizado' && (
              <div className="datas-range">
                <label>De:
                  <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                </label>
                <label>Até:
                  <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                </label>
              </div>
            )}
          </div>

          <div className="stats-box">
            <p><strong>{alunosFiltrados.length}</strong> alunos</p>
            <p><strong>{temDiagnosticos ? Object.keys(diagnosticos).length : 0}</strong> com diagnóstico</p>
          </div>
        </aside>

        <main className="admin-main">
          {carregando ? (
            <div className="loading">Carregando...</div>
          ) : alunoSelecionado ? (
            <div className="diagnostico-view">
              <button className="btn-voltar" onClick={() => { setAlunoSelecionado(null); setDiagSelecionado(null) }}>← Voltar</button>
              <div className="aluno-info">
                <h2>{alunoSelecionado.nome}</h2>
                <p>{alunoSelecionado.email}</p>
              </div>
              {diagSelecionado ? (
                <RelatorioDiagnostico diagnostico={diagSelecionado} />
              ) : (
                <p className="aviso">Nenhum diagnóstico de entrada encontrado.</p>
              )}
            </div>
          ) : (
            <div className="tabela-wrap">
              <table className="tabela-admin">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Gestor</th>
                    <th>Data de cadastro</th>
                    <th>Diagnóstico</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosFiltrados.length === 0 ? (
                    <tr><td colSpan="6" className="vazio">Nenhum aluno encontrado</td></tr>
                  ) : (
                    alunosFiltrados.map(aluno => {
                      const diag = diagnosticos[aluno.id]?.entrada
                      const geral = diag ? mediaGeral(diag.scores || {}) : null
                      const faixa = faixaMaturidade(geral)
                      return (
                        <tr key={aluno.id}>
                          <td>{aluno.nome}</td>
                          <td>{aluno.email}</td>
                          <td>{aluno.gestor_id ? '✓' : '—'}</td>
                          <td>{new Date(aluno.created_at).toLocaleDateString('pt-BR')}</td>
                          <td>
                            {diag ? (
                              <span className="badge" style={{ background: faixa.cor }}>{geral}</span>
                            ) : (
                              <span className="badge-vazio">—</span>
                            )}
                          </td>
                          <td>
                            {diag ? (
                              <button className="btn-mini" onClick={() => abrirDiagnostico(aluno)}>Ver</button>
                            ) : (
                              <span className="texto-cinza">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
