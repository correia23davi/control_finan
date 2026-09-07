import { useState } from 'react'

export default function Sidebar({ page, setPage, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: '◈' },
    { id: 'income', label: 'Receitas', icon: '↑' },
    { id: 'expenses', label: 'Despesas', icon: '↓' },
    { id: 'savings', label: 'Poupança', icon: '◎' },
  ]

  function handleSelect(id) {
    setPage(id)
    setMenuOpen(false)
  }

  if (isMobile) {
    return (
      <>
        {/* Barra superior: marca + botão hambúrguer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#111318',
            padding: '14px 16px',
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: '#FFFFFF', fontWeight: 600, letterSpacing: '-0.02em' }}>
            Finança
          </div>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: 20,
              cursor: 'pointer',
              borderRadius: 8,
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Overlay escuro atrás do menu */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 25,
            }}
          />
        )}

        {/* Painel do menu, desliza do topo */}
        <nav
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            backgroundColor: '#111318',
            borderTop: '1px solid #1E2028',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            padding: '8px 0',
            maxHeight: menuOpen ? 320 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.2s ease',
            boxShadow: menuOpen ? '0 12px 24px rgba(0,0,0,0.25)' : 'none',
          }}
        >
          {links.map(link => {
            const active = page === link.id
            return (
              <button
                key={link.id}
                onClick={() => handleSelect(link.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '13px 20px',
                  background: active ? '#1E2028' : 'transparent',
                  border: 'none',
                  borderLeft: active ? '3px solid #22C55E' : '3px solid transparent',
                  color: active ? '#FFFFFF' : '#9CA3AF',
                  fontSize: 15,
                  fontFamily: 'var(--font-sans)',
                  fontWeight: active ? 500 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 18, opacity: 0.9 }}>{link.icon}</span>
                {link.label}
              </button>
            )
          })}
        </nav>
      </>
    )
  }

  return (
    <aside
      style={{
        width: 220,
        minHeight: '100vh',
        backgroundColor: '#111318',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 0',
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div style={{ padding: '0 24px 36px' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: '#FFFFFF', fontWeight: 600, letterSpacing: '-0.02em' }}>
          Finança
        </div>
        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Controle Pessoal
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {links.map(link => {
          const active = page === link.id
          return (
            <button
              key={link.id}
              onClick={() => setPage(link.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '11px 24px',
                background: active ? '#1E2028' : 'transparent',
                border: 'none',
                borderLeft: active ? '2px solid #22C55E' : '2px solid transparent',
                color: active ? '#FFFFFF' : '#9CA3AF',
                fontSize: 14,
                fontFamily: 'var(--font-sans)',
                fontWeight: active ? 500 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = '#1A1D24'
                  e.currentTarget.style.color = '#E5E7EB'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }
              }}
            >
              <span style={{ fontSize: 16, opacity: 0.8 }}>{link.icon}</span>
              {link.label}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '0 24px', fontSize: 11, color: '#4B5563' }}>
        {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </div>
    </aside>
  )
}
