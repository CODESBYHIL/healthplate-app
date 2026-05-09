export default function MacroBar({ label, value, unit, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  const over = value > max

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '12px', color: over ? '#ef4444' : '#fff', fontWeight: 600 }}>
          {value}{unit}
        </span>
      </div>
      <div style={{ height: '6px', background: '#1e1e1e', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: '3px',
          background: over ? '#ef4444' : color,
          transition: 'width 0.6s ease',
        }} />
      </div>
      <div style={{ fontSize: '11px', color: '#555', marginTop: '4px', textAlign: 'right' }}>
        /{max}{unit}
      </div>
    </div>
  )
}
