import { Camera } from 'lucide-react'
import CalorieRing from '../components/CalorieRing'

const GOAL = { calories: 1800, protein: 80, carbs: 225, fat: 60, sodium: 1500, saturated_fat: 13 }

function heartScore(sodium, satFat) {
  const s = sodium <= GOAL.sodium ? 100 : Math.max(0, 100 - ((sodium - GOAL.sodium) / 15))
  const f = satFat <= GOAL.saturated_fat ? 100 : Math.max(0, 100 - ((satFat - GOAL.saturated_fat) / 0.13))
  return Math.round((s + f) / 2)
}

const RATING = {
  green:  { label: 'Heart Healthy',     color: '#22c55e' },
  yellow: { label: 'In Moderation',     color: '#f59e0b' },
  red:    { label: 'Not Heart Healthy', color: '#f43f5e' },
}
const EMOJI = { green: '🟢', yellow: '🟡', red: '🔴' }

export default function Home({ dailyTotals, todayMeals, onScan }) {
  const score = heartScore(dailyTotals.sodium, dailyTotals.saturated_fat)
  const scoreColor = score >= 80 ? '#22c55e' : score >= 55 ? '#f59e0b' : '#f43f5e'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ paddingBottom: '24px' }}>

      {/* Header */}
      <div style={{
        padding: '56px 20px 32px',
        background: `radial-gradient(ellipse 120% 60% at 50% -10%, rgba(244,63,94,0.12) 0%, transparent 70%), #0d0b0c`,
        borderBottom: '1px solid #2a252a',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <p style={{ color: '#4a444a', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{greeting}</p>
            <h1 style={{ color: '#f5f0f5', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.8px', lineHeight: 1 }}>
              Health<span style={{ color: '#f43f5e' }}>Plate</span>
            </h1>
          </div>
          <HeartScorePill score={score} color={scoreColor} />
        </div>

        <CalorieRing consumed={Math.round(dailyTotals.calories)} goal={GOAL.calories} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px' }}>
          <MacroRow label="Protein" value={Math.round(dailyTotals.protein)} max={GOAL.protein} color="#a78bfa" unit="g" />
          <MacroRow label="Carbs"   value={Math.round(dailyTotals.carbs)}   max={GOAL.carbs}   color="#f59e0b" unit="g" />
          <MacroRow label="Fat"     value={Math.round(dailyTotals.fat)}     max={GOAL.fat}     color="#fb923c" unit="g" />
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Heart Score card */}
        <div style={{
          background: '#181518', borderRadius: '20px', padding: '18px 20px',
          border: '1px solid #2a252a',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <p style={{ color: '#f5f0f5', fontSize: '14px', fontWeight: 700 }}>Heart Score</p>
              <p style={{ color: '#4a444a', fontSize: '12px', marginTop: '3px' }}>
                {Math.round(dailyTotals.sodium)}mg sodium · {Math.round(dailyTotals.saturated_fat)}g sat fat
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: scoreColor, fontSize: '30px', fontWeight: 900, letterSpacing: '-1px' }}>{score}</span>
              <span style={{ color: '#342f34', fontSize: '14px' }}>/100</span>
            </div>
          </div>
          <div style={{ height: '6px', background: '#201d20', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${score}%`, borderRadius: '4px',
              background: scoreColor,
              transition: 'width 1.2s cubic-bezier(0.25,1,0.5,1)',
              boxShadow: `0 0 10px ${scoreColor}55`,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ color: '#342f34', fontSize: '10px', fontWeight: 600 }}>Na limit: {GOAL.sodium}mg</span>
            <span style={{ color: '#342f34', fontSize: '10px', fontWeight: 600 }}>Sat fat limit: {GOAL.saturated_fat}g</span>
          </div>
        </div>

        {/* Scan CTA */}
        <button onClick={onScan} style={{
          width: '100%',
          background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
          color: '#fff', border: 'none',
          borderRadius: '20px', padding: '20px',
          fontSize: '17px', fontWeight: 800, letterSpacing: '-0.2px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', boxShadow: '0 8px 32px rgba(244,63,94,0.3)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(244,63,94,0.4)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(244,63,94,0.3)' }}
        >
          <Camera size={22} />
          Scan a Meal
        </button>

        {/* Meals */}
        {todayMeals.length > 0 ? (
          <div style={{ marginTop: '4px' }}>
            <p style={{ color: '#4a444a', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', margin: '8px 0 10px' }}>
              Today · {todayMeals.length} meal{todayMeals.length > 1 ? 's' : ''}
            </p>
            {todayMeals.map(meal => <MealCard key={meal.id} meal={meal} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <p style={{ fontSize: '32px', marginBottom: '10px' }}>🍽️</p>
            <p style={{ fontSize: '15px', color: '#4a444a', fontWeight: 700 }}>No meals logged yet today</p>
            <p style={{ fontSize: '13px', marginTop: '5px', color: '#342f34' }}>Tap Scan to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

function HeartScorePill({ score, color }) {
  return (
    <div style={{
      background: '#181518', border: `1px solid ${color}44`,
      borderRadius: '100px', padding: '6px 14px',
      display: 'flex', alignItems: 'center', gap: '7px',
    }}>
      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      <span style={{ color, fontSize: '13px', fontWeight: 800 }}>{score}</span>
    </div>
  )
}

function MacroRow({ label, value, max, color, unit }) {
  const pct = Math.min((value / max) * 100, 100)
  const over = value > max
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ color: '#8a7f8a', fontSize: '12px', fontWeight: 600 }}>{label}</span>
        <span style={{ color: over ? '#f43f5e' : '#8a7f8a', fontSize: '12px', fontWeight: 700 }}>
          {value}<span style={{ color: '#342f34' }}>/{max}{unit}</span>
        </span>
      </div>
      <div style={{ height: '4px', background: '#201d20', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: '3px',
          background: over ? '#f43f5e' : color,
          transition: 'width 0.9s cubic-bezier(0.25,1,0.5,1)',
        }} />
      </div>
    </div>
  )
}

function MealCard({ meal }) {
  const r = RATING[meal.rating] || RATING.yellow
  const time = new Date(meal.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const label = meal.foods?.slice(0, 2).join(', ') + (meal.foods?.length > 2 ? ` +${meal.foods.length - 2}` : '')

  return (
    <div style={{
      background: '#181518', borderRadius: '16px', padding: '14px 16px',
      marginBottom: '8px', border: '1px solid #2a252a',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ color: '#f5f0f5', fontWeight: 700, fontSize: '14px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label || 'Meal'}
        </p>
        <p style={{ color: '#4a444a', fontSize: '12px', fontWeight: 500 }}>{time} · {meal.calories} kcal · {meal.sodium}mg Na</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px', flexShrink: 0 }}>
        <span style={{ fontSize: '14px' }}>{EMOJI[meal.rating] || '🟡'}</span>
        <span style={{ color: r.color, fontSize: '11px', fontWeight: 700 }}>{r.label}</span>
      </div>
    </div>
  )
}
