export default function CalorieRing({ consumed, goal = 1800 }) {
  const pct = Math.min(consumed / goal, 1)
  const r = 72
  const circ = 2 * Math.PI * r
  const color = pct > 1 ? '#ef4444' : pct > 0.85 ? '#f59e0b' : '#818cf8'
  const remaining = Math.max(0, goal - consumed)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
      <div style={{ position: 'relative', width: 176, height: 176, flexShrink: 0 }}>
        <svg width="176" height="176" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="88" cy="88" r={r} fill="none" stroke="#1a1a1a" strokeWidth="10" />
          <circle
            cx="88" cy="88" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${pct * circ} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.4s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '30px', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-1px' }}>
            {consumed}
          </span>
          <span style={{ fontSize: '11px', color: '#444', marginTop: '3px' }}>kcal eaten</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <p style={{ color: '#444', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Goal</p>
          <p style={{ color: '#fff', fontSize: '20px', fontWeight: 800 }}>{goal} <span style={{ color: '#333', fontSize: '13px', fontWeight: 400 }}>kcal</span></p>
        </div>
        <div style={{ width: '1px', height: '1px', background: 'transparent' }} />
        <div>
          <p style={{ color: '#444', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Remaining</p>
          <p style={{ color: remaining === 0 ? '#ef4444' : '#fff', fontSize: '20px', fontWeight: 800 }}>
            {remaining} <span style={{ color: '#333', fontSize: '13px', fontWeight: 400 }}>kcal</span>
          </p>
        </div>
      </div>
    </div>
  )
}
