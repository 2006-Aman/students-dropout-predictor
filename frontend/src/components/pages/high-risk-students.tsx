import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertTriangle, Download, Search, Eye, FileText, Users } from 'lucide-react'
import { formatPercentage, getRiskBadgeClass } from '@/lib/utils'

import { Student } from '@/hooks/useDataManager'

interface HighRiskStudentsProps {
  students: Student[]
  onExport: (type: 'csv' | 'pdf') => void
}

export function HighRiskStudents({ students, onExport }: HighRiskStudentsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [_selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedStudents(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(filteredStudents.map(s => s.id)))
    }
  }

  const getInterventionRecommendations = (student: Student) => {
    const recommendations = []
    
    if ((student.attendance || student.attendance_percentage) < 70) {
      recommendations.push({
        factor: 'Low Attendance',
        priority: 'High',
        recommendation: 'Schedule counseling session and implement attendance tracking'
      })
    }
    
    if ((student.performance || student.quiz_test_avg_pct) < 60) {
      recommendations.push({
        factor: 'Poor Academic Performance',
        priority: 'High',
        recommendation: 'Arrange tutoring and study groups'
      })
    }
    
    if (student.paymentStatus !== 'Paid') {
      recommendations.push({
        factor: 'Financial Issues',
        priority: 'High',
        recommendation: 'Connect with financial aid office and explore payment plans'
      })
    }
    
    return recommendations
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">High-Risk Students</h2>
          <p className="text-muted-foreground">
            Students identified as high risk for dropping out
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onExport('csv')}
            disabled={selectedStudents.size === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV ({selectedStudents.size})
          </Button>
          <Button
            onClick={() => onExport('pdf')}
            disabled={selectedStudents.size === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF ({selectedStudents.size})
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total High-Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Students requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedStudents.size}</div>
            <p className="text-xs text-muted-foreground">
              Students selected for export
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(students.reduce((acc, s) => acc + (s.dropout_probability || 0), 0) / students.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average dropout probability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSelectAll}
            >
              {selectedStudents.size === filteredStudents.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>High-Risk Students List</CardTitle>
          <CardDescription>
            Click on a student to view detailed information and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">
                    <input
                      type="checkbox"
                      checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-2 font-medium">Student ID</th>
                  <th className="text-left p-2 font-medium">Name</th>
                  <th className="text-left p-2 font-medium">Risk Level</th>
                  <th className="text-left p-2 font-medium">Probability</th>
                  <th className="text-left p-2 font-medium">Attendance</th>
                  <th className="text-left p-2 font-medium">Performance</th>
                  <th className="text-left p-2 font-medium">Payment</th>
                  <th className="text-left p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedStudents.has(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-2 font-mono text-xs">{student.id}</td>
                    <td className="p-2 font-medium">{student.name}</td>
                    <td className="p-2">
                      <Badge className={getRiskBadgeClass(student.risk_label || 'Low')}>
                        {student.risk_label || 'Low'}
                      </Badge>
                    </td>
                    <td className="p-2 font-mono">
                      {formatPercentage(student.dropout_probability || 0)}
                    </td>
                    <td className="p-2">{student.attendance_percentage}%</td>
                    <td className="p-2">{student.quiz_test_avg_pct}%</td>
                    <td className="p-2">
                      <Badge variant={student.fee_payment_status === 'Paid' ? 'default' : 'destructive'}>
                        {student.fee_payment_status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Student Details - {student.name}</DialogTitle>
                            <DialogDescription>
                              Detailed analysis and intervention recommendations
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="font-medium mb-2">Basic Information</h4>
                                <div className="space-y-1 text-sm">
                                  <p><span className="font-medium">ID:</span> {student.id}</p>
                                  <p><span className="font-medium">Name:</span> {student.name}</p>
                                  <p><span className="font-medium">Risk Level:</span> 
                                    <Badge className={`ml-2 ${getRiskBadgeClass(student.risk_label || 'Low')}`}>
                                      {student.risk_label || 'Low'}
                                    </Badge>
                                  </p>
                                  <p><span className="font-medium">Dropout Probability:</span> 
                                    <span className="font-mono ml-2">{formatPercentage(student.dropout_probability || 0)}</span>
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Academic Performance</h4>
                                <div className="space-y-1 text-sm">
                                  <p><span className="font-medium">Attendance:</span> {student.attendance_percentage}%</p>
                                  <p><span className="font-medium">Performance:</span> {student.quiz_test_avg_pct}%</p>
                                  <p><span className="font-medium">Payment Status:</span> 
                                    <Badge variant={student.fee_payment_status === 'Paid' ? 'default' : 'destructive'} className="ml-2">
                                      {student.fee_payment_status}
                                    </Badge>
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Top Risk Factors</h4>
                              <div className="space-y-2">
                                {(student.top_features || []).map((feature: any, index: number) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                    <span className="font-medium">{feature.feature.replace(/_/g, ' ')}</span>
                                    <span className="font-mono text-sm">{feature.value.toFixed(3)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Intervention Recommendations</h4>
                              <div className="space-y-2">
                                {getInterventionRecommendations(student).map((rec, index) => (
                                  <div key={index} className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium">{rec.factor}</span>
                                      <Badge variant={rec.priority === 'High' ? 'destructive' : 'secondary'}>
                                        {rec.priority} Priority
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
