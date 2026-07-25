import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { AREAS, MOMENTOS, faixaMaturidade } from '../data/pdn'
import { mediaGeral } from '../lib/scoring'

export default function RelatorioDiagnostico({ diagnostico }) {
  if (!diagnostico) {
    return <div className="empty-state">Nenhum diagnóstico respondido ainda para este momento.</div>
  }

  const scores = diagnostico.scores || {}
  const dataRadar = AREAS.map(a => ({ area: a.nome, valor: scores[a.id] ?? 0 }))
  const geral = mediaGeral(scores)
  const momentoLabel = MOMENTOS.find(m => m.id === diagnostico.momento)?.label || diagnostico.momento

  return (
    <div className="relatorio">
      <div className="relatorio-topo">
        <div>
          <span className="tag-momento">{momentoLabel}</span>
          <h2>Roda da Gestão</h2>
          <p className="relatorio-data">Aplicado em {new Date(diagnostico.data_aplicacao).toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="score-geral">
          <span className="score-geral-valor">{geral ?? '—'}</span>
          <span className="score-geral-label">média geral</span>
        </div>
      </div>

      <div className="radar-wrap">
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={dataRadar} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#2a2f3a" />
            <PolarAngleAxis dataKey="area" tick={{ fill: '#c9cedb', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Radar name="Maturidade" dataKey="valor" stroke="#7c9cff" fill="#7c9cff" fillOpacity={0.35} />
            <Tooltip contentStyle={{ background: '#161a24', border: '1px solid #2a2f3a', borderRadius: 8 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="areas-grid">
        {AREAS.map(a => {
          const media = scores[a.id]
          const faixa = faixaMaturidade(media)
          return (
            <div className="area-card" key={a.id}>
              <div className="area-card-head">
                <span>{a.nome}</span>
                <span className="area-card-score" style={{ color: faixa.cor }}>{media ?? '—'}</span>
              </div>
              <div className="faixa-barra"><div style={{ width: `${((media ?? 0) / 5) * 100}%`, background: faixa.cor }} /></div>
              <span className="faixa-label" style={{ color: faixa.cor }}>{faixa.label}</span>
            </div>
          )
        })}
      </div>

      <div className="gargalos-grid">
        <div className="gargalo-card gargalo-primario">
          <span className="gargalo-eyebrow">Gargalo primário</span>
          <strong>{diagnostico.gargalo_primario || '—'}</strong>
        </div>
        <div className="gargalo-card">
          <span className="gargalo-eyebrow">Gargalo secundário</span>
          <strong>{diagnostico.gargalo_secundario || '—'}</strong>
        </div>
        <div className="gargalo-card">
          <span className="gargalo-eyebrow">Gargalo percebido pelo aluno</span>
          <strong>{diagnostico.gargalo_percebido || '—'}</strong>
        </div>
      </div>

      {diagnostico.gargalo_primario && diagnostico.gargalo_percebido &&
        diagnostico.gargalo_primario !== diagnostico.gargalo_percebido &&
        diagnostico.gargalo_percebido !== 'Não consigo identificar' && (
        <div className="ponto-cego">
          <strong>Ponto cego identificado:</strong> o aluno percebe <em>{diagnostico.gargalo_percebido}</em> como
          maior problema, mas os dados apontam <em>{diagnostico.gargalo_primario}</em> como gargalo real.
          Isso pode indicar que o problema percebido é apenas sintoma do gargalo de fato.
        </div>
      )}

      {diagnostico.percepcao_global && (
        <div className="percepcao-bloco">
          <h3>Percepção Global do Aluno</h3>
          <dl>
            {diagnostico.percepcao_global.tres_prioridades && (
              <><dt>Três prioridades para os próximos 6 meses</dt><dd>{diagnostico.percepcao_global.tres_prioridades}</dd></>
            )}
            {diagnostico.percepcao_global.problema_urgente && (
              <><dt>Problema mais urgente</dt><dd>{diagnostico.percepcao_global.problema_urgente}</dd></>
            )}
            {diagnostico.percepcao_global.sabe_mas_nao_fez && (
              <><dt>Sabe que precisa fazer, mas ainda não fez</dt><dd>{diagnostico.percepcao_global.sabe_mas_nao_fez}</dd></>
            )}
            {diagnostico.percepcao_global.o_que_impede && (
              <><dt>O que costuma impedir a execução</dt><dd>{diagnostico.percepcao_global.o_que_impede}</dd></>
            )}
            {diagnostico.percepcao_global.disposicao_mudar != null && (
              <><dt>Disposição para mudar (0–10)</dt><dd>{diagnostico.percepcao_global.disposicao_mudar}</dd></>
            )}
          </dl>
        </div>
      )}
    </div>
  )
}
