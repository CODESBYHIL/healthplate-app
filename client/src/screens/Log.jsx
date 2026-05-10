import { ArrowLeft, Trash2 } from 'lucide-react'

const RATING = {
  green:  { label: 'Heart Healthy',     color: '#22c55e' },
  yellow: { label: 'In Moderation',     color: '#f59e0b' },
  red:    { label: 'Not Heart Healthy', color: '#f43f5e' },
}
const EMOJI = { green: '🟢', yellow: '🟡', red: '🔴' }

export default function Log({ meals, onBack, onClear }) {
  const grouped = groupByDate(meals)

  return (
    <div style={{ minHeight: '100vh', background: '#0d0b0c', paddingBottom: '100px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '52px 20px 20px',
        background: `radial-gradient(ellipse 100% 60% at 50% -10%, rgba(244,63,94,0.07) 0%, transparent 70%)`,
        borderBottom: '1px solid #2a252a',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={onBack} style={{
            background: '#181518', border: '1px solid #2a252a', borderRadius: '50%',
            width: '44px', height: '44px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
          }}>
            <ArrowLeft size={18} color="#f5f0f5" />
          </button>
          <div>
            <h1 style={{ color: '#f5f0f5', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.4px' }}>Meal Log</h1>
            <p style={{ color: '#4a444a', fontSize: '12px', marginTop: '2px', fontWeight: 500 }}>{meals.length} meals total</p>
          </div>
        </div>
        {meals.length > 0 && (
          <button
            onClick={() => { if (window.confirm('Clear all meals? This cannot be undone.')) onClear() }}
            style={{
              background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.18)',
              borderRadius: '10px', padding: '8px 14px', color: '#f43f5e',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
            }}
          >
            <Trash2 size={14} /> Clear all
          </button>
        )}
      </div>

      <div style={{ padding: '16px 20px' }}>
        {meals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>📋</p>
            <p style={{ fontSize: '16px', color: '#4a444a', fontWeight: 700 }}>No meals logged yet</p>
            <p style={{ fontSize: '13px', color: '#342f34', marginTop: '6px', fontWeight: 500 }}>Your history will appear here</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, dayMeals]) => (
            <div key={date} style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={{ color: '#4a444a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px' }}>
                  {date}
                </p>
                <p style={{ color: '#342f34', fontSize: '12px', fontWeight: 600 }}>
                  {dayMeals.reduce((s, m) => s + (m.calories || 0), 0)} kcal
                </p>
              </div>
              {dayMeals.map(meal => <LogCard key={meal.id} meal={meal} />)}
              <DaySummary meals={dayMeals} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function LogCard({ meal }) {
  const r = RATING[meal.rating] || RATING.yellow
  const time = new Date(meal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const label = meal.foods?.slice(0, 2).join(', ') + (meal.foods?.length > 2 ? ` +${meal.foods.length - 2} more` : '')

  return (
    <div style={{
      background: '#181518', borderRadius: '18px', padding: '16px',
      marginBottom: '8px', border: '1px solid #2a252a',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ flex: 1, minWidth: 0, marginRight: '10px' }}>
          <p style={{ color: '#f5f0f5', fontWeight: 700, fontSize: '14px', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {label || 'Meal'}
          </p>
          <p style={{ color: '#4a444a', fontSize: '12px', fontWeight: 500 }}>{time}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <span style={{ fontSize: '13px' }}>{EMOJI[meal.rating] || '🟡'}</span>
          <span style={{ color: r.color, fontSize: '11px', fontWeight: 700 }}>{r.label}</span>
        </div>
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid #201d20', paddingTop: '12px' }}>
        {[
          { l: 'Cal',  v: meal.calories },
          { l: 'Pro',  v: `${meal.protein}g` },
          { l: 'Carbs', v: `${meal.carbs}g` },
          { l: 'Fat',  v: `${meal.fat}g` },
          { l: 'Na',   v: `${meal.sodium}mg`, warn: meal.sodium > 800 },
        ].map(({ l, v, warn }) => (
          <div key={l} style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ color: '#342f34', fontSize: '10px', marginBottom: '3px', fontWeight: 600 }}>{l}</p>
            <p style={{ color: warn ? '#f43f5e' : '#8a7f8a', fontSize: '13px', fontWeight: 700 }}>{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DaySummary({ meals }) {
  const t = meals.reduce((a, m) => ({
    sodium: a.sodium + (m.sodium || 0),
    saturated_fat: a.saturated_fat + (m.saturated_fat || 0),
    calories: a.calories + (m.calories || 0),
  }), { sodium: 0, saturated_fat: 0, calories: 0 })

  return (
    <div style={{
      background: '#111012', border: '1px solid #201d20', borderRadius: '12px',
      padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ color: '#342f34', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Daily total</span>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span style={{ color: '#4a444a', fontSize: '12px', fontWeight: 600 }}>{t.calories} kcal</span>
        <span style={{ color: t.sodium > 1500 ? '#f43f5e' : '#4a444a', fontSize: '12px', fontWeight: 600 }}>{t.sodium}mg Na</span>
        <span style={{ color: t.saturated_fat > 13 ? '#f43f5e' : '#4a444a', fontSize: '12px', fontWeight: 600 }}>{Math.round(t.saturated_fat)}g sat</span>
      </div>
    </div>
  )
}

function groupByDate(meals) {
  const groups = {}
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  meals.forEach(m => {
    const d = new Date(m.time).toDateString()
    const key = d === today ? 'Today' : d === yesterday ? 'Yesterday' : new Date(m.time).toLocaleDateString([], { month: 'long', day: 'numeric' })
    if (!groups[key]) groups[key] = []
    groups[key].push(m)
  })
  return groups
}
