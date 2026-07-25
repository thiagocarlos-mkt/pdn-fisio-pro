import { AREAS } from '../data/pdn'

// respostas: { [areaId]: { [indiceAfirmacao]: valor|null, abertas: {...} } }
export function calcularScores(respostas) {
  const scores = {}
  for (const area of AREAS) {
    const valores = (respostas?.[area.id]?.likert || [])
      .filter((v) => v !== null && v !== undefined)
    const media = valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : null
    scores[area.id] = media != null ? Math.round(media * 100) / 100 : null
  }
  return scores
}

export function identificarGargalos(scores, gargaloPercebidoNome) {
  const entradas = AREAS
    .map((a) => ({ id: a.id, nome: a.nome, media: scores[a.id] }))
    .filter((e) => e.media != null)
    .sort((a, b) => a.media - b.media)

  const primario = entradas[0] || null
  const secundario = entradas[1] || null

  return {
    gargaloPrimario: primario?.nome ?? null,
    gargaloSecundario: secundario?.nome ?? null,
    gargaloPercebido: gargaloPercebidoNome ?? null,
    divergencia: !!(primario && gargaloPercebidoNome && primario.nome !== gargaloPercebidoNome && gargaloPercebidoNome !== 'Não consigo identificar'),
    ranking: entradas,
  }
}

export function mediaGeral(scores) {
  const vals = Object.values(scores).filter((v) => v != null)
  if (!vals.length) return null
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100
}
