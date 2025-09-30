// import React from 'react'
import PageContainer from '@/components/layout/PageContainer'

interface Student {
  id: string
  name: string
  dropoutProbability: number
  riskLabel: string
  topFeatures: Array<{ feature: string; value: number }>
  attendance: number
  performance: number
  paymentStatus: string
  assignment_timeliness?: number
  lms_login_count?: number
}

interface SimpleHighRiskProps {
  students: Student[]
  onExport: (type: 'csv' | 'pdf' | 'individual') => void
  isLoading?: boolean
}

export function SimpleHighRisk({ students, onExport, isLoading = false }: SimpleHighRiskProps) {
  console.log('=== SimpleHighRisk Component ===')
  console.log('Students received:', students?.length || 0)
  console.log('Is loading:', isLoading)
  
  if (isLoading) {
    return (
      <PageContainer>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          animation: 'pulse 2s infinite'
        }}>
          ⏳
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          Processing Your Data...
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280'
        }}>
          Please wait while we analyze your student data
        </p>
      </div>
      </PageContainer>
    )
  }

  if (!students || students.length === 0) {
    return (
      <PageContainer>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          📊
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          No Student Data Available
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          marginBottom: '1.5rem'
        }}>
          Upload your CSV file to see high-risk students
        </p>
        <div style={{
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            <strong>Steps:</strong><br/>
            1. Go to "Upload Data" page<br/>
            2. Upload your CSV file<br/>
            3. Return to this page to see results
          </p>
        </div>
      </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          background: 'linear-gradient(to right, #dc2626, #f97316)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '0.5rem'
        }}>
          High-Risk Students
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          margin: 0
        }}>
          {students.length} students identified as high risk for dropout - immediate intervention required
        </p>
      </div>

      {/* Summary Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Risk Summary
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              margin: 0
            }}>
              {students.length} students require immediate attention
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onExport('csv')}
              style={{
                padding: '0.5rem 1rem',
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
              📊 Export CSV
            </button>
            <button
              onClick={() => onExport('pdf')}
              style={{
                padding: '0.5rem 1rem',
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
              📄 Summary Report
            </button>
            <button
              onClick={() => onExport('individual')}
              style={{
                padding: '0.5rem 1rem',
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
              👤 Individual Reports
            </button>
          </div>
        </div>

        {/* Student Cards */}
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {students.map((student, index) => (
            <div
              key={student.id || index}
              style={{
                padding: '1.5rem',
                backgroundColor: '#fef2f2',
                borderRadius: '0.5rem',
                border: '1px solid #fecaca',
                borderLeft: '4px solid #dc2626',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    {student.name || `Student ${index + 1}`}
                  </h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    ID: {student.id || `STU_${String(index + 1).padStart(3, '0')}`}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {student.riskLabel || 'High'} Risk
                  </div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#dc2626'
                  }}>
                    {((student.dropoutProbability || 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Attendance
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {(student.attendance || 0).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Performance
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {(student.performance || 0).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Payment Status
                  </p>
                  <p style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: (student.paymentStatus === 'Paid' || student.paymentStatus === 'paid') ? '#16a34a' : '#dc2626',
                    margin: 0
                  }}>
                    {student.paymentStatus || 'Unknown'}
                  </p>
                </div>
              </div>

              <div>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  Key Risk Factors:
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {(() => {
                    const chips: Array<{ label: string; score: number }> = []
                    // Use provided topFeatures if available
                    if (student.topFeatures && student.topFeatures.length) {
                      student.topFeatures.slice(0, 5).forEach(tf => {
                        chips.push({ label: tf.feature.replace(/_/g, ' '), score: Math.min(1, Math.abs(tf.value)) })
                      })
                    } else {
                      // Fallback from student metrics
                      const att = student.attendance
                      if (typeof att === 'number') chips.push({ label: 'attendance', score: Math.max(0, (60 - Math.min(100, att)) / 100) })
                      const perf = student.performance
                      if (typeof perf === 'number') chips.push({ label: 'quiz/test avg', score: Math.max(0, (65 - Math.min(100, perf)) / 100) })
                      const assign = student.assignment_timeliness
                      if (typeof assign === 'number') {
                        const norm = assign <= 1 ? assign * 100 : assign
                        chips.push({ label: 'assignment timeliness', score: Math.max(0, (60 - Math.min(100, norm)) / 100) })
                      }
                      const lms = student.lms_login_count
                      if (typeof lms === 'number') chips.push({ label: 'lms logins', score: Math.max(0, (5 - Math.max(0, lms)) / 10) })
                      if (student.paymentStatus && String(student.paymentStatus).toLowerCase() !== 'paid') chips.push({ label: 'fee status', score: 0.6 })
                    }
                    return chips
                      .filter(c => c.score > 0)
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 5)
                      .map((c, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}
                        >
                          {c.label}: {(c.score * 100).toFixed(0)}%
                        </span>
                      ))
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
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
          Recommended Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.5rem',
            border: '1px solid #fde68a'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#92400e',
              marginBottom: '0.5rem'
            }}>
              🎯 Academic Support
            </h4>
            <ul style={{
              fontSize: '0.75rem',
              color: '#a16207',
              margin: 0,
              paddingLeft: '1rem'
            }}>
              <li>Schedule one-on-one meetings</li>
              <li>Provide additional tutoring</li>
              <li>Create study groups</li>
            </ul>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#dbeafe',
            borderRadius: '0.5rem',
            border: '1px solid #93c5fd'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: '0.5rem'
            }}>
              💰 Financial Aid
            </h4>
            <ul style={{
              fontSize: '0.75rem',
              color: '#1d4ed8',
              margin: 0,
              paddingLeft: '1rem'
            }}>
              <li>Review payment options</li>
              <li>Connect with financial aid</li>
              <li>Explore scholarship opportunities</li>
            </ul>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#dcfce7',
            borderRadius: '0.5rem',
            border: '1px solid #86efac'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#166534',
              marginBottom: '0.5rem'
            }}>
              🤝 Mentorship
            </h4>
            <ul style={{
              fontSize: '0.75rem',
              color: '#15803d',
              margin: 0,
              paddingLeft: '1rem'
            }}>
              <li>Assign peer mentors</li>
              <li>Connect with alumni</li>
              <li>Provide career guidance</li>
            </ul>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}