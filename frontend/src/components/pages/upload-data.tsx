import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, Download, FileSpreadsheet, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface UploadDataProps {
  onDataUploaded: (data: any) => void
}

export function UploadData({ onDataUploaded }: UploadDataProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
      processFile(selectedFile)
    } else {
      alert('Please upload a CSV file')
    }
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    try {
      const text = await file.text()
      const lines = text.split('\n')
      const headers = lines[0].split(',')
      const data = lines.slice(1, 51).map(line => {
        const values = line.split(',')
        const row: any = {}
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || ''
        })
        return row
      })
      setPreviewData(data)
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Error processing file')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const downloadTemplate = () => {
    const templateData = `student_id,student_name,attendance_percentage,assignment_timeliness,quiz_test_avg_pct,fee_payment_status,lms_login_count_monthly,time_spent_online_hours_week,age,gender,socioeconomic_status
STU_0001,John Doe,85.5,78.2,72.1,Paid,15,8.5,20,Male,3
STU_0002,Jane Smith,92.3,88.7,85.4,Paid,22,12.1,19,Female,4
STU_0003,Bob Johnson,45.2,52.1,48.3,Unpaid,3,2.1,21,Male,1`
    
    const blob = new Blob([templateData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sample_student_data.csv'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const proceedWithData = () => {
    if (file) {
      onDataUploaded({ file, previewData })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Student Data</h2>
        <p className="text-muted-foreground">
          Upload your CSV file containing student information to begin the analysis.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Card */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Data
            </CardTitle>
            <CardDescription>
              Drag and drop your CSV file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {file ? file.name : 'Drop your CSV file here'}
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Choose File'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Template Card */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Sample Template
            </CardTitle>
            <CardDescription>
              Download a sample CSV template to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Use this template to format your student data correctly.
              </p>
              <Button onClick={downloadTemplate} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Preview */}
      {previewData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Data Preview (First 50 rows)
              </CardTitle>
              <CardDescription>
                Review your data before proceeding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(previewData[0] || {}).map((header) => (
                        <th key={header} className="text-left p-2 font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-b">
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="p-2 text-muted-foreground">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {previewData.length > 10 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Showing first 10 rows of {previewData.length} total rows
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Proceed Button */}
      {file && previewData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <Button onClick={proceedWithData} size="lg" className="px-8">
            <CheckCircle className="h-4 w-4 mr-2" />
            Proceed with Data
          </Button>
        </motion.div>
      )}
    </div>
  )
}
