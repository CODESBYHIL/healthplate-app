export default function RatingBadge({ rating, size = 'md' }) {
  const map = {
    green: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: 'Heart Healthy', emoji: '🟢' },
    yellow: { color: '#eab308', bg: 'rgba(234,179,8,0.12)', label: 'Okay in Moderation', emoji: '🟡' },
    red: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Not Heart Healthy', emoji: '🔴' },
  }
  const r = map[rating] || map.yellow
  const isLarge = size === 'lg'

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: isLarge ? '10px' : '6px',
      background: r.bg, border: `1px solid ${r.color}33`,
      borderRadius: '100px', padding: isLarge ? '10px 20px' : '6px 12px',
    }}>
      <span style={{ fontSize: isLarge ? '22px' : '14px' }}>{r.emoji}</span>
      <span style={{ color: r.color, fontWeight: 700, fontSize: isLarge ? '18px' : '13px' }}>
        {r.label}
      </span>
    </div>
  )
}
