// API integration for Student Dropout Predictor (with resilient base URL)
let RESOLVED_API_BASE_URL: string | null = (import.meta as any)?.env?.VITE_API_BASE_URL || null

function getApiCandidates(): string[] {
  const candidates: string[] = []
  if (RESOLVED_API_BASE_URL) candidates.push(RESOLVED_API_BASE_URL)
  // Common local defaults
  candidates.push('http://127.0.0.1:8000')
  candidates.push('http://localhost:8000')
  // If served behind the same origin with Nginx proxy, use relative /api
  if (typeof window !== 'undefined') {
    candidates.push(`${window.location.origin}/api`)
    candidates.push('/api')
  }
  return Array.from(new Set(candidates))
}

export interface StudentData {
  student_id: string
  student_name?: string
  attendance_percentage: number
  assignment_timeliness: number
  quiz_test_avg_pct: number
  fee_payment_status: string
  lms_login_count_monthly: number
  time_spent_online_hours_week: number
  age?: number
  gender?: string
  socioeconomic_status?: number
}

export interface PredictionResult {
  student_id: string
  dropout_probability: number
  risk_label: string
  top_features: Array<{ feature: string; shap_value: number }>
  explanation: string
}

export interface ModelStatus {
  is_trained: boolean
  model_version?: string
  feature_columns: string[]
  training_metrics: Record<string, number>
}

export interface DashboardData {
  totalStudents: number
  highRisk: number
  mediumRisk: number
  lowRisk: number
  averageProbability: number
  featureImportance: Array<{ feature: string; importance: number }>
  riskTrend: Array<{ date: string; risk: number }>
}

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const candidates = getApiCandidates()
  let lastError: any = null

  for (const base of candidates) {
    const cleanBase = base.replace(/\/$/, '')
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${cleanBase}${cleanEndpoint}`
    try {
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        throw new APIError(response.status, `API request failed (${response.status}): ${response.statusText}${text ? ` - ${text}` : ''}`)
      }

      // Success: remember this base for future calls
      RESOLVED_API_BASE_URL = base
      return response.json()
    } catch (err: any) {
      lastError = err
      // Try next candidate
    }
  }

  // If all candidates failed, throw informative error
  const tried = candidates.join(', ')
  if (lastError instanceof APIError) throw lastError
  throw new Error(`Network error contacting API. Tried: ${tried}. Last error: ${lastError?.message || 'Failed to fetch'}`)
}

export const api = {
  // Health check
  async healthCheck() {
    return fetchAPI<{ status: string; timestamp: string; model_trained: boolean }>('/health')
  },

  // Model status
  async getModelStatus() {
    return fetchAPI<ModelStatus>('/model/status')
  },

  // Upload data
  async uploadData(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    // Use fetchAPI with base resolution but bypass JSON headers
    const candidates = getApiCandidates()
    let lastError: any = null
    for (const base of candidates) {
      const cleanBase = base.replace(/\/$/, '')
      try {
        const response = await fetch(`${cleanBase}/data/upload`, {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) {
          const text = await response.text().catch(() => '')
          throw new APIError(response.status, `Upload failed (${response.status}): ${response.statusText}${text ? ` - ${text}` : ''}`)
        }
        RESOLVED_API_BASE_URL = base
        return response.json()
      } catch (err) {
        lastError = err
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Upload failed: no API base reachable')
  },

  // Train model
  async trainModel(useHyperparameterTuning = false, useSmote = true) {
    return fetchAPI('/model/train', {
      method: 'POST',
      body: JSON.stringify({
        use_hyperparameter_tuning: useHyperparameterTuning,
        use_smote: useSmote,
      }),
    })
  },

  // Single prediction
  async predictSingle(studentData: StudentData) {
    return fetchAPI<PredictionResult>('/predict', {
      method: 'POST',
      body: JSON.stringify({ student_data: studentData }),
    })
  },

  // Batch prediction
  async predictBatch(studentsData: StudentData[]) {
    return fetchAPI<{
      predictions: PredictionResult[]
      total_students: number
      high_risk_count: number
      medium_risk_count: number
      low_risk_count: number
    }>('/predict/batch', {
      method: 'POST',
      body: JSON.stringify({ students_data: studentsData }),
    })
  },

  // Global explanation
  async getGlobalExplanation() {
    return fetchAPI('/explain/global')
  },

  // Local explanation
  async getLocalExplanation(studentIndex: number) {
    return fetchAPI(`/explain/local/${studentIndex}`)
  },

  // Export CSV
  async exportCSV() {
    const candidates = getApiCandidates()
    let lastError: any = null
    for (const base of candidates) {
      const cleanBase = base.replace(/\/$/, '')
      try {
        const response = await fetch(`${cleanBase}/export/csv`)
        if (!response.ok) {
          const text = await response.text().catch(() => '')
          throw new APIError(response.status, `Export failed (${response.status}): ${response.statusText}${text ? ` - ${text}` : ''}`)
        }
        RESOLVED_API_BASE_URL = base
        return response.blob()
      } catch (err) {
        lastError = err
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Export failed: no API base reachable')
  },

  // Export PDF report
  async exportPDF() {
    const candidates = getApiCandidates()
    let lastError: any = null
    for (const base of candidates) {
      const cleanBase = base.replace(/\/$/, '')
      try {
        const response = await fetch(`${cleanBase}/export/report`)
        if (!response.ok) {
          const text = await response.text().catch(() => '')
          throw new APIError(response.status, `Export failed (${response.status}): ${response.statusText}${text ? ` - ${text}` : ''}`)
        }
        RESOLVED_API_BASE_URL = base
        return response.blob()
      } catch (err) {
        lastError = err
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Export failed: no API base reachable')
  },

  // Download file helper
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

export default api
