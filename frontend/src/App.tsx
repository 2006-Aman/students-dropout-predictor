import React, { useState } from 'react'
import { SimpleNavbar } from '@/components/layout/simple-navbar'
import { SimpleSidebar } from '@/components/layout/simple-sidebar'
import { SimpleDashboard } from '@/components/pages/simple-dashboard'
import { SimpleUpload } from '@/components/pages/simple-upload'
import { SimpleHighRisk } from '@/components/pages/simple-high-risk'
import { SimpleReports } from '@/components/pages/simple-reports'
import { SimpleSettings } from '@/components/pages/simple-settings'
import { SingleStudent } from '@/components/pages/single-student'
import { useDataManager } from '@/hooks/useDataManager'
import { useTheme } from '@/hooks/useTheme'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { theme } = useTheme()
  const {
    students,
    dashboardData,
    isLoading,
    uploadedFile,
    processUploadedData,
    getHighRiskStudents,
    exportData,
    exportHistory
  } = useDataManager()

  const handleDataUploaded = (file: File) => {
    processUploadedData(file)
    setActiveTab('dashboard')
  }

  const handleExport = (type: 'csv' | 'pdf' | 'individual') => {
    exportData(type)
  }

  const handleRetrain = () => {
    console.log('Retraining model...')
    alert('Retraining model...')
  }

  const handleThresholdChange = (thresholds: { high: number; medium: number }) => {
    console.log('Updating thresholds:', thresholds)
    // In a real app, this would update the risk thresholds
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SimpleDashboard data={dashboardData} isLoading={isLoading} />
      case 'upload':
        return <SimpleUpload onDataUploaded={handleDataUploaded} isLoading={isLoading} />
      case 'high-risk':
        return <SimpleHighRisk students={getHighRiskStudents()} onExport={handleExport} isLoading={isLoading} />
      case 'single':
        return <SingleStudent />
      case 'reports':
        return <SimpleReports onExport={handleExport} students={students} exportHistory={exportHistory} />
      case 'settings':
        return <SimpleSettings onRetrain={handleRetrain} onThresholdChange={handleThresholdChange} />
      default:
        return <SimpleDashboard data={dashboardData} isLoading={isLoading} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ 
      backgroundColor: theme === 'dark' ? '#111827' : '#f8fafc', 
      color: theme === 'dark' ? '#f9fafb' : '#1a202c',
      transition: 'all 0.3s ease'
    }}>
      <SimpleNavbar />
      <div className="flex flex-1">
        <SimpleSidebar activeTab={activeTab} onTabChange={setActiveTab} theme={theme} highRiskCount={getHighRiskStudents().length} />
        <main className="flex-1 p-6 overflow-auto" style={{ 
          backgroundColor: theme === 'dark' ? '#111827' : '#f8fafc',
          transition: 'all 0.3s ease'
        }}>
          <div key={activeTab} className="w-full">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App