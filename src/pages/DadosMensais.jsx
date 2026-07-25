import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '../lib/supabaseClient'

const CAMPOS = [
  { id: 'faturamento', label: 'Faturamento do mês (R$)', tipo: 'number' },
  { id: 'pacientes_captados', label: 'Pacientes captados', tipo: 'number' },
  { id: 'pacientes_convertidos', label: 'Pacientes convertidos', tipo: 'number' },
  { id: 'valor_investido_trafego', label: 'Valor investido em tráfego (R$)', tipo: 'number' },
  { id: 'pacientes_totais', label: 'Pacientes totais ativos', tipo: 'number' },
  { id: 'horas_trabalhadas', label: 'Horas trabalhadas no mês', tipo: 'number' },
  { id: 'valor_minimo', label: 'Valor mínimo cobrado (R$)', tipo: 'number' },
  { id: 'valor_maximo', label: 'Valor máximo cobrado (R$)', tipo: 'number' },
]

const CAMPOS_TEXTO = [
  { id: 'servicos_oferecidos', label: 'Serviços que oferece hoje' },
  { id: 'estrategias_captacao', label: 'Estratégias de captação usadas no mês' },
  { id: 'estrategias_encantamento', label: 'Estratégias de encantamento usadas no mês' },
]

function mesAtualISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export default function DadosMensais({ alunoId, somenteLeitura = false }) {
  const [mes, setMes] = useState(mesAtualISO())
  const [form, setForm] = useState({})
  const [historico, setHistorico] = useState([])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function carregarHistorico() {
    const { data } = await supabase.from('dados_mensais').select('*').eq('aluno_id', alunoId).order('mes', { ascending: true })
    setHistorico(data || [])
  }

  useEffect(() => { if (alunoId) carregarHistorico() }, [alunoId])

  useEffect(() => {
    const existente = historico.find(h => h.mes === mes)
    setForm(existente || {})
  }, [mes, historico])

  async function salvar(e) {
    e.preventDefault()
    setSalvando(true); setErro('')
    const { error } = await supabase.from('dados_mensais').upsert({ ...form, aluno_id: alunoId, mes }, { onConflict: 'aluno_id,mes' })
    setSalvando(false)
    if (error) { setErro(error.message); return }
    carregarHistorico()
  }

  const chartData = historico.map(h => ({
    mes: new Date(h.mes).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    faturamento: h.faturamento || 0,
  }))

  return (
    <div className="dados-mensais">
      {historico.length > 1 && (
        <div className="mini-chart">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#242938" vertical={false} />
              <XAxis dataKey="mes" tick={{ fill: '#8b93a7', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8b93a7', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: '#161a24', border: '1px solid #2a2f3a', borderRadius: 8 }} />
              <Line type="monotone" dataKey="faturamento" stroke="#7c9cff" strokeWidth={2} dot={{ r: 3 }} name="Faturamento" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!somenteLeitura && (
        <form onSubmit={salvar} className="form-grid">
          <label className="campo">Mês de referência
            <input type="month" value={mes.slice(0, 7)} onChange={e => setMes(`${e.target.value}-01`)} />
          </label>
          {CAMPOS.map(c => (
            <label className="campo" key={c.id}>{c.label}
              <input type="number" step="0.01" value={form[c.id] ?? ''}
                onChange={e => setForm(f => ({ ...f, [c.id]: e.target.value === '' ? null : Number(e.target.value) }))} />
            </label>
          ))}
          {CAMPOS_TEXTO.map(c => (
            <label className="campo" key={c.id}>{c.label}
              <textarea rows={2} value={form[c.id] || ''} onChange={e => setForm(f => ({ ...f, [c.id]: e.target.value }))} />
            </label>
          ))}
          {erro && <p className="auth-error">{erro}</p>}
          <button className="btn-primary" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar dados do mês'}</button>
        </form>
      )}

      <table className="tabela-mensal">
        <thead>
          <tr>
            <th>Mês</th><th>Faturamento</th><th>Captados</th><th>Convertidos</th><th>Tráfego</th><th>Total ativos</th><th>Horas</th>
          </tr>
        </thead>
        <tbody>
          {historico.slice().reverse().map(h => (
            <tr key={h.id}>
              <td>{new Date(h.mes).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })}</td>
              <td>{h.faturamento != null ? `R$ ${h.faturamento}` : '—'}</td>
              <td>{h.pacientes_captados ?? '—'}</td>
              <td>{h.pacientes_convertidos ?? '—'}</td>
              <td>{h.valor_investido_trafego != null ? `R$ ${h.valor_investido_trafego}` : '—'}</td>
              <td>{h.pacientes_totais ?? '—'}</td>
              <td>{h.horas_trabalhadas ?? '—'}</td>
            </tr>
          ))}
          {!historico.length && <tr><td colSpan={7} className="tabela-vazia">Nenhum dado mensal registrado ainda.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
