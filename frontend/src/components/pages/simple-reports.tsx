// import React from 'react'
import PageContainer from '@/components/layout/PageContainer'

interface ExportHistoryItem {
  id: string
  type: 'csv' | 'pdf' | 'individual'
  fileName: string
  timestamp: Date
  recordCount: number
}

interface SimpleReportsProps {
  onExport: (type: 'csv' | 'pdf' | 'individual') => void
  students?: any[]
  exportHistory?: ExportHistoryItem[]
}

export function SimpleReports({ onExport, students: _students = [], exportHistory = [] }: SimpleReportsProps) {
  return (
    <PageContainer>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '0.5rem'
        }}>
          Reports
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          margin: 0
        }}>
          Generate comprehensive reports and export data for analysis
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            📊
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Full Dataset Export
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Export complete student data with predictions
          </p>
          <button
            onClick={() => onExport('csv')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6'
            }}
          >
            📥 Download CSV
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            📄
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Summary Report
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Generate comprehensive PDF summary report
          </p>
          <button
            onClick={() => onExport('pdf')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b91c1c'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626'
            }}
          >
            📄 Generate PDF
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            👤
          </div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Individual Reports
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Generate individual student reports
          </p>
          <button
            onClick={() => onExport('individual')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#15803d'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#16a34a'
            }}
          >
            👤 Individual PDFs
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          Recent Exports
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {exportHistory.length > 0 ? (
            exportHistory.map((exportItem) => {
              const getIcon = (type: string) => {
                switch (type) {
                  case 'csv': return '📊'
                  case 'pdf': return '📄'
                  case 'individual': return '👤'
                  default: return '📁'
                }
              }
              
              const getTypeLabel = (type: string) => {
                switch (type) {
                  case 'csv': return 'CSV Data'
                  case 'pdf': return 'Summary Report'
                  case 'individual': return 'Individual Reports'
                  default: return 'Export'
                }
              }
              
              const formatTime = (timestamp: Date) => {
                const now = new Date()
                const diff = now.getTime() - timestamp.getTime()
                const minutes = Math.floor(diff / 60000)
                const hours = Math.floor(diff / 3600000)
                const days = Math.floor(diff / 86400000)
                
                if (minutes < 1) return 'Just now'
                if (minutes < 60) return `${minutes}m ago`
                if (hours < 24) return `${hours}h ago`
                return `${days}d ago`
              }
              
              return (
                <div key={exportItem.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '0.5rem',
                      backgroundColor: exportItem.type === 'csv' ? '#dbeafe' : 
                                     exportItem.type === 'pdf' ? '#fee2e2' : '#dcfce7',
                      borderRadius: '0.5rem',
                      color: exportItem.type === 'csv' ? '#1e40af' : 
                             exportItem.type === 'pdf' ? '#dc2626' : '#16a34a'
                    }}>
                      {getIcon(exportItem.type)}
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#111827',
                        margin: 0
                      }}>
                        {exportItem.fileName}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {formatTime(exportItem.timestamp)} • {exportItem.recordCount} records • {getTypeLabel(exportItem.type)}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onExport(exportItem.type)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      border: 'none',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e5e7eb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6'
                    }}
                  >
                    Re-download
                  </button>
                </div>
              )
            })
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📁</div>
              <p style={{ margin: 0, fontSize: '1rem' }}>
                No exports yet
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                Upload data and generate reports to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
