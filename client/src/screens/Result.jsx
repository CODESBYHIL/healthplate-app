import { CheckCircle, X, Lightbulb } from 'lucide-react'

const RATING = {
  green:  { color: '#22c55e', bg: 'rgba(34,197,94,0.07)',  border: 'rgba(34,197,94,0.18)',  label: 'Heart Healthy',      emoji: '🟢', glow: 'rgba(34,197,94,0.18)' },
  yellow: { color: '#f59e0b', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.18)', label: 'Okay in Moderation', emoji: '🟡', glow: 'rgba(245,158,11,0.18)' },
  red:    { color: '#f43f5e', bg: 'rgba(244,63,94,0.07)',  border: 'rgba(244,63,94,0.18)',  label: 'Not Heart Healthy',  emoji: '🔴', glow: 'rgba(244,63,94,0.18)' },
}

function StatCard({ label, value, unit, warn }) {
  return (
    <div style={{
      background: '#181518', borderRadius: '16px', padding: '16px 12px',
      textAlign: 'center',
      border: warn ? '1px solid rgba(244,63,94,0.25)' : '1px solid #2a252a',
    }}>
      <p style={{ color: warn ? '#f43f5e' : '#f5f0f5', fontSize: '21px', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.5px' }}>
        {value}
        <span style={{ fontSize: '11px', fontWeight: 600, color: warn ? 'rgba(244,63,94,0.6)' : '#4a444a', marginLeft: '2px' }}>{unit}</span>
      </p>
      <p style={{ color: warn ? 'rgba(244,63,94,0.6)' : '#4a444a', fontSize: '10px', marginTop: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</p>
    </div>
  )
}

export default function Result({ data, onSave, onDiscard }) {
  const r = RATING[data.rating] || RATING.yellow

  return (
    <div style={{ minHeight: '100vh', background: '#0d0b0c', paddingBottom: '40px' }}>

      {/* Hero */}
      <div style={{
        padding: '60px 20px 32px',
        background: `radial-gradient(ellipse 100% 70% at 50% -5%, ${r.glow} 0%, transparent 65%)`,
        textAlign: 'center',
        borderBottom: '1px solid #2a252a',
      }}>
        <div style={{ fontSize: '50px', marginBottom: '16px', lineHeight: 1 }}>{r.emoji}</div>
        <div style={{
          display: 'inline-block',
          background: r.bg, border: `1px solid ${r.border}`,
          borderRadius: '100px', padding: '8px 22px', marginBottom: '14px',
        }}>
          <span style={{ color: r.color, fontWeight: 800, fontSize: '15px', letterSpacing: '-0.2px' }}>{r.label}</span>
        </div>
        <p style={{ color: '#8a7f8a', fontSize: '14px', lineHeight: '1.6', maxWidth: '300px', margin: '0 auto', fontWeight: 500 }}>
          {data.rating_reason}
        </p>
      </div>

      <div style={{ padding: '20px' }} className="fade-up">

        {/* Calories */}
        <div style={{
          background: '#181518', borderRadius: '20px', padding: '24px',
          textAlign: 'center', marginBottom: '10px', border: '1px solid #2a252a',
        }}>
          <p style={{ color: '#4a444a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '8px' }}>Total Calories</p>
          <p style={{ color: '#f5f0f5', fontSize: '62px', fontWeight: 900, lineHeight: 1, letterSpacing: '-3px' }}>
            {data.calories}
          </p>
          <p style={{ color: '#342f34', fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>kcal</p>
        </div>

        {/* Macros */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
          <StatCard label="Protein" value={data.protein} unit="g" />
          <StatCard label="Carbs"   value={data.carbs}   unit="g" />
          <StatCard label="Fat"     value={data.fat}     unit="g" />
        </div>

        {/* Heart-critical */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
          <StatCard label="Fiber"   value={data.fiber}         unit="g" />
          <StatCard label="Sodium"  value={data.sodium}        unit="mg" warn={data.sodium > 800} />
          <StatCard label="Sat Fat" value={data.saturated_fat} unit="g"  warn={data.saturated_fat > 10} />
        </div>

        {/* Foods detected */}
        {data.foods?.length > 0 && (
          <div style={{
            background: '#181518', borderRadius: '18px', padding: '16px 18px',
            marginBottom: '10px', border: '1px solid #2a252a',
          }}>
            <p style={{ color: '#4a444a', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '12px' }}>
              Foods Detected
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.foods.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#342f34', flexShrink: 0 }} />
                  <span style={{ color: '#8a7f8a', fontSize: '14px', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        {data.tip && (
          <div style={{
            background: '#181518',
            border: '1px solid rgba(244,63,94,0.15)',
            borderRadius: '18px', padding: '16px 18px', marginBottom: '24px',
            display: 'flex', gap: '12px',
          }}>
            <Lightbulb size={18} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ color: '#8a7f8a', fontSize: '14px', lineHeight: '1.65', fontWeight: 500 }}>{data.tip}</p>
          </div>
        )}

        {/* Actions */}
        <button onClick={onSave} style={{
          width: '100%',
          background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
          color: '#fff', border: 'none',
          borderRadius: '18px', padding: '18px',
          fontSize: '17px', fontWeight: 800, letterSpacing: '-0.2px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', marginBottom: '10px',
          boxShadow: '0 8px 28px rgba(244,63,94,0.3)',
          fontFamily: 'inherit',
          transition: 'transform 0.15s ease',
        }}>
          <CheckCircle size={21} />
          Save to Log
        </button>

        <button onClick={onDiscard} style={{
          width: '100%', background: '#181518', color: '#4a444a',
          border: '1px solid #2a252a',
          borderRadius: '18px', padding: '16px',
          fontSize: '15px', fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', fontFamily: 'inherit',
        }}>
          <X size={17} />
          Discard & Rescan
        </button>
      </div>
    </div>
  )
}
