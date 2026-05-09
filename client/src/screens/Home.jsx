import { Camera, TrendingUp } from 'lucide-react'
import CalorieRing from '../components/CalorieRing'

const GOAL = { calories: 1800, protein: 80, carbs: 225, fat: 60, sodium: 1500, saturated_fat: 13 }

function heartScore(sodium, satFat) {
  const s = sodium <= GOAL.sodium ? 100 : Math.max(0, 100 - ((sodium - GOAL.sodium) / 15))
  const f = satFat <= GOAL.saturated_fat ? 100 : Math.max(0, 100 - ((satFat - GOAL.saturated_fat) / 0.13))
  return Math.round((s + f) / 2)
}

function MacroRow({ label, value, max, color, unit }) {
  const pct = Math.min((value / max) * 100, 100)
  const over = value > max
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ color: '#555', fontSize: '12px', fontWeight: 500 }}>{label}</span>
        <span style={{ color: over ? '#ef4444' : '#888', fontSize: '12px', fontWeight: 600 }}>
          {value}<span style={{ color: '#333' }}>/{max}{unit}</span>
        </span>
      </div>
      <div style={{ height: '5px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: '3px',
          background: over ? '#ef4444' : color, transition: 'width 0.8s ease',
        }} />
      </div>
    </div>
  )
}

const RATING = {
  green: { label: 'Heart Healthy', color: '#22c55e' },
  yellow: { label: 'In Moderation', color: '#f59e0b' },
  red: { label: 'Not Heart Healthy', color: '#ef4444' },
}
const EMOJI = { green: '🟢', yellow: '🟡', red: '🔴' }

export default function Home({ dailyTotals, todayMeals, onScan }) {
  const score = heartScore(dailyTotals.sodium, dailyTotals.saturated_fat)
  const scoreColor = score >= 80 ? '#22c55e' : score >= 55 ? '#f59e0b' : '#ef4444'
  const greeting = ['morning', 'afternoon', 'evening'][Math.floor(new Date().getHours() / 8)] || 'evening'

  return (
    <div style={{ paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 28px',
        background: 'linear-gradient(180deg, #111 0%, #080808 100%)',
      }}>
        <p style={{ color: '#555', fontSize: '14px', marginBottom: '2px' }}>Good {greeting} 👋</p>
        <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, marginBottom: '28px', letterSpacing: '-0.5px' }}>
          HealthPlate
        </h1>

        <CalorieRing consumed={Math.round(dailyTotals.calories)} goal={GOAL.calories} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          <MacroRow label="Protein" value={Math.round(dailyTotals.protein)} max={GOAL.protein} color="#818cf8" unit="g" />
          <MacroRow label="Carbs" value={Math.round(dailyTotals.carbs)} max={GOAL.carbs} color="#f59e0b" unit="g" />
          <MacroRow label="Fat" value={Math.round(dailyTotals.fat)} max={GOAL.fat} color="#ec4899" unit="g" />
        </div>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Heart Score */}
        <div style={{ background: '#0f0f0f', borderRadius: '20px', padding: '18px', border: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <p style={{ color: '#fff', fontSize: '15px', fontWeight: 700 }}>Heart Score</p>
              <p style={{ color: '#444', fontSize: '12px', marginTop: '2px' }}>
                {Math.round(dailyTotals.sodium)}mg sodium · {Math.round(dailyTotals.saturated_fat)}g sat fat
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: scoreColor, fontSize: '28px', fontWeight: 900 }}>{score}</span>
              <span style={{ color: '#333', fontSize: '14px' }}>/100</span>
            </div>
          </div>
          <div style={{ height: '8px', background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${score}%`, borderRadius: '4px',
              background: scoreColor, transition: 'width 1s ease',
              boxShadow: `0 0 12px ${scoreColor}66`,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ color: '#333', fontSize: '11px' }}>Sodium limit: {GOAL.sodium}mg</span>
            <span style={{ color: '#333', fontSize: '11px' }}>Sat fat limit: {GOAL.saturated_fat}g</span>
          </div>
        </div>

        {/* Scan CTA */}
        <button onClick={onScan} style={{
          width: '100%', background: '#818cf8', color: '#fff', border: 'none',
          borderRadius: '20px', padding: '20px', fontSize: '17px', fontWeight: 700,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', boxShadow: '0 8px 32px rgba(129,140,248,0.25)',
        }}>
          <Camera size={22} />
          Scan a Meal
        </button>

        {/* Meals */}
        {todayMeals.length > 0 ? (
          <div>
            <p style={{ color: '#444', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 12px' }}>
              Today · {todayMeals.length} meal{todayMeals.length > 1 ? 's' : ''}
            </p>
            {todayMeals.map(meal => <MealCard key={meal.id} meal={meal} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#333' }}>
            <p style={{ fontSize: '36px', marginBottom: '10px' }}>🍽️</p>
            <p style={{ fontSize: '15px', color: '#444', fontWeight: 600 }}>No meals logged yet today</p>
            <p style={{ fontSize: '13px', marginTop: '5px', color: '#2a2a2a' }}>Tap Scan to get started</p>
          </div>
        )}
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
      background: '#0f0f0f', borderRadius: '16px', padding: '14px 16px',
      marginBottom: '8px', border: '1px solid #1a1a1a',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ color: '#ddd', fontWeight: 600, fontSize: '14px', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label || 'Meal'}
        </p>
        <p style={{ color: '#444', fontSize: '12px' }}>{time} · {meal.calories} kcal · {meal.sodium}mg Na</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px', flexShrink: 0 }}>
        <span style={{ fontSize: '16px' }}>{EMOJI[meal.rating] || '🟡'}</span>
        <span style={{ color: r.color, fontSize: '11px', fontWeight: 700 }}>{r.label}</span>
      </div>
    </div>
  )
}
