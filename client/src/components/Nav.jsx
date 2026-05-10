import { Home, BookOpen, Camera, Sparkles } from 'lucide-react'

export default function Nav({ screen, onNavigate }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '430px',
      background: 'rgba(13,11,12,0.97)',
      borderTop: '1px solid #2a252a',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '10px 0 30px', zIndex: 100,
      backdropFilter: 'blur(24px)',
    }}>
      <NavBtn label="Home" active={screen === 'home'} onClick={() => onNavigate('home')}>
        <Home size={21} />
      </NavBtn>

      <NavBtn label="Log" active={screen === 'log'} onClick={() => onNavigate('log')}>
        <BookOpen size={21} />
      </NavBtn>

      {/* Center scan button */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-22px' }}>
        <button onClick={() => onNavigate('scan')} style={{
          background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
          borderRadius: '50%', width: '58px', height: '58px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 0 0 6px rgba(244,63,94,0.1), 0 8px 24px rgba(244,63,94,0.35)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <Camera size={24} color="#fff" />
        </button>
        <span style={{ color: '#f43f5e', fontSize: '10px', fontWeight: 700, marginTop: '6px', letterSpacing: '0.3px' }}>Scan</span>
      </div>

      <NavBtn label="Ask AI" active={screen === 'chat'} onClick={() => onNavigate('chat')} accent>
        <Sparkles size={21} />
      </NavBtn>
    </nav>
  )
}

function NavBtn({ label, active, onClick, children, accent }) {
  const activeColor = accent ? '#f43f5e' : '#f5f0f5'
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
      background: 'none', border: 'none', cursor: 'pointer',
      color: active ? activeColor : '#4a444a',
      fontSize: '10px', fontWeight: 700, letterSpacing: '0.3px',
      padding: '4px 20px', transition: 'color 0.2s ease',
    }}>
      {children}
      <span>{label}</span>
    </button>
  )
}
