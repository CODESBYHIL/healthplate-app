import { useState } from 'react'
import Home from './screens/Home'
import Scan from './screens/Scan'
import Result from './screens/Result'
import Log from './screens/Log'
import Nav from './components/Nav'
import './index.css'

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

  const todayMeals = meals.filter(m => {
    const today = new Date().toDateString()
    return new Date(m.time).toDateString() === today
  })

  const dailyTotals = todayMeals.reduce((acc, m) => ({
    calories: acc.calories + (m.calories || 0),
    protein: acc.protein + (m.protein || 0),
    carbs: acc.carbs + (m.carbs || 0),
    fat: acc.fat + (m.fat || 0),
    sodium: acc.sodium + (m.sodium || 0),
    saturated_fat: acc.saturated_fat + (m.saturated_fat || 0),
    fiber: acc.fiber + (m.fiber || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0, saturated_fat: 0, fiber: 0 })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: screen !== 'scan' && screen !== 'result' ? '80px' : '0' }}>
        {screen === 'home' && (
          <Home
            dailyTotals={dailyTotals}
            todayMeals={todayMeals}
            onScan={() => setScreen('scan')}
            onLog={() => setScreen('log')}
          />
        )}
        {screen === 'scan' && (
          <Scan
            onResult={(data) => { setResult(data); setScreen('result') }}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'result' && result && (
          <Result
            data={result}
            onSave={() => { saveMeal(result); setScreen('home') }}
            onDiscard={() => setScreen('scan')}
          />
        )}
        {screen === 'log' && (
          <Log meals={meals} onBack={() => setScreen('home')} onClear={clearLog} />
        )}
      </div>
      {screen !== 'scan' && screen !== 'result' && (
        <Nav screen={screen} onNavigate={setScreen} />
      )}
    </div>
  )
}
