import React from 'react'
import { useTheme } from '@/hooks/useTheme'

export function SimpleNavbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      zIndex: 50,
      width: '100%',
      backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${theme === 'dark' ? '#283244' : '#e6e9ef'}`,
      padding: '0.75rem 1.25rem',
      transition: 'all 0.3s ease',
      boxShadow: theme === 'dark' ? '0 1px 0 rgba(255,255,255,0.04)' : '0 1px 0 rgba(15, 23, 42, 0.04)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1240px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
            color: 'white',
            boxShadow: '0 6px 18px rgba(14,165,233,0.25)'
          }}>
            🧠
          </div>
          <div>
            <h1 style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '0.2px',
              color: theme === 'dark' ? '#e5e7eb' : '#0f172a',
              margin: 0
            }}>
              Student Dropout Predictor
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <p style={{
                fontSize: '0.8rem',
                color: theme === 'dark' ? '#9ca3af' : '#64748b',
                margin: 0
              }}>
                AI-Powered Risk Assessment
              </p>
              <span style={{
                fontSize: '0.7rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: theme === 'dark' ? '#1f2937' : '#e2e8f0',
                color: theme === 'dark' ? '#cbd5e1' : '#334155',
                border: `1px solid ${theme === 'dark' ? '#334155' : '#cbd5e1'}`
              }}>
                v1.0
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Quick search (visual only) */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.6rem',
            backgroundColor: theme === 'dark' ? '#111827' : '#f1f5f9',
            border: `1px solid ${theme === 'dark' ? '#1f2937' : '#e2e8f0'}`,
            borderRadius: '10px'
          }}>
            <span style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#9ca3af' : '#64748b' }}>⌘K</span>
          </div>

          <button 
            onClick={toggleTheme}
            style={{
              padding: '0.5rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: theme === 'dark' ? '#111827' : '#f1f5f9',
              color: theme === 'dark' ? '#e5e7eb' : '#0f172a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              width: '40px',
              height: '40px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#e2e8f0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#111827' : '#f1f5f9'
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          <button style={{
            padding: '0.5rem',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: theme === 'dark' ? '#111827' : '#f1f5f9',
            color: theme === 'dark' ? '#e5e7eb' : '#0f172a',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.3s ease',
            width: '40px',
            height: '40px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#1f2937' : '#e2e8f0'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#111827' : '#f1f5f9'
          }}
          title="Notifications"
          onClick={() => alert('Notifications: No new alerts')}
          >
            🔔
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></span>
          </button>

          <div style={{
            padding: '0.45rem 0.75rem',
            backgroundColor: theme === 'dark' ? '#0f766e' : '#e6fffa',
            color: theme === 'dark' ? '#99f6e4' : '#065f46',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            transition: 'all 0.3s ease',
            border: `1px solid ${theme === 'dark' ? '#115e59' : '#99f6e4'}`
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            System Online
          </div>
        </div>
      </div>
      <div style={{
        height: '3px',
        marginTop: '0.6rem',
        background: 'linear-gradient(90deg, #0ea5e9 0%, #1d4ed8 50%, #0ea5e9 100%)',
        opacity: theme === 'dark' ? 0.35 : 0.5
      }}></div>
    </header>
  )
}