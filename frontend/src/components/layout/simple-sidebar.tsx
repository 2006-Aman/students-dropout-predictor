import React from 'react'

interface SimpleSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  theme: 'light' | 'dark'
  highRiskCount?: number
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: '🏠', description: 'Overview & Analytics' },
  { id: 'upload', name: 'Upload Data', icon: '📤', description: 'Import Student Data' },
  { id: 'single', name: 'Single Student', icon: '👤', description: 'One-Student Prediction' },
  { id: 'high-risk', name: 'High-Risk Students', icon: '⚠️', description: 'At-Risk Students' },
  { id: 'reports', name: 'Reports', icon: '📊', description: 'Generate Reports' },
  { id: 'settings', name: 'Settings', icon: '⚙️', description: 'Configuration' },
]

export function SimpleSidebar({ activeTab, onTabChange, theme, highRiskCount = 0 }: SimpleSidebarProps) {
  const colors = {
    bg: theme === 'dark' ? 'rgba(31,41,55,0.8)' : 'rgba(255,255,255,0.6)',
    border: theme === 'dark' ? '#374151' : '#e5e7eb',
    text: theme === 'dark' ? '#f9fafb' : '#111827',
    muted: theme === 'dark' ? '#9ca3af' : '#6b7280',
  }

  return (
    <aside className="w-72 flex-shrink-0" style={{
      background: colors.bg,
      backdropFilter: 'blur(12px)',
      borderRight: `1px solid ${colors.border}`,
      padding: '1.5rem',
      transition: 'all 0.3s ease',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      boxShadow: '2px 0 12px rgba(0,0,0,0.05)'
    }}>
     

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {navigation.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
                color: isActive ? '#fff' : colors.muted,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                textAlign: 'left',
                width: '100%',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(55,65,81,0.8), rgba(75,85,99,0.8))'
                    : 'linear-gradient(135deg, #f9fafb, #f3f4f6)'
                  e.currentTarget.style.color = colors.text
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = colors.muted
                }
              }}
            >
              {/* Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                background: isActive ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                fontSize: '1.25rem',
                transition: 'all 0.3s ease'
              }}>
                {item.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, transition: 'color 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span>{item.name}</span>
                  {item.id === 'high-risk' && highRiskCount > 0 && (
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: '9999px',
                      animation: 'pulse 2s infinite'
                    }}>
                      {highRiskCount}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>
                  {item.description}
                </p>
              </div>

              {/* Active dot */}
              {isActive && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#fff',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer Card */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        borderRadius: '0.75rem',
        background: theme === 'dark'
          ? 'linear-gradient(to right, rgba(30,64,175,0.15), rgba(109,40,217,0.15))'
          : 'linear-gradient(to right, #dbeafe, #e0e7ff)',
        border: `1px solid ${theme === 'dark' ? '#1e3a8a' : '#bfdbfe'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            background: '#3b82f6',
            color: '#fff',
            fontSize: '1.25rem'
          }}>
            🛡️
          </div>
          <div>
            <p style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: theme === 'dark' ? '#dbeafe' : '#1e40af',
              margin: 0
            }}>
              AI Model Status
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: theme === 'dark' ? '#93c5fd' : '#1d4ed8',
              margin: 0
            }}>
              Model is active and ready
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
