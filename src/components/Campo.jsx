export default function Campo({ campo, valor, onChange }) {
  const set = (v) => onChange(campo.id, v)

  if (campo.tipo === 'texto') {
    return (
      <label className="campo">
        {campo.label}
        <input type="text" value={valor || ''} onChange={e => set(e.target.value)} />
      </label>
    )
  }
  if (campo.tipo === 'numero') {
    return (
      <label className="campo">
        {campo.label}
        <input type="number" value={valor ?? ''} onChange={e => set(e.target.value === '' ? null : Number(e.target.value))} />
      </label>
    )
  }
  if (campo.tipo === 'textarea') {
    return (
      <label className="campo">
        {campo.label}
        <textarea rows={3} value={valor || ''} onChange={e => set(e.target.value)} />
      </label>
    )
  }
  if (campo.tipo === 'select') {
    return (
      <label className="campo">
        {campo.label}
        <select value={valor || ''} onChange={e => set(e.target.value)}>
          <option value="">Selecione…</option>
          {campo.opcoes.map(op => <option key={op} value={op}>{op}</option>)}
        </select>
      </label>
    )
  }
  if (campo.tipo === 'multi') {
    const atual = Array.isArray(valor) ? valor : []
    const toggle = (op) => {
      set(atual.includes(op) ? atual.filter(x => x !== op) : [...atual, op])
    }
    return (
      <div className="campo">
        <span>{campo.label}</span>
        <div className="chip-group">
          {campo.opcoes.map(op => (
            <button type="button" key={op} className={'chip' + (atual.includes(op) ? ' chip-on' : '')} onClick={() => toggle(op)}>
              {op}
            </button>
          ))}
        </div>
      </div>
    )
  }
  if (campo.tipo === 'escala10') {
    return (
      <label className="campo">
        {campo.label}
        <div className="escala10">
          {Array.from({ length: 11 }, (_, i) => i).map(n => (
            <button type="button" key={n} className={'e10-btn' + (valor === n ? ' e10-on' : '')} onClick={() => set(n)}>{n}</button>
          ))}
        </div>
      </label>
    )
  }
  return null
}
