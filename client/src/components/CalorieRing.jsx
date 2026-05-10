export default function CalorieRing({ consumed, goal = 1800 }) {
  const pct = Math.min(consumed / goal, 1)
  const r = 70
  const circ = 2 * Math.PI * r
  const color = pct > 1 ? '#f43f5e' : pct > 0.85 ? '#f59e0b' : '#f43f5e'
  const remaining = Math.max(0, goal - consumed)
  const overBudget = consumed > goal

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
      <div style={{ position: 'relative', width: 172, height: 172, flexShrink: 0 }}>
        <svg width="172" height="172" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="86" cy="86" r={r} fill="none" stroke="#201d20" strokeWidth="9" />
          <circle
            cx="86" cy="86" r={r} fill="none"
            stroke={color} strokeWidth="9"
            strokeDasharray={`${pct * circ} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.25,1,0.5,1), stroke 0.4s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '2px',
        }}>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#f5f0f5', lineHeight: 1, letterSpacing: '-1px' }}>
            {consumed}
          </span>
          <span style={{ fontSize: '10px', color: '#4a444a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>kcal</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Stat label="Daily Goal" value={goal} unit="kcal" />
        <div style={{ height: '1px', background: '#201d20' }} />
        <Stat
          label={overBudget ? 'Over Budget' : 'Remaining'}
          value={overBudget ? consumed - goal : remaining}
          unit="kcal"
          warn={overBudget}
        />
      </div>
    </div>
  )
}

function Stat({ label, value, unit, warn }) {
  return (
    <div>
      <p style={{ color: '#4a444a', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>{label}</p>
      <p style={{ color: warn ? '#f43f5e' : '#f5f0f5', fontSize: '19px', fontWeight: 800, letterSpacing: '-0.5px' }}>
        {value} <span style={{ color: '#4a444a', fontSize: '12px', fontWeight: 500 }}>{unit}</span>
      </p>
    </div>
  )
}
