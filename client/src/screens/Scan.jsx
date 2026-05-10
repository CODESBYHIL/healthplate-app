import { useState, useRef } from 'react'
import { ArrowLeft, Camera, ImagePlus, Loader2, AlertCircle, Send, HelpCircle } from 'lucide-react'

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
      canvas.width = width; canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.82)
    }
    img.src = url
  })
}

export default function Scan({ onResult, onBack }) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [clarification, setClarification] = useState(null)
  const [clarificationInput, setClarificationInput] = useState('')
  const fileRef = useRef()
  const cameraRef = useRef()

  const analyze = async (file, extraContext = '') => {
    setLoading(true); setError(null)
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
    setClarification(null); setError(null)
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
    <div style={{ minHeight: '100vh', background: '#0d0b0c', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '52px 20px 20px', gap: '14px',
        background: `radial-gradient(ellipse 100% 80% at 50% -20%, rgba(244,63,94,0.08) 0%, transparent 70%)`,
      }}>
        <button onClick={onBack} style={{
          background: '#181518', border: '1px solid #2a252a', borderRadius: '50%',
          width: '44px', height: '44px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          transition: 'background 0.15s',
        }}>
          <ArrowLeft size={18} color="#f5f0f5" />
        </button>
        <div>
          <h1 style={{ color: '#f5f0f5', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.4px' }}>Scan Your Meal</h1>
          <p style={{ color: '#4a444a', fontSize: '13px', marginTop: '2px', fontWeight: 500 }}>30+ world cuisines recognized</p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Preview box */}
        <div style={{
          width: '100%', aspectRatio: '1', borderRadius: '24px', overflow: 'hidden',
          background: '#181518',
          border: `1px solid ${preview ? '#2a252a' : '#201d20'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', flexShrink: 0,
        }}>
          {preview
            ? <img src={preview} alt="meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Camera size={28} color="#f43f5e" />
                </div>
                <p style={{ color: '#8a7f8a', fontSize: '15px', fontWeight: 700 }}>Take or upload a photo</p>
                <p style={{ color: '#342f34', fontSize: '13px', marginTop: '5px', fontWeight: 500 }}>30+ world cuisines recognized</p>
              </div>
            )
          }

          {loading && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(13,11,12,0.9)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '16px',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Loader2 size={32} color="#f43f5e" style={{ animation: 'spin 0.9s linear infinite' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#f5f0f5', fontSize: '17px', fontWeight: 800 }}>Analyzing meal…</p>
                <p style={{ color: '#4a444a', fontSize: '13px', marginTop: '4px', fontWeight: 500 }}>Identifying every ingredient</p>
              </div>
            </div>
          )}
        </div>

        {/* Clarification */}
        {clarification && (
          <div style={{
            background: '#181518', border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: '18px', padding: '16px',
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
              <HelpCircle size={18} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: '#f5f0f5', fontSize: '14px', lineHeight: '1.55', fontWeight: 600 }}>
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
                  flex: 1, background: '#201d20', border: '1px solid #2a252a',
                  borderRadius: '12px', padding: '12px 14px',
                  color: '#f5f0f5', fontSize: '14px', outline: 'none',
                  fontFamily: 'inherit',
                }}
                autoFocus
              />
              <button onClick={submitClarification} style={{
                background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
                border: 'none', borderRadius: '12px',
                width: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}>
                <Send size={18} color="#fff" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.2)',
            borderRadius: '14px', padding: '14px 16px',
            display: 'flex', gap: '10px', alignItems: 'flex-start',
          }}>
            <AlertCircle size={18} color="#f43f5e" style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ color: '#f43f5e', fontSize: '14px', lineHeight: '1.5', fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <input ref={cameraRef} type="file" accept="image/*" capture="environment"
          style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        <input ref={fileRef} type="file" accept="image/*"
          style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />

        <button onClick={() => cameraRef.current.click()} disabled={loading} style={{
          width: '100%',
          background: loading ? '#181518' : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
          color: loading ? '#342f34' : '#fff',
          border: loading ? '1px solid #2a252a' : 'none',
          borderRadius: '18px', padding: '18px',
          fontSize: '17px', fontWeight: 800, letterSpacing: '-0.2px',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          boxShadow: loading ? 'none' : '0 8px 28px rgba(244,63,94,0.3)',
          transition: 'all 0.2s', fontFamily: 'inherit',
        }}>
          <Camera size={22} />
          Take Photo
        </button>

        <button onClick={() => fileRef.current.click()} disabled={loading} style={{
          width: '100%', background: '#181518',
          color: loading ? '#342f34' : '#8a7f8a',
          border: '1px solid #2a252a',
          borderRadius: '18px', padding: '17px',
          fontSize: '16px', fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          transition: 'all 0.2s', fontFamily: 'inherit',
        }}>
          <ImagePlus size={20} />
          Upload from Library
        </button>
      </div>
    </div>
  )
}
