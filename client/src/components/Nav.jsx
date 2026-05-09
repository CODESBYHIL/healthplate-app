import { Home, BookOpen, Camera } from 'lucide-react'

export default function Nav({ screen, onNavigate }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '430px',
      background: 'rgba(10,10,10,0.95)', borderTop: '1px solid #1a1a1a',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '10px 0 28px', zIndex: 100,
      backdropFilter: 'blur(20px)',
    }}>
      <NavBtn label="Home" active={screen === 'home'} onClick={() => onNavigate('home')}>
        <Home size={23} />
      </NavBtn>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-20px' }}>
        <button onClick={() => onNavigate('scan')} style={{
          background: '#818cf8', borderRadius: '50%', width: '58px', height: '58px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 0 0 6px rgba(129,140,248,0.12), 0 8px 24px rgba(129,140,248,0.3)',
        }}>
          <Camera size={24} color="#fff" />
        </button>
        <span style={{ color: '#818cf8', fontSize: '10px', fontWeight: 600, marginTop: '5px' }}>Scan</span>
      </div>

      <NavBtn label="Log" active={screen === 'log'} onClick={() => onNavigate('log')}>
        <BookOpen size={23} />
      </NavBtn>
    </nav>
  )
}

function NavBtn({ label, active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
      background: 'none', border: 'none', cursor: 'pointer',
      color: active ? '#fff' : '#444', fontSize: '10px', fontWeight: 600,
      padding: '4px 24px', transition: 'color 0.2s',
    }}>
      {children}
      <span>{label}</span>
    </button>
  )
}
