import { CheckCircle, X, Lightbulb, ChevronRight } from 'lucide-react'

const RATING = {
  green: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', label: 'Heart Healthy', emoji: '🟢', glow: 'rgba(34,197,94,0.15)' },
  yellow: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', label: 'Okay in Moderation', emoji: '🟡', glow: 'rgba(245,158,11,0.15)' },
  red: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', label: 'Not Heart Healthy', emoji: '🔴', glow: 'rgba(239,68,68,0.15)' },
}

function StatCard({ label, value, unit, warn }) {
  return (
    <div style={{ background: '#111', borderRadius: '16px', padding: '16px', textAlign: 'center', border: warn ? '1px solid rgba(239,68,68,0.25)' : '1px solid #1a1a1a' }}>
      <p style={{ color: warn ? '#ef4444' : '#fff', fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>
        {value}
        <span style={{ fontSize: '13px', fontWeight: 500, color: warn ? '#ef4444' : '#555', marginLeft: '2px' }}>{unit}</span>
      </p>
      <p style={{ color: warn ? 'rgba(239,68,68,0.7)' : '#444', fontSize: '11px', marginTop: '5px', fontWeight: 500 }}>{label}</p>
    </div>
  )
}

export default function Result({ data, onSave, onDiscard }) {
  const r = RATING[data.rating] || RATING.yellow

  return (
    <div style={{ minHeight: '100vh', background: '#080808', paddingBottom: '40px' }}>
      {/* Hero rating banner */}
      <div style={{
        padding: '60px 20px 32px',
        background: `radial-gradient(ellipse at 50% 0%, ${r.glow} 0%, transparent 70%)`,
        textAlign: 'center',
        borderBottom: '1px solid #111',
      }}>
        <div style={{ fontSize: '52px', marginBottom: '14px', lineHeight: 1 }}>{r.emoji}</div>
        <div style={{
          display: 'inline-block',
          background: r.bg, border: `1px solid ${r.border}`,
          borderRadius: '100px', padding: '8px 20px', marginBottom: '12px',
        }}>
          <span style={{ color: r.color, fontWeight: 700, fontSize: '16px' }}>{r.label}</span>
        </div>
        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto' }}>
          {data.rating_reason}
        </p>
      </div>

      <div style={{ padding: '20px' }} className="fade-up">
        {/* Calories */}
        <div style={{
          background: '#111', borderRadius: '20px', padding: '24px',
          textAlign: 'center', marginBottom: '12px', border: '1px solid #1a1a1a',
        }}>
          <p style={{ color: '#444', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Calories</p>
          <p style={{ color: '#fff', fontSize: '64px', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>
            {data.calories}
          </p>
          <p style={{ color: '#333', fontSize: '14px', marginTop: '6px' }}>kcal</p>
        </div>

        {/* Main macros grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <StatCard label="Protein" value={data.protein} unit="g" />
          <StatCard label="Carbs" value={data.carbs} unit="g" />
          <StatCard label="Fat" value={data.fat} unit="g" />
        </div>

        {/* Heart-critical macros */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <StatCard label="Fiber" value={data.fiber} unit="g" />
          <StatCard label="Sodium" value={data.sodium} unit="mg" warn={data.sodium > 800} />
          <StatCard label="Sat. Fat" value={data.saturated_fat} unit="g" warn={data.saturated_fat > 10} />
        </div>

        {/* Foods detected */}
        {data.foods?.length > 0 && (
          <div style={{ background: '#111', borderRadius: '18px', padding: '16px 18px', marginBottom: '12px', border: '1px solid #1a1a1a' }}>
            <p style={{ color: '#444', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
              Foods Detected
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.foods.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333', flexShrink: 0 }} />
                  <span style={{ color: '#ccc', fontSize: '14px' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        {data.tip && (
          <div style={{
            background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.15)',
            borderRadius: '18px', padding: '16px 18px', marginBottom: '24px',
            display: 'flex', gap: '12px',
          }}>
            <Lightbulb size={18} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: '#bbb', fontSize: '14px', lineHeight: '1.6' }}>{data.tip}</p>
          </div>
        )}

        {/* Actions */}
        <button onClick={onSave} style={{
          width: '100%', background: '#818cf8', color: '#fff', border: 'none',
          borderRadius: '18px', padding: '18px', fontSize: '17px', fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', marginBottom: '10px', boxShadow: '0 8px 32px rgba(129,140,248,0.25)',
        }}>
          <CheckCircle size={21} />
          Save to Log
        </button>

        <button onClick={onDiscard} style={{
          width: '100%', background: 'transparent', color: '#555', border: '1px solid #1e1e1e',
          borderRadius: '18px', padding: '16px', fontSize: '15px', fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <X size={17} />
          Discard & Rescan
        </button>
      </div>
    </div>
  )
}
