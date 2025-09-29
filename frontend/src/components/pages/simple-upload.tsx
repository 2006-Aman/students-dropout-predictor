import React from 'react'
import PageContainer from '@/components/layout/PageContainer'

interface SimpleUploadProps {
  onDataUploaded: (file: File) => void
  isLoading?: boolean
}

export function SimpleUpload({ onDataUploaded, isLoading = false }: SimpleUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onDataUploaded(file)
    }
  }

  return (
    <PageContainer>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: '700',
          background: 'linear-gradient(to right, #2563eb, #9333ea)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '0.5rem'
        }}>
          Upload Data
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          margin: 0
        }}>
          Upload student data to analyze dropout risk
        </p>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        padding: '2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}>
          📤
        </div>
        
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          {isLoading ? 'Processing Data...' : 'Upload Student Data'}
        </h3>
        
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Upload CSV or Excel files containing student information
        </p>

        <div style={{
          border: '2px dashed #d1d5db',
          borderRadius: '0.5rem',
          padding: '2rem',
          marginBottom: '1.5rem',
          backgroundColor: '#f9fafb'
        }}>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer'
            }}
          />
          <div style={{ position: 'relative' }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              📁
            </div>
            <p style={{
              fontSize: '1.125rem',
              fontWeight: '500',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              Click to upload or drag and drop
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              CSV, XLSX files up to 10MB
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
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
              color: '#0369a1',
              marginBottom: '0.5rem'
            }}>
              Required Columns
            </h4>
            <ul style={{
              fontSize: '0.75rem',
              color: '#0c4a6e',
              margin: 0,
              paddingLeft: '1rem'
            }}>
              <li>student_id</li>
              <li>attendance_percentage</li>
              <li>assignment_timeliness</li>
              <li>quiz_test_avg_pct</li>
            </ul>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '0.5rem',
            border: '1px solid #bbf7d0'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#166534',
              marginBottom: '0.5rem'
            }}>
              Optional Columns
            </h4>
            <ul style={{
              fontSize: '0.75rem',
              color: '#14532d',
              margin: 0,
              paddingLeft: '1rem'
            }}>
              <li>age, gender</li>
              <li>socioeconomic_status</li>
              <li>fee_payment_status</li>
              <li>lms_login_count</li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => {
            // Create a sample file download
            const sampleData = `student_id,student_name,age,gender,attendance_percentage,assignment_timeliness,quiz_test_avg_pct,fee_payment_status
STU_001,John Doe,20,Male,85.5,0.8,78.2,Paid
STU_002,Jane Smith,19,Female,92.3,0.9,85.7,Paid
STU_003,Bob Johnson,21,Male,45.2,0.3,52.1,Unpaid`
            
            const blob = new Blob([sampleData], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'sample_student_data.csv'
            a.click()
            window.URL.revokeObjectURL(url)
          }}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
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
          📥 Download Sample Template
        </button>
      </div>
    </PageContainer>
  )
}
