import { useState } from 'react'
import Home from './screens/Home'
import Scan from './screens/Scan'
import Result from './screens/Result'
import Log from './screens/Log'
import Chat from './screens/Chat'
import Nav from './components/Nav'
import './index.css'

function calcStreak(meals) {
  if (!meals.length) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 60; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toDateString()
    const hasLog = meals.some(m => new Date(m.time).toDateString() === dateStr)
    if (hasLog) streak++
    else if (i > 0) break
  }
  return streak
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [result, setResult] = useState(null)
  const [meals, setMeals] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hp_meals') || '[]') } catch { return [] }
  })

  const saveMeal = (meal) => {
    const entry = { ...meal, id: Date.now(), time: new Date().toISOString() }
    const updated = [entry, ...meals]
    setMeals(updated)
    localStorage.setItem('hp_meals', JSON.stringify(updated))
  }

  const clearLog = () => {
    setMeals([])
    localStorage.removeItem('hp_meals')
  }

  const todayMeals = meals.filter(m => new Date(m.time).toDateString() === new Date().toDateString())

  const dailyTotals = todayMeals.reduce((acc, m) => ({
    calories:     acc.calories     + (m.calories     || 0),
    protein:      acc.protein      + (m.protein      || 0),
    carbs:        acc.carbs        + (m.carbs        || 0),
    fat:          acc.fat          + (m.fat          || 0),
    sodium:       acc.sodium       + (m.sodium       || 0),
    saturated_fat:acc.saturated_fat+ (m.saturated_fat|| 0),
    fiber:        acc.fiber        + (m.fiber        || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0, saturated_fat: 0, fiber: 0 })

  const streak = calcStreak(meals)
  const hideNav = screen === 'scan' || screen === 'result'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0d0b0c' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: hideNav ? 0 : '84px' }}>
        {screen === 'home' && (
          <Home dailyTotals={dailyTotals} todayMeals={todayMeals} streak={streak} onScan={() => setScreen('scan')} />
        )}
        {screen === 'scan' && (
          <Scan onResult={(data) => { setResult(data); setScreen('result') }} onBack={() => setScreen('home')} />
        )}
        {screen === 'result' && result && (
          <Result data={result} onSave={() => { saveMeal(result); setScreen('home') }} onDiscard={() => setScreen('scan')} />
        )}
        {screen === 'log' && (
          <Log meals={meals} onBack={() => setScreen('home')} onClear={clearLog} />
        )}
        {screen === 'chat' && (
          <Chat dailyTotals={dailyTotals} todayMeals={todayMeals} />
        )}
      </div>
      {!hideNav && <Nav screen={screen} onNavigate={setScreen} />}
    </div>
  )
}
