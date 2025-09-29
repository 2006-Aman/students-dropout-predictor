import React, { useState } from 'react'
import api, { StudentData, PredictionResult } from '@/lib/api'
import PageContainer from '@/components/layout/PageContainer'

type FormState = Partial<StudentData> & { student_name?: string }

export function SingleStudent() {
  const [form, setForm] = useState<FormState>({
    student_id: '',
    student_name: '',
    fee_payment_status: '',
    gender: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (key: keyof FormState, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      // Build payload with parsed numbers
      const payload: StudentData = {
        student_id: String(form.student_id || '').trim(),
        student_name: form.student_name?.trim() || undefined,
        attendance_percentage: Number(form.attendance_percentage),
        assignment_timeliness: Number(form.assignment_timeliness),
        quiz_test_avg_pct: Number(form.quiz_test_avg_pct),
        fee_payment_status: (form.fee_payment_status || 'Paid') as string,
        lms_login_count_monthly: form.lms_login_count_monthly !== undefined ? Number(form.lms_login_count_monthly) : 0,
        time_spent_online_hours_week: form.time_spent_online_hours_week !== undefined ? Number(form.time_spent_online_hours_week) : 0,
        age: form.age !== undefined && form.age !== null ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        socioeconomic_status: form.socioeconomic_status !== undefined && form.socioeconomic_status !== null ? Number(form.socioeconomic_status) : undefined,
      }

      const res = await api.predictSingle(payload)
      setResult(res)
    } catch (err: any) {
      setError(err?.message || 'Prediction failed')
    } finally {
      setIsLoading(false)
    }
  }

  const riskColor = (label: string) => {
    if (label === 'High') return '#dc2626'
    if (label === 'Medium') return '#ea580c'
    return '#16a34a'
  }

  // Fallback: derive top factors locally if backend gives no explanation
  const getFallbackTopFactors = () => {
    const items: Array<{ feature: string; score: number; note: string }> = []
    const attendance = Number(form.attendance_percentage ?? NaN)
    const assign = Number(form.assignment_timeliness ?? NaN)
    const quiz = Number(form.quiz_test_avg_pct ?? NaN)
    const fee = String(form.fee_payment_status || '').toLowerCase()
    const lms = Number(form.lms_login_count_monthly ?? NaN)

    if (!Number.isNaN(attendance)) {
      const score = Math.max(0, (60 - Math.min(100, attendance)) / 100) // below 60% increases risk
      items.push({ feature: 'attendance_percentage', score, note: attendance + '% attendance' })
    }
    if (!Number.isNaN(assign)) {
      // Support both 0–1 and 0–100 inputs gracefully
      const norm = assign <= 1 ? assign : assign / 100
      const score = Math.max(0, (0.6 - Math.min(1, norm))) // below ~0.6 increases risk
      items.push({ feature: 'assignment_timeliness', score, note: (norm * 100).toFixed(0) + '% on-time' })
    }
    if (!Number.isNaN(quiz)) {
      const score = Math.max(0, (65 - Math.min(100, quiz)) / 100) // below 65% increases risk
      items.push({ feature: 'quiz_test_avg_pct', score, note: quiz + '% average' })
    }
    if (fee) {
      const score = fee.includes('unpaid') ? 0.6 : fee.includes('partial') ? 0.3 : 0
      items.push({ feature: 'fee_payment_status', score, note: fee })
    }
    if (!Number.isNaN(lms)) {
      const score = Math.max(0, (5 - Math.max(0, lms)) / 10) // fewer than 5 logins increases risk
      items.push({ feature: 'lms_login_count_monthly', score, note: `${lms} logins/mo` })
    }

    return items
      .filter(i => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  }

  const getFallbackExplanation = (riskLabel: string | undefined) => {
    const parts: string[] = []
    const attendance = Number(form.attendance_percentage ?? NaN)
    const assign = Number(form.assignment_timeliness ?? NaN)
    const quiz = Number(form.quiz_test_avg_pct ?? NaN)
    const fee = String(form.fee_payment_status || '').toLowerCase()
    const lms = Number(form.lms_login_count_monthly ?? NaN)

    if (!Number.isNaN(attendance) && attendance < 60) {
      parts.push(`very low attendance (${attendance}%) indicates disengagement`)
    } else if (!Number.isNaN(attendance) && attendance < 75) {
      parts.push(`moderate attendance (${attendance}%) may impact consistency`)
    }

    const normAssign = Number.isNaN(assign) ? NaN : (assign <= 1 ? assign * 100 : assign)
    if (!Number.isNaN(normAssign) && normAssign < 60) {
      parts.push(`late assignment submissions (~${normAssign.toFixed(0)}% on-time)`)
    }

    if (!Number.isNaN(quiz) && quiz < 65) {
      parts.push(`low quiz/test average (${quiz}%) suggests academic difficulty`)
    }

    if (fee.includes('unpaid') || fee.includes('partial')) {
      parts.push(`fee status (${fee}) may add financial stress`)
    }

    if (!Number.isNaN(lms) && lms < 5) {
      parts.push(`very low LMS logins (${lms}/month)`) 
    }

    const prefix = riskLabel ? `Predicted ${riskLabel} risk due to ` : 'Risk drivers: '
    return parts.length ? prefix + parts.join(', ') + '.' : 'Risk assessment based on attendance, timeliness, performance, fees, and LMS activity.'
  }

  return (
    <PageContainer>
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          background: 'linear-gradient(to right, #2563eb, #9333ea)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '0.5rem'
        }}>Single Student Prediction</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
            Enter the details below to analyze dropout risk in real time
          </p>
          <span style={{ fontSize: '.75rem', padding: '.2rem .5rem', borderRadius: '9999px', background: '#e2e8f0', color: '#334155', border: '1px solid #cbd5e1' }}>
            Required fields are marked with *
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gap: '1.25rem',
        backgroundColor: 'white',
        borderRadius: '0.9rem',
        padding: '1.5rem',
        border: '1px solid #e6e9ef',
        boxShadow: '0 6px 18px rgba(15,23,42,0.06)'
      }}>
        {/* Identity section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Student Information</h3>
          <span style={{ fontSize: '.75rem', color: '#64748b' }}>Basic details</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>Student ID <span style={{ color: '#ef4444' }}>*</span></label>
            <input required value={form.student_id} placeholder="e.g., STU_1200" onChange={e => handleChange('student_id', e.target.value)}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>Student Name</label>
            <input value={form.student_name} placeholder="e.g., John Doe"
              onChange={e => handleChange('student_name', e.target.value)}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>Gender</label>
            <select value={form.gender || ''} onChange={e => handleChange('gender', e.target.value)}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', background: 'white' }}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Academic/engagement */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Academic & Engagement</h3>
          <span style={{ fontSize: '.75rem', color: '#64748b' }}>Performance & activity</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>Attendance % <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="number" min={0} max={100} step={0.1}
              placeholder="0 - 100"
              required value={form.attendance_percentage ?? ''}
              onChange={e => handleChange('attendance_percentage', Number(e.target.value))}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>Assignment Timeliness (0–1) <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="number" min={0} max={1} step={0.01}
              placeholder="e.g., 0.75"
              required value={form.assignment_timeliness ?? ''}
              onChange={e => handleChange('assignment_timeliness', Number(e.target.value))}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', outline: 'none' }} />
            <small style={{ color: '#94a3b8' }}>Tip: 0.75 means 75% on-time</small>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>Quiz/Test Avg % <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="number" min={0} max={100} step={0.1}
              placeholder="0 - 100"
              required value={form.quiz_test_avg_pct ?? ''}
              onChange={e => handleChange('quiz_test_avg_pct', Number(e.target.value))}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Additional Factors</h3>
          <span style={{ fontSize: '.75rem', color: '#64748b' }}>Optional but helpful</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>Fee Payment Status</label>
            <select value={form.fee_payment_status || ''} onChange={e => handleChange('fee_payment_status', e.target.value)}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', background: 'white' }}>
              <option value="">Select</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>LMS Logins (monthly)</label>
            <input type="number" min={0} step={1} placeholder="e.g., 12"
              value={form.lms_login_count_monthly ?? ''}
              onChange={e => handleChange('lms_login_count_monthly', Number(e.target.value))}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>Time Spent Online (hrs/week)</label>
            <input type="number" min={0} step={0.1} placeholder="e.g., 6.5"
              value={form.time_spent_online_hours_week ?? ''}
              onChange={e => handleChange('time_spent_online_hours_week', Number(e.target.value))}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '.8rem', color: '#64748b', marginBottom: '.25rem' }}>Socioeconomic Status (1–5)</label>
            <input type="number" min={1} max={5} step={1} placeholder="1 to 5"
              value={form.socioeconomic_status ?? ''}
              onChange={e => handleChange('socioeconomic_status', Number(e.target.value))}
              style={{ width: '100%', padding: '.7rem .85rem', border: '1px solid #e2e8f0', borderRadius: '.6rem', outline: 'none' }} />
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', marginTop: '.25rem' }}>
          <button type="submit" disabled={isLoading}
            style={{
              padding: '.8rem 1.1rem',
              backgroundColor: '#1d4ed8',
              color: 'white',
              border: 'none',
              borderRadius: '.6rem',
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(29,78,216,0.2)'
            }}>
            {isLoading ? 'Predicting...' : 'Predict Dropout Risk'}
          </button>
          <button type="button" onClick={() => { setResult(null); setError(null); setForm({ student_id: '', student_name: '', fee_payment_status: '', gender: '' }) }}
            style={{
              padding: '.8rem 1.1rem',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
              borderRadius: '.6rem',
              cursor: 'pointer'
            }}>
            Reset
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', padding: '.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '.6rem' }}>{error}</div>
      )}

      {result && (
        <div style={{
          marginTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '.75rem', padding: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>Student</h3>
            <div style={{ marginTop: '.75rem', fontSize: '1rem', color: '#111827', lineHeight: 1.6 }}>
              <div><span style={{ color: '#6b7280' }}>student id :</span> {result.student_id || '—'}</div>
              <div><span style={{ color: '#6b7280' }}>Name :</span> {((form.student_name || '').trim()) || '—'}</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '.75rem', padding: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>Dropout Probability</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>{(result.dropout_probability * 100).toFixed(1)}%</div>
            <div style={{ marginTop: '.5rem', fontWeight: 700, color: riskColor(result.risk_label) }}>{result.risk_label} Risk</div>
          </div>

          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '.75rem', padding: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>Top Factors</h3>
            <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1rem' }}>
              {(result.top_features && result.top_features.length > 0
                ? result.top_features.slice(0, 5).map((f, idx) => (
                    <li key={idx} style={{ fontSize: '.9rem' }}>
                      {(f as any).feature || 'feature'}: {typeof (f as any).shap_value === 'number' ? (f as any).shap_value.toFixed(3) : String((f as any).shap_value)}
                    </li>
                  ))
                : getFallbackTopFactors().map((f, idx) => (
                    <li key={idx} style={{ fontSize: '.9rem' }}>
                      {f.feature.replace(/_/g, ' ')} — impact {f.score.toFixed(2)} ({f.note})
                    </li>
                  )))}
            </ul>
          </div>

          {/* Key Risk Factors (compact chips) */}
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '.75rem', padding: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>Key Risk Factors</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.75rem' }}>
              {(result.top_features && result.top_features.length > 0
                ? result.top_features.slice(0, 5).map((f, idx) => {
                    const name = String((f as any).feature || 'factor').replace(/_/g, ' ')
                    const val = (f as any).shap_value
                    const magnitude = typeof val === 'number' ? Math.min(1, Math.abs(val)) : 0.2
                    return (
                      <span key={idx} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '.5rem',
                        padding: '.35rem .6rem',
                        borderRadius: '9999px',
                        backgroundColor: '#f1f5f9',
                        border: '1px solid #e5e7eb',
                        fontSize: '.85rem',
                        color: '#0f172a'
                      }}>
                        {name}
                        <span style={{
                          display: 'inline-block', width: '60px', height: '6px', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden'
                        }}>
                          <span style={{ display: 'block', height: '100%', width: `${magnitude * 100}%`, background: 'linear-gradient(90deg,#f97316,#ef4444)' }}></span>
                        </span>
                      </span>
                    )
                  })
                : getFallbackTopFactors().map((f, idx) => (
                    <span key={idx} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '.5rem',
                      padding: '.35rem .6rem',
                      borderRadius: '9999px',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #e5e7eb',
                      fontSize: '.85rem',
                      color: '#0f172a'
                    }}>
                      {f.feature.replace(/_/g, ' ')}
                      <span style={{
                        display: 'inline-block', width: '60px', height: '6px', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden'
                      }}>
                        <span style={{ display: 'block', height: '100%', width: `${Math.min(1, f.score) * 100}%`, background: 'linear-gradient(90deg,#f97316,#ef4444)' }}></span>
                      </span>
                    </span>
                  )))}
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '.75rem', padding: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>Explanation</h3>
            <p style={{ marginTop: '.75rem' }}>
              {result.explanation && result.explanation !== 'No explanation available'
                ? result.explanation
                : getFallbackExplanation(result.risk_label)}
            </p>
          </div>
        </div>
      )}
    </div>
    </PageContainer>
  )
}

export default SingleStudent


