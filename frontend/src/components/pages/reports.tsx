import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Calendar, FileSpreadsheet, BarChart3, Users } from 'lucide-react'

interface Report {
  id: string
  name: string
  type: 'csv' | 'pdf'
  size: string
  createdAt: string
  status: 'completed' | 'processing' | 'failed'
}

interface ReportsProps {
  onExport: (type: 'csv' | 'pdf' | 'individual') => void
}

export function Reports({ onExport }: ReportsProps) {
  const [reports] = useState<Report[]>([
    {
      id: '1',
      name: 'student_predictions_20250915.csv',
      type: 'csv',
      size: '180 KB',
      createdAt: '2025-09-15 01:24:37',
      status: 'completed'
    },
    {
      id: '2',
      name: 'dropout_summary_report_20250915.pdf',
      type: 'pdf',
      size: '4.9 KB',
      createdAt: '2025-09-15 01:24:37',
      status: 'completed'
    },
    {
      id: '3',
      name: 'individual_reports_batch.pdf',
      type: 'pdf',
      size: '2.1 MB',
      createdAt: '2025-09-15 01:20:15',
      status: 'completed'
    }
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return <FileSpreadsheet className="h-5 w-5" />
      case 'pdf':
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Export and download analysis reports
        </p>
      </div>

      {/* Export Options */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Export Full Dataset
            </CardTitle>
            <CardDescription>
              Download complete dataset with predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Includes all student data with dropout probabilities, risk labels, and SHAP values.
              </p>
              <Button onClick={() => onExport('csv')} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Summary Report
            </CardTitle>
            <CardDescription>
              Comprehensive PDF report with charts and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Executive summary with risk distribution, model performance, and high-risk student list.
              </p>
              <Button onClick={() => onExport('pdf')} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Individual Reports
            </CardTitle>
            <CardDescription>
              Per-student PDF reports with detailed analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Detailed individual reports for high-risk students with intervention recommendations.
              </p>
              <Button onClick={() => onExport('individual')} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download History */}
      <Card>
        <CardHeader>
          <CardTitle>Download History</CardTitle>
          <CardDescription>
            Previously generated reports and exports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reports generated yet</p>
                <p className="text-sm">Generate your first report using the options above</p>
              </div>
            ) : (
              <div className="space-y-2">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(report.type)}
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{report.size}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(report.status)}
                      {report.status === 'completed' && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              Reports generated
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CSV Exports</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.type === 'csv').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Data exports
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PDF Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.filter(r => r.type === 'pdf').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Document reports
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
