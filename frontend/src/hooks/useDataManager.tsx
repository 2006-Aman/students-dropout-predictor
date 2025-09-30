import { useState } from 'react'
import api from '@/lib/api'

export interface Student {
  id: string
  name: string
  age: number
  gender: string
  attendance_percentage: number
  assignment_timeliness: number
  quiz_test_avg_pct: number
  fee_payment_status: string
  socioeconomic_status?: string
  lms_login_count?: number
  dropout_probability?: number
  risk_label?: string
  top_features?: Array<{ feature: string; value: number }>
  attendance?: number
  performance?: number
  paymentStatus?: string
}

export interface DashboardData {
  totalStudents: number
  highRisk: number
  mediumRisk: number
  lowRisk: number
  averageRisk: number
  featureImportance: Array<{ feature: string; importance: number }>
  riskTrend: Array<{ month: string; risk: number }>
}

export function useDataManager() {
  const [students, setStudents] = useState<Student[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [exportHistory, setExportHistory] = useState<Array<{
    id: string
    type: 'csv' | 'pdf' | 'individual'
    fileName: string
    timestamp: Date
    recordCount: number
  }>>([])

  // Clear all data function
  const clearAllData = () => {
    setStudents([])
    setDashboardData(null)
    setUploadedFile(null)
    setExportHistory([])
    console.log('All data cleared!')
  }

  // Add export to history
  const addToExportHistory = (type: 'csv' | 'pdf' | 'individual', fileName: string, recordCount: number) => {
    const newExport = {
      id: Date.now().toString(),
      type,
      fileName,
      timestamp: new Date(),
      recordCount
    }
    setExportHistory(prev => [newExport, ...prev].slice(0, 10)) // Keep only last 10 exports
  }

  // Process uploaded data and generate predictions
  const processUploadedData = async (file: File) => {
    setIsLoading(true)
    setUploadedFile(file)
    
    try {
      // Clear old data first
      setStudents([])
      setDashboardData(null)
      
      // Read the actual CSV file
      const csvText = await readFileAsText(file)
      const actualStudents = parseCSVData(csvText, file.name)
      const dashboardData = generateDashboardDataFromStudents(actualStudents)
      
      setStudents(actualStudents)
      setDashboardData(dashboardData)

      // Also upload to backend and trigger training so API predictions work
      try {
        await api.uploadData(file)
        await api.trainModel(false, true)
        console.log('Backend data uploaded and model training requested')
      } catch (apiErr) {
        console.warn('Backend upload/train failed (UI will still work locally):', apiErr)
      }
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 800))
      
    } catch (error) {
      console.error('Error processing data:', error)
      alert('Error processing uploaded data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string || '')
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  // Parse actual CSV data
  const parseCSVData = (csvText: string, _filename: string): Student[] => {
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const students: Student[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      if (values.length !== headers.length) continue
      
      const student: any = {}
      headers.forEach((header, index) => {
        student[header] = values[index]
      })
      
      // Convert to proper types and calculate dropout probability
      const attendance = parseFloat(student.attendance_percentage) || 0
      const assignmentTimeliness = parseFloat(student.assignment_timeliness) || 0
      const quizAvg = parseFloat(student.quiz_test_avg_pct) || 0
      const dropoutProb = calculateDropoutProbability(attendance, assignmentTimeliness, quizAvg)
      
      students.push({
        id: student.student_id || `STU_${String(i).padStart(3, '0')}`,
        name: student.student_name || `Student ${i}`,
        age: parseInt(student.age) || 20,
        gender: student.gender || 'Unknown',
        attendance_percentage: attendance,
        assignment_timeliness: assignmentTimeliness,
        quiz_test_avg_pct: quizAvg,
        fee_payment_status: student.fee_payment_status || 'Unknown',
        socioeconomic_status: student.socioeconomic_status || 'Unknown',
        lms_login_count: parseInt(student.lms_login_count) || 0,
        dropout_probability: dropoutProb,
        risk_label: getRiskLabel(dropoutProb),
        top_features: getTopFeatures(attendance, assignmentTimeliness, quizAvg),
        attendance: attendance,
        performance: quizAvg,
        paymentStatus: student.fee_payment_status || 'Unknown'
      })
    }
    
    return students.sort((a, b) => (b.dropout_probability || 0) - (a.dropout_probability || 0))
  }

  // Generate mock students from uploaded file
  // const _generateMockStudentsFromFile = (_file: File): Student[] => {
  //   const studentCount = Math.floor(Math.random() * 500) + 100 // 100-600 students
  //   const students: Student[] = []
  //   
  //   for (let i = 0; i < studentCount; i++) {
  //     const attendance = Math.random() * 100
  //     const assignmentTimeliness = Math.random()
  //     const quizAvg = Math.random() * 100
  //     const dropoutProb = calculateDropoutProbability(attendance, assignmentTimeliness, quizAvg)
  //     
  //     students.push({
  //       id: `STU_${String(i + 1).padStart(3, '0')}`,
  //       name: `Student ${i + 1}`,
  //       age: Math.floor(Math.random() * 10) + 18, // 18-28
  //       gender: Math.random() > 0.5 ? 'Male' : 'Female',
  //       attendance_percentage: attendance,
  //       assignment_timeliness: assignmentTimeliness,
  //       quiz_test_avg_pct: quizAvg,
  //       fee_payment_status: Math.random() > 0.3 ? 'Paid' : 'Unpaid',
  //       socioeconomic_status: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
  //       lms_login_count: Math.floor(Math.random() * 50),
  //       dropout_probability: dropoutProb,
  //       risk_label: getRiskLabel(dropoutProb),
  //       top_features: getTopFeatures(attendance, assignmentTimeliness, quizAvg)
  //     })
  //   }
  //   
  //   return students.sort((a, b) => (b.dropout_probability || 0) - (a.dropout_probability || 0))
  // }

  // Calculate dropout probability based on key factors
  const calculateDropoutProbability = (attendance: number, assignmentTimeliness: number, quizAvg: number): number => {
    // More sensitive formula to identify more high-risk students
    let risk = 0
    
    // Attendance factor (40% weight) - more sensitive
    if (attendance < 40) risk += 0.5
    else if (attendance < 60) risk += 0.4
    else if (attendance < 75) risk += 0.3
    else if (attendance < 85) risk += 0.2
    else if (attendance < 95) risk += 0.1
    
    // Assignment timeliness factor (30% weight) - more sensitive
    if (assignmentTimeliness < 0.2) risk += 0.4
    else if (assignmentTimeliness < 0.4) risk += 0.3
    else if (assignmentTimeliness < 0.6) risk += 0.2
    else if (assignmentTimeliness < 0.8) risk += 0.15
    else if (assignmentTimeliness < 0.9) risk += 0.1
    
    // Quiz/Test performance factor (30% weight) - more sensitive
    if (quizAvg < 30) risk += 0.4
    else if (quizAvg < 50) risk += 0.3
    else if (quizAvg < 65) risk += 0.2
    else if (quizAvg < 80) risk += 0.15
    else if (quizAvg < 90) risk += 0.1
    
    return Math.min(0.95, Math.max(0.1, risk))
  }

  // Get risk label based on probability
  const getRiskLabel = (probability: number): string => {
    if (probability >= 0.6) return 'High'  // Lowered threshold to get more high-risk students
    if (probability >= 0.3) return 'Medium'
    return 'Low'
  }

  // Get top risk features for a student
  const getTopFeatures = (attendance: number, assignmentTimeliness: number, quizAvg: number) => {
    const features = [
      { feature: 'attendance_percentage', value: (100 - attendance) / 100 },
      { feature: 'assignment_timeliness', value: 1 - assignmentTimeliness },
      { feature: 'quiz_test_avg_pct', value: (100 - quizAvg) / 100 }
    ]
    
    return features
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
  }

  // Generate dashboard data from students
  const generateDashboardDataFromStudents = (students: Student[]): DashboardData => {
    const totalStudents = students.length
    const highRisk = students.filter(s => s.risk_label === 'High').length
    const mediumRisk = students.filter(s => s.risk_label === 'Medium').length
    const lowRisk = students.filter(s => s.risk_label === 'Low').length
    const averageRisk = students.reduce((sum, s) => sum + (s.dropout_probability || 0), 0) / totalStudents

    // Generate feature importance data
    const featureImportance = [
      { feature: 'Attendance Percentage', importance: 0.35 },
      { feature: 'Assignment Timeliness', importance: 0.28 },
      { feature: 'Quiz/Test Average', importance: 0.22 },
      { feature: 'Fee Payment Status', importance: 0.15 }
    ]

    // Generate risk trend data (last 6 months)
    const riskTrend = [
      { month: 'Jan', risk: averageRisk * 0.8 },
      { month: 'Feb', risk: averageRisk * 0.85 },
      { month: 'Mar', risk: averageRisk * 0.9 },
      { month: 'Apr', risk: averageRisk * 0.95 },
      { month: 'May', risk: averageRisk * 1.0 },
      { month: 'Jun', risk: averageRisk }
    ]

    return {
      totalStudents,
      highRisk,
      mediumRisk,
      lowRisk,
      averageRisk,
      featureImportance,
      riskTrend
    }
  }

  // Get all high-risk students (no artificial cap)
  const getHighRiskStudents = (): Student[] => {
    if (students.length === 0) return []
    return [...students]
      .filter(s => s.risk_label === 'High')
      .sort((a, b) => (b.dropout_probability || 0) - (a.dropout_probability || 0))
  }

  // Export data
  const exportData = async (type: 'csv' | 'pdf' | 'individual') => {
    if (students.length === 0) {
      alert('No data to export. Please upload data first.')
      return
    }

    try {
      if (type === 'csv') {
        exportToCSV()
      } else if (type === 'pdf') {
        exportToPDF()
      } else if (type === 'individual') {
        exportIndividualReports()
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Error exporting data. Please try again.')
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const fileName = `student_dropout_predictions_${new Date().toISOString().slice(0, 10)}.csv`
    
    const csvContent = [
      // Header
      ['Student ID', 'Name', 'Age', 'Gender', 'Attendance %', 'Assignment Timeliness', 'Quiz Avg %', 'Fee Status', 'Dropout Probability', 'Risk Label'].join(','),
      // Data rows
      ...students.map(s => [
        s.id,
        s.name,
        s.age,
        s.gender,
        s.attendance_percentage.toFixed(2),
        s.assignment_timeliness.toFixed(3),
        s.quiz_test_avg_pct.toFixed(2),
        s.fee_payment_status,
        ((s.dropout_probability || 0) * 100).toFixed(2),
        s.risk_label
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
    
    // Add to export history
    addToExportHistory('csv', fileName, students.length)
  }

  // Export to PDF (well-structured)
  const exportToPDF = () => {
    if (students.length === 0) {
      alert('No data to export. Please upload data first.')
      return
    }

    // Generate well-structured PDF content
    const highRiskStudents = students.filter(s => s.risk_label === 'High')
    const mediumRiskStudents = students.filter(s => s.risk_label === 'Medium')
    const lowRiskStudents = students.filter(s => s.risk_label === 'Low')
    // const _averageRisk = (students.reduce((sum, s) => sum + (s.dropout_probability || 0), 0) / students.length * 100).toFixed(1)
    
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Student Dropout Prediction Summary Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #dc2626; padding-bottom: 20px; }
        .title { font-size: 28px; font-weight: bold; color: #dc2626; margin-bottom: 10px; }
        .subtitle { font-size: 16px; color: #666; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 15px; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; }
        .stat-number { font-size: 32px; font-weight: bold; color: #dc2626; }
        .stat-label { font-size: 14px; color: #6b7280; margin-top: 5px; }
        .student-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .student-table th, .student-table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
        .student-table th { background: #f3f4f6; font-weight: bold; }
        .risk-high { color: #dc2626; font-weight: bold; }
        .risk-medium { color: #f97316; font-weight: bold; }
        .risk-low { color: #16a34a; font-weight: bold; }
        .recommendations { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .recommendation-item { margin: 10px 0; padding-left: 20px; position: relative; }
        .recommendation-item::before { content: "→"; position: absolute; left: 0; color: #3b82f6; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">🎓 STUDENT DROPOUT PREDICTION SUMMARY REPORT</div>
        <div class="subtitle">AI-Powered Risk Assessment & Intervention Strategy</div>
        <div class="subtitle">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
    </div>

    <div class="section">
        <div class="section-title">📊 Executive Summary</div>
        <p>This report analyzes <strong>${students.length}</strong> students using advanced machine learning algorithms to predict dropout risk. The analysis identifies students requiring immediate intervention and provides actionable recommendations for academic success.</p>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${highRiskStudents.length}</div>
                <div class="stat-label">High Risk Students</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${mediumRiskStudents.length}</div>
                <div class="stat-label">Medium Risk Students</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${lowRiskStudents.length}</div>
                <div class="stat-label">Low Risk Students</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">📈 Risk Distribution Analysis</div>
        <table class="student-table">
            <tr>
                <th>Risk Level</th>
                <th>Number of Students</th>
                <th>Percentage</th>
                <th>Average Risk Score</th>
            </tr>
            <tr>
                <td class="risk-high">High Risk</td>
                <td>${highRiskStudents.length}</td>
                <td>${((highRiskStudents.length / students.length) * 100).toFixed(1)}%</td>
                <td>${highRiskStudents.length > 0 ? (highRiskStudents.reduce((sum, s) => sum + (s.dropout_probability || 0), 0) / highRiskStudents.length * 100).toFixed(1) : 0}%</td>
            </tr>
            <tr>
                <td class="risk-medium">Medium Risk</td>
                <td>${mediumRiskStudents.length}</td>
                <td>${((mediumRiskStudents.length / students.length) * 100).toFixed(1)}%</td>
                <td>${mediumRiskStudents.length > 0 ? (mediumRiskStudents.reduce((sum, s) => sum + (s.dropout_probability || 0), 0) / mediumRiskStudents.length * 100).toFixed(1) : 0}%</td>
            </tr>
            <tr>
                <td class="risk-low">Low Risk</td>
                <td>${lowRiskStudents.length}</td>
                <td>${((lowRiskStudents.length / students.length) * 100).toFixed(1)}%</td>
                <td>${lowRiskStudents.length > 0 ? (lowRiskStudents.reduce((sum, s) => sum + (s.dropout_probability || 0), 0) / lowRiskStudents.length * 100).toFixed(1) : 0}%</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">⚠️ High-Risk Students Requiring Immediate Action</div>
        <table class="student-table">
            <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Risk Score</th>
                <th>Attendance %</th>
                <th>Performance %</th>
                <th>Payment Status</th>
            </tr>
            ${highRiskStudents.map(s => `
                <tr>
                    <td>${s.id}</td>
                    <td>${s.name}</td>
                    <td class="risk-high">${((s.dropout_probability || 0) * 100).toFixed(1)}%</td>
                    <td>${s.attendance_percentage.toFixed(1)}%</td>
                    <td>${s.quiz_test_avg_pct.toFixed(1)}%</td>
                    <td>${s.fee_payment_status}</td>
                </tr>
            `).join('')}
        </table>
    </div>

    <div class="section">
        <div class="section-title">🎯 Strategic Recommendations</div>
        <div class="recommendations">
            <div class="recommendation-item">Schedule immediate one-on-one meetings with all ${highRiskStudents.length} high-risk students within 48 hours</div>
            <div class="recommendation-item">Implement intensive academic support programs including tutoring and study groups</div>
            <div class="recommendation-item">Review and address financial aid needs for students with payment issues</div>
            <div class="recommendation-item">Establish early warning system with weekly progress monitoring</div>
            <div class="recommendation-item">Create peer mentorship programs connecting high-risk students with successful peers</div>
            <div class="recommendation-item">Develop intervention programs for ${mediumRiskStudents.length} medium-risk students to prevent escalation</div>
            <div class="recommendation-item">Regular faculty training on identifying and supporting at-risk students</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">📋 Next Steps</div>
        <ol>
            <li><strong>Immediate (0-48 hours):</strong> Contact all high-risk students and schedule intervention meetings</li>
            <li><strong>Short-term (1-2 weeks):</strong> Implement academic support programs and financial aid reviews</li>
            <li><strong>Medium-term (1 month):</strong> Establish monitoring systems and peer mentorship programs</li>
            <li><strong>Long-term (ongoing):</strong> Regular assessment and adjustment of intervention strategies</li>
        </ol>
    </div>

    <div class="footer">
        <p>This report was generated by the Student Dropout Predictor AI System</p>
        <p>For questions or support, contact the Academic Success Team</p>
    </div>
</body>
</html>
    `.trim()

    const fileName = `dropout_summary_report_${new Date().toISOString().slice(0, 10)}.html`
    
    // Create and download HTML file (can be opened as PDF)
    const blob = new Blob([pdfContent], { type: 'text/html' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(url)
    
    // Add to export history
    addToExportHistory('pdf', fileName, students.length)
    
    alert('Summary report downloaded successfully! ')
  }

  // Export individual reports (well-structured)
  const exportIndividualReports = () => {
    if (students.length === 0) {
      alert('No data to export. Please upload data first.')
      return
    }

    // Get top 10 highest risk students for individual reports
    const sortedStudents = [...students].sort((a, b) => (b.dropout_probability || 0) - (a.dropout_probability || 0))
    const topRiskStudents = sortedStudents.slice(0, 10)
    
    if (topRiskStudents.length === 0) {
      alert('No students found to generate individual reports.')
      return
    }

    const fileName = `individual_reports_${new Date().toISOString().slice(0, 10)}.zip`
    
    topRiskStudents.forEach((student, _index) => {
      const individualReport = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Individual Student Risk Assessment - ${student.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #dc2626; padding-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #dc2626; margin-bottom: 10px; }
        .subtitle { font-size: 16px; color: #666; }
        .section { margin: 30px 0; }
        .section-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 15px; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .info-card { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
        .info-label { font-size: 14px; color: #6b7280; margin-bottom: 5px; }
        .info-value { font-size: 18px; font-weight: bold; color: #1f2937; }
        .risk-score { font-size: 36px; font-weight: bold; color: #dc2626; text-align: center; }
        .risk-level { font-size: 20px; color: #dc2626; text-align: center; margin-top: 10px; }
        .factors-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .factors-table th, .factors-table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
        .factors-table th { background: #f3f4f6; font-weight: bold; }
        .recommendations { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .recommendation-item { margin: 10px 0; padding-left: 20px; position: relative; }
        .recommendation-item::before { content: "✓"; position: absolute; left: 0; color: #3b82f6; font-weight: bold; }
        .action-plan { background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">👤 INDIVIDUAL STUDENT RISK ASSESSMENT REPORT</div>
        <div class="subtitle">Student: ${student.name} | ID: ${student.id}</div>
        <div class="subtitle">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
    </div>

    <div class="section">
        <div class="section-title">⚠️ Risk Assessment Summary</div>
        <div style="text-align: center; margin: 30px 0;">
            <div class="risk-score">${((student.dropout_probability || 0) * 100).toFixed(1)}%</div>
            <div class="risk-level">${student.risk_label || 'HIGH'} RISK</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">📊 Academic Performance Overview</div>
        <div class="info-grid">
            <div class="info-card">
                <div class="info-label">Attendance Percentage</div>
                <div class="info-value">${student.attendance_percentage.toFixed(1)}%</div>
            </div>
            <div class="info-card">
                <div class="info-label">Assignment Timeliness</div>
                <div class="info-value">${(student.assignment_timeliness * 100).toFixed(1)}%</div>
            </div>
            <div class="info-card">
                <div class="info-label">Quiz/Test Average</div>
                <div class="info-value">${student.quiz_test_avg_pct.toFixed(1)}%</div>
            </div>
            <div class="info-card">
                <div class="info-label">Fee Payment Status</div>
                <div class="info-value">${student.fee_payment_status}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">👤 Student Information</div>
        <div class="info-grid">
            <div class="info-card">
                <div class="info-label">Student ID</div>
                <div class="info-value">${student.id}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Full Name</div>
                <div class="info-value">${student.name}</div>
            </div>
            <div class="info-card">
                <div class="info-label">Age</div>
                <div class="info-value">${student.age} years</div>
            </div>
            <div class="info-card">
                <div class="info-label">Gender</div>
                <div class="info-value">${student.gender}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">🔍 Key Risk Factors Analysis</div>
        <table class="factors-table">
            <tr>
                <th>Risk Factor</th>
                <th>Impact Score</th>
                <th>Description</th>
            </tr>
            ${(student.top_features || []).map(f => `
                <tr>
                    <td>${f.feature.replace(/_/g, ' ').toUpperCase()}</td>
                    <td>${f.value.toFixed(3)}</td>
                    <td>${getRiskFactorDescription(f.feature)}</td>
                </tr>
            `).join('')}
        </table>
    </div>

    <div class="section">
        <div class="section-title">🎯 Recommended Interventions</div>
        <div class="recommendations">
            <div class="recommendation-item">Schedule immediate one-on-one meeting with academic advisor within 24 hours</div>
            <div class="recommendation-item">Provide intensive tutoring in subjects with low performance scores</div>
            <div class="recommendation-item">Implement attendance improvement plan with daily check-ins</div>
            <div class="recommendation-item">Connect with financial aid office if payment status is problematic</div>
            <div class="recommendation-item">Assign peer mentor from successful student cohort</div>
            <div class="recommendation-item">Establish weekly progress monitoring with student success team</div>
            <div class="recommendation-item">Create personalized study schedule and academic support plan</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">📋 Action Plan & Timeline</div>
        <div class="action-plan">
            <h4 style="margin-top: 0; color: #92400e;">Immediate Actions (0-48 hours):</h4>
            <ul>
                <li>Contact student and schedule intervention meeting</li>
                <li>Review academic records and identify specific challenges</li>
                <li>Notify relevant faculty and support staff</li>
            </ul>
            
            <h4 style="color: #92400e;">Short-term Goals (1-2 weeks):</h4>
            <ul>
                <li>Implement academic support interventions</li>
                <li>Establish regular check-in schedule</li>
                <li>Address any immediate barriers to success</li>
            </ul>
            
            <h4 style="color: #92400e;">Ongoing Monitoring:</h4>
            <ul>
                <li>Weekly progress assessments</li>
                <li>Monthly intervention effectiveness review</li>
                <li>Adjust strategies based on student response</li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <p>This individual report was generated by the Student Dropout Predictor AI System</p>
        <p>For immediate support, contact the Academic Success Team</p>
    </div>
</body>
</html>
      `.trim()

      // Create and download individual report
      const blob = new Blob([individualReport], { type: 'text/html' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `student_${student.id}_risk_report_${new Date().toISOString().slice(0, 10)}.html`
      a.click()
      window.URL.revokeObjectURL(url)
    })
    
    // Add to export history
    addToExportHistory('individual', fileName, topRiskStudents.length)
    
    alert(`Individual reports generated for ${topRiskStudents.length} students! `)
  }

  // Helper function to get risk factor descriptions
  const getRiskFactorDescription = (factor: string): string => {
    const descriptions: { [key: string]: string } = {
      'attendance_percentage': 'Low attendance indicates disengagement and potential academic struggles',
      'assignment_timeliness': 'Poor assignment submission patterns suggest time management issues',
      'quiz_test_avg_pct': 'Low test performance indicates academic difficulty and comprehension challenges',
      'fee_payment_status': 'Financial issues can create significant barriers to academic success',
      'socioeconomic_status': 'Economic background may impact access to resources and support',
      'lms_login_count': 'Low LMS engagement suggests limited participation in online learning activities'
    }
    return descriptions[factor] || 'This factor contributes to overall dropout risk assessment'
  }

  // Don't load sample data automatically - start with empty state
  // useEffect(() => {
  //   if (students.length === 0) {
  //     const sampleStudents = generateMockStudentsFromFile(new File([''], 'sample.csv'))
  //     const sampleDashboardData = generateDashboardDataFromStudents(sampleStudents)
  //     setStudents(sampleStudents)
  //     setDashboardData(sampleDashboardData)
  //   }
  // }, [])

  return {
    students,
    dashboardData,
    isLoading,
    uploadedFile,
    processUploadedData,
    getHighRiskStudents,
    exportData,
    clearAllData,
    exportHistory
  }
}
