import { useState, useRef } from 'react'
import { ArrowLeft, Camera, ImagePlus, Loader2, AlertCircle, Send, HelpCircle } from 'lucide-react'

// Compress image to under 4MB before sending
async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const MAX = 1200
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
        else { width = Math.round((width * MAX) / height); height = MAX }
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.82)
    }
    img.src = url
  })
}

export default function Scan({ onResult, onBack }) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [clarification, setClarification] = useState(null) // { question, pendingData }
  const [clarificationInput, setClarificationInput] = useState('')
  const fileRef = useRef()
  const cameraRef = useRef()

  const analyze = async (file, extraContext = '') => {
    setLoading(true)
    setError(null)
    try {
      const compressed = await compressImage(file)
      const form = new FormData()
      form.append('image', compressed, 'meal.jpg')
      if (extraContext) form.append('context', extraContext)

      const res = await fetch('/analyze', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || 'Analysis failed')

      if (data.needs_clarification) {
        setClarification({ question: data.clarification_question, file })
        setLoading(false)
      } else {
        onResult(data)
      }
    } catch (e) {
      setError(e.message || 'Could not analyze. Please try again.')
      setLoading(false)
    }
  }

  const handleFile = (file) => {
    if (!file) return
    setClarification(null)
    setError(null)
    setPreview(URL.createObjectURL(file))
    analyze(file)
  }

  const submitClarification = () => {
    if (!clarificationInput.trim() || !clarification?.file) return
    setClarification(null)
    analyze(clarification.file, clarificationInput.trim())
    setClarificationInput('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '52px 20px 20px', gap: '14px' }}>
        <button onClick={onBack} style={{
          background: '#111', border: '1px solid #222', borderRadius: '50%',
          width: '42px', height: '42px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
        }}>
          <ArrowLeft size={18} color="#fff" />
        </button>
        <div>
          <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>Scan Your Meal</h1>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>AI detects every item instantly</p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Preview */}
        <div style={{
          width: '100%', aspectRatio: '1', borderRadius: '24px', overflow: 'hidden',
          background: '#111', border: `2px ${preview ? 'solid #222' : 'dashed #1e1e1e'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', flexShrink: 0,
        }}>
          {preview
            ? <img src={preview} alt="meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍽️</div>
                <p style={{ color: '#555', fontSize: '16px', fontWeight: 600 }}>Take or upload a photo</p>
                <p style={{ color: '#333', fontSize: '13px', marginTop: '6px' }}>Indian, American, any cuisine</p>
              </div>
            )
          }

          {loading && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.88)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '14px',
              backdropFilter: 'blur(6px)',
            }}>
              <div style={{
                width: '68px', height: '68px', borderRadius: '50%',
                background: 'rgba(129,140,248,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Loader2 size={34} color="#818cf8" style={{ animation: 'spin 0.8s linear infinite' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#fff', fontSize: '17px', fontWeight: 700 }}>Analyzing meal…</p>
                <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>Identifying every ingredient</p>
              </div>
            </div>
          )}
        </div>

        {/* Clarification question */}
        {clarification && (
          <div style={{
            background: 'rgba(129,140,248,0.07)', border: '1px solid rgba(129,140,248,0.2)',
            borderRadius: '18px', padding: '16px',
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
              <HelpCircle size={18} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: '#ccc', fontSize: '15px', lineHeight: '1.5', fontWeight: 500 }}>
                {clarification.question}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={clarificationInput}
                onChange={e => setClarificationInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitClarification()}
                placeholder="e.g. dal makhani, butter naan..."
                style={{
                  flex: 1, background: '#111', border: '1px solid #2a2a2a',
                  borderRadius: '12px', padding: '12px 14px',
                  color: '#fff', fontSize: '14px', outline: 'none',
                }}
                autoFocus
              />
              <button onClick={submitClarification} style={{
                background: '#818cf8', border: 'none', borderRadius: '12px',
                width: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}>
                <Send size={18} color="#fff" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '14px', padding: '14px 16px',
            display: 'flex', gap: '10px', alignItems: 'flex-start',
          }}>
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ color: '#ef4444', fontSize: '14px', lineHeight: '1.5' }}>{error}</p>
          </div>
        )}

        <input ref={cameraRef} type="file" accept="image/*" capture="environment"
          style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        <input ref={fileRef} type="file" accept="image/*"
          style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

        <button onClick={() => cameraRef.current.click()} disabled={loading} style={{
          width: '100%', background: loading ? '#141414' : '#818cf8',
          color: loading ? '#444' : '#fff', border: 'none', borderRadius: '18px',
          padding: '18px', fontSize: '17px', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          boxShadow: loading ? 'none' : '0 8px 32px rgba(129,140,248,0.25)',
          transition: 'all 0.2s',
        }}>
          <Camera size={22} />
          Take Photo
        </button>

        <button onClick={() => fileRef.current.click()} disabled={loading} style={{
          width: '100%', background: '#0f0f0f',
          color: loading ? '#333' : '#bbb', border: '1px solid #1e1e1e',
          borderRadius: '18px', padding: '17px', fontSize: '16px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          transition: 'all 0.2s',
        }}>
          <ImagePlus size={20} />
          Upload from Library
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
