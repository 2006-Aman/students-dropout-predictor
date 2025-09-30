import React, { useState } from 'react'
import PageContainer from '@/components/layout/PageContainer'

interface SimpleSettingsProps {
  onRetrain: () => void
  onThresholdChange: (thresholds: { high: number; medium: number }) => void
}

export function SimpleSettings({ onRetrain, onThresholdChange }: SimpleSettingsProps) {
  const [highThreshold, setHighThreshold] = useState(0.7)
  const [mediumThreshold, setMediumThreshold] = useState(0.4)

  const handleThresholdUpdate = () => {
    onThresholdChange({ high: highThreshold, medium: mediumThreshold })
    alert('Risk thresholds updated successfully!')
  }

  return (
    <PageContainer>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          background: 'linear-gradient(to right, #6b7280, #374151)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '0.5rem'
        }}>
          Settings
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          margin: 0
        }}>
          Configure model parameters and system settings
        </p>
      </div>

      <div style={{
        display: 'grid',
        gap: '1.5rem'
      }}>
        {/* Risk Thresholds */}
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
            Risk Thresholds
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '1.5rem'
          }}>
            Adjust the probability thresholds for risk classification
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                High Risk Threshold
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <input
                  type="range"
                  min="0.5"
                  max="0.9"
                  step="0.05"
                  value={highThreshold}
                  onChange={(e) => setHighThreshold(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e5e7eb',
                    outline: 'none'
                  }}
                />
                <span style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  minWidth: '60px'
                }}>
                  {(highThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: '0.5rem 0 0 0'
              }}>
                Students above this threshold are classified as high risk
              </p>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Medium Risk Threshold
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <input
                  type="range"
                  min="0.2"
                  max="0.6"
                  step="0.05"
                  value={mediumThreshold}
                  onChange={(e) => setMediumThreshold(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e5e7eb',
                    outline: 'none'
                  }}
                />
                <span style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#f97316',
                  minWidth: '60px'
                }}>
                  {(mediumThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: '0.5rem 0 0 0'
              }}>
                Students between this and high threshold are medium risk
              </p>
            </div>
          </div>

          <button
            onClick={handleThresholdUpdate}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            💾 Update Thresholds
          </button>
        </div>

        {/* Model Management */}
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
            Model Management
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '0.5rem',
              border: '1px solid #bae6fd'
            }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '0.5rem'
              }}>
                Model Status
              </h4>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#16a34a',
                  borderRadius: '50%'
                }}></div>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#16a34a',
                  fontWeight: '500'
                }}>
                  Active & Ready
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#0c4a6e',
                margin: 0
              }}>
                Last trained: 2 days ago
              </p>
            </div>

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
                Model Performance
              </h4>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#a16207' }}>Accuracy:</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#a16207' }}>94.2%</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#a16207' }}>F1-Score:</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#a16207' }}>0.91</span>
              </div>
            </div>
          </div>

          <button
            onClick={onRetrain}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            🔄 Retrain Model
          </button>
        </div>

        {/* Privacy Settings */}
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
            Privacy & Security
          </h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            marginBottom: '1rem'
          }}>
            <div>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '0.25rem'
              }}>
                Data Anonymization
              </h4>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>
                Automatically anonymize personal identifiers
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '20px',
              backgroundColor: '#16a34a',
              borderRadius: '10px',
              position: 'relative',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                right: '2px'
              }}></div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <div>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                marginBottom: '0.25rem'
              }}>
                Audit Logging
              </h4>
              <p style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                margin: 0
              }}>
                Log all data access and model predictions
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '20px',
              backgroundColor: '#16a34a',
              borderRadius: '10px',
              position: 'relative',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: 'white',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                right: '2px'
              }}></div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
