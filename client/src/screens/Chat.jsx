import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Sparkles } from 'lucide-react'

const SUGGESTIONS = [
  'What should I eat for dinner tonight?',
  'Is biryani ok for my heart?',
  'How much sodium is in a typical Indian meal?',
  'What are good low-sodium snacks?',
  'Can I eat cheese?',
  'What foods help unclog arteries?',
]

export default function Chat({ dailyTotals, todayMeals }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const content = (text || input).trim()
    if (!content || loading) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            calories: Math.round(dailyTotals.calories),
            protein: Math.round(dailyTotals.protein),
            carbs: Math.round(dailyTotals.carbs),
            fat: Math.round(dailyTotals.fat),
            sodium: Math.round(dailyTotals.sodium),
            saturated_fat: Math.round(dailyTotals.saturated_fat * 10) / 10,
            mealCount: todayMeals.length,
          }
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect right now. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#0d0b0c' }}>

      {/* Header */}
      <div style={{
        padding: '52px 20px 16px',
        background: `radial-gradient(ellipse 120% 80% at 50% -10%, rgba(244,63,94,0.1) 0%, transparent 70%)`,
        borderBottom: '1px solid #2a252a',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(244,63,94,0.3)',
          }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ color: '#f5f0f5', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px', lineHeight: 1 }}>Nutrition AI</h1>
            <p style={{ color: '#4a444a', fontSize: '12px', marginTop: '3px', fontWeight: 500 }}>Ask anything about food & heart health</p>
          </div>
          <div style={{
            marginLeft: 'auto',
            background: '#181518', border: '1px solid #2a252a',
            borderRadius: '100px', padding: '4px 12px',
          }}>
            <span style={{ color: '#4a444a', fontSize: '11px', fontWeight: 600 }}>
              {Math.round(dailyTotals.sodium)}mg Na today
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 0' }}>

        {messages.length === 0 && (
          <div style={{ paddingBottom: '16px' }}>
            <div style={{ textAlign: 'center', padding: '24px 0 20px' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 14px',
                background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={22} color="#f43f5e" />
              </div>
              <p style={{ color: '#f5f0f5', fontSize: '16px', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.3px' }}>
                Your heart health coach
              </p>
              <p style={{ color: '#4a444a', fontSize: '13px', fontWeight: 500, lineHeight: '1.6', maxWidth: '260px', margin: '0 auto' }}>
                Ask me about any food, get meal ideas, or understand your nutrition better.
              </p>
            </div>

            <p style={{ color: '#342f34', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '4px' }}>
              Try asking
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  background: '#181518', border: '1px solid #2a252a',
                  borderRadius: '14px', padding: '13px 16px',
                  color: '#8a7f8a', fontSize: '14px', fontWeight: 500,
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,63,94,0.3)'; e.currentTarget.style.color = '#f5f0f5' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a252a'; e.currentTarget.style.color = '#8a7f8a' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} style={{ height: '16px' }} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px 36px',
        borderTop: '1px solid #2a252a',
        background: 'rgba(13,11,12,0.98)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask about any food..."
            rows={1}
            style={{
              flex: 1, background: '#181518', border: '1px solid #2a252a',
              borderRadius: '16px', padding: '13px 16px',
              color: '#f5f0f5', fontSize: '15px', outline: 'none',
              fontFamily: 'inherit', resize: 'none', lineHeight: '1.5',
              minHeight: '48px', maxHeight: '120px',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(244,63,94,0.35)' }}
            onBlur={e => { e.target.style.borderColor = '#2a252a' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
              background: input.trim() && !loading ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : '#181518',
              border: input.trim() && !loading ? 'none' : '1px solid #2a252a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              boxShadow: input.trim() && !loading ? '0 4px 16px rgba(244,63,94,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <Send size={18} color={input.trim() && !loading ? '#fff' : '#342f34'} />
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '10px', animation: 'fadeUp 0.3s cubic-bezier(0.25,1,0.5,1) forwards',
    }}>
      {!isUser && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: '8px', marginTop: '2px',
        }}>
          <Sparkles size={13} color="#fff" />
        </div>
      )}
      <div style={{
        maxWidth: '80%',
        background: isUser ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : '#181518',
        border: isUser ? 'none' : '1px solid #2a252a',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        padding: '12px 15px',
        boxShadow: isUser ? '0 4px 16px rgba(244,63,94,0.2)' : 'none',
      }}>
        <p style={{
          color: isUser ? '#fff' : '#f5f0f5',
          fontSize: '14px', lineHeight: '1.6', fontWeight: 500,
          whiteSpace: 'pre-wrap',
        }}>
          {message.content}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Sparkles size={13} color="#fff" />
      </div>
      <div style={{
        background: '#181518', border: '1px solid #2a252a',
        borderRadius: '18px 18px 18px 4px', padding: '14px 18px',
        display: 'flex', gap: '5px', alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '6px', height: '6px', borderRadius: '50%', background: '#4a444a',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}
