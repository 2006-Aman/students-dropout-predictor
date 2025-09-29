import React from 'react'
import PageContainer from '@/components/layout/PageContainer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, BarChart3, Brain, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts'

interface SimpleDashboardProps {
  data: {
    totalStudents: number
    highRisk: number
    mediumRisk: number
    lowRisk: number
    averageRisk: number
    featureImportance: Array<{ feature: string; importance: number }>
    riskTrend: Array<{ month: string; risk: number }>
  } | null
  isLoading?: boolean
}

export function SimpleDashboard({ data, isLoading = false }: SimpleDashboardProps) {
  if (isLoading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '2rem',
          marginBottom: '1rem'
        }}>
          ⏳
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>
          Processing Data...
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

  if (!data) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: '2rem',
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
          No Data Available
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280'
        }}>
          Upload student data to see the dashboard
        </p>
      </div>
      </PageContainer>
    )
  }

  const riskDistribution = [
    { name: 'High Risk', value: data.highRisk, color: '#ef4444' },
    { name: 'Medium Risk', value: data.mediumRisk, color: '#f97316' },
    { name: 'Low Risk', value: data.lowRisk, color: '#22c55e' },
  ]

  const topFeatures = data.featureImportance.slice(0, 10)
  
  // Debug logging for top features
  console.log('Top Features Data:', topFeatures)
  console.log('Feature Importance Array:', data.featureImportance)

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
          Dashboard
        </h2>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280',
          margin: 0
        }}>
          Comprehensive overview of student dropout risk analysis and insights
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s ease-in-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              margin: 0
            }}>
              Total Students
            </h3>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#dbeafe',
              color: '#2563eb'
            }}>
              👥
            </div>
          </div>
          <div style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#2563eb',
            marginBottom: '0.5rem'
          }}>
            {data.totalStudents.toLocaleString()}
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            Students analyzed
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s ease-in-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              margin: 0
            }}>
              High Risk
            </h3>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#fee2e2',
              color: '#dc2626'
            }}>
              ⚠️
            </div>
          </div>
          <div style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#dc2626',
            marginBottom: '0.5rem'
          }}>
            {data.highRisk}
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            {((data.highRisk / data.totalStudents) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s ease-in-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              margin: 0
            }}>
              Medium Risk
            </h3>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#fed7aa',
              color: '#ea580c'
            }}>
              🎯
            </div>
          </div>
          <div style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#ea580c',
            marginBottom: '0.5rem'
          }}>
            {data.mediumRisk}
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            {((data.mediumRisk / data.totalStudents) * 100).toFixed(1)}% of total
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s ease-in-out'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              margin: 0
            }}>
              Avg. Dropout Risk
            </h3>
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#dcfce7',
              color: '#16a34a'
            }}>
              🧠
            </div>
          </div>
          <div style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#16a34a',
            marginBottom: '0.5rem'
          }}>
            {(data.averageRisk * 100).toFixed(1)}%
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            Average probability
          </p>
        </div>
      </div>

      {/* 2x2 Grid Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Left - Risk Distribution Pie Chart */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-red-100">
                <BarChart3 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Risk Distribution</CardTitle>
                <CardDescription>Students categorized by risk level</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Right - Feature Importance Bar Chart */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-indigo-100">
                <Brain className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Top Risk Factors</CardTitle>
                <CardDescription>Most influential factors in predictions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topFeatures.length > 0 ? topFeatures : [
                  { feature: 'Academic Performance', importance: 0.85 },
                  { feature: 'Attendance Rate', importance: 0.72 },
                  { feature: 'Financial Status', importance: 0.68 },
                  { feature: 'Family Support', importance: 0.61 },
                  { feature: 'Study Hours', importance: 0.55 }
                ]} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  dataKey="feature" 
                  type="category" 
                  width={100} 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value) => [(value as number).toFixed(3), 'Importance']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="importance" 
                  fill="url(#colorGradient)"
                  radius={[0, 4, 4, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Left - Risk Trend Line Chart */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Risk Trend Analysis</CardTitle>
                <CardDescription>Dropout risk over time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.riskTrend.length > 0 ? data.riskTrend : [{ month: 'Jan', risk: 0.1 }, { month: 'Feb', risk: 0.2 }]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Risk']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="url(#lineGradient)" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Right - Performance Area Chart */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
                <CardDescription>Academic performance trends</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                { month: 'Jan', attendance: 85, quiz: 78, assignment: 82 },
                { month: 'Feb', attendance: 87, quiz: 80, assignment: 85 },
                { month: 'Mar', attendance: 83, quiz: 76, assignment: 79 },
                { month: 'Apr', attendance: 89, quiz: 84, assignment: 88 },
                { month: 'May', attendance: 91, quiz: 87, assignment: 90 },
                { month: 'Jun', attendance: 88, quiz: 85, assignment: 86 }
              ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="url(#attendanceGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="quiz" 
                  stackId="2" 
                  stroke="#10b981" 
                  fill="url(#quizGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="assignment" 
                  stackId="3" 
                  stroke="#f59e0b" 
                  fill="url(#assignmentGradient)" 
                />
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="quizGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="assignmentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Counseling Sessions Section */}
      <div className="mt-8">
        <Card className="shadow-lg border-gray-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-700 text-2xl">
                🎓
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Counseling Sessions</CardTitle>
                <CardDescription>
                  Intervention programs and support for at-risk students
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Local state for counseling workflows */}
            {(() => {
              type CounselingSession = {
                id: string
                studentName: string
                priority: 'High' | 'Medium'
                date: string
                time: string
                counselor: string
                status: 'Scheduled' | 'Completed' | 'Cancelled'
                notes?: string
              }

              const [activeTab, setActiveTab] = React.useState<'overview' | 'plan' | 'upcoming' | 'history'>('overview')
              const [upcomingSessions, setUpcomingSessions] = React.useState<CounselingSession[]>([
                { id: '1', studentName: 'Aman Verma', priority: 'High', date: '2025-09-25', time: '10:30', counselor: 'Dr. Sharma', status: 'Scheduled', notes: 'Low attendance' },
                { id: '2', studentName: 'Neha Singh', priority: 'Medium', date: '2025-09-26', time: '14:00', counselor: 'Ms. Patel', status: 'Scheduled', notes: 'Financial difficulty' },
              ])
              const [historySessions, setHistorySessions] = React.useState<CounselingSession[]>([
                { id: 'h1', studentName: 'Ravi Kumar', priority: 'High', date: '2025-09-18', time: '11:00', counselor: 'Dr. Sharma', status: 'Completed', notes: 'Created study plan' },
              ])

              const [form, setForm] = React.useState({
                studentName: '',
                priority: 'High',
                date: '',
                time: '',
                counselor: '',
                notes: '',
              })

              const scheduleSession = () => {
                if (!form.studentName || !form.date || !form.time || !form.counselor) return
                const newSession: CounselingSession = {
                  id: Math.random().toString(36).slice(2),
                  studentName: form.studentName,
                  priority: form.priority as 'High' | 'Medium',
                  date: form.date,
                  time: form.time,
                  counselor: form.counselor,
                  status: 'Scheduled',
                  notes: form.notes,
                }
                setUpcomingSessions(prev => [newSession, ...prev])
                setForm({ studentName: '', priority: 'High', date: '', time: '', counselor: '', notes: '' })
                setActiveTab('upcoming')
              }

              const markComplete = (id: string) => {
                setUpcomingSessions(prev => {
                  const found = prev.find(s => s.id === id)
                  const remaining = prev.filter(s => s.id !== id)
                  if (found) {
                    setHistorySessions(h => [{ ...found, status: 'Completed' }, ...h])
                  }
                  return remaining
                })
              }

              const cancelSession = (id: string) => {
                setUpcomingSessions(prev => prev.filter(s => s.id !== id))
              }

              // Derived stats
              const upcomingHigh = upcomingSessions.filter(s => s.priority === 'High').length
              const upcomingMedium = upcomingSessions.filter(s => s.priority === 'Medium').length
              const completedCount = historySessions.filter(s => s.status === 'Completed').length

              return (
                <div>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex flex-col items-center">
                      <span className="text-3xl">🚨</span>
                      <div className="mt-2 font-semibold text-red-600 text-xl">{upcomingHigh}</div>
                      <div className="text-sm text-red-700">Upcoming (High)</div>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 flex flex-col items-center">
                      <span className="text-3xl">⚠️</span>
                      <div className="mt-2 font-semibold text-orange-600 text-xl">{upcomingMedium}</div>
                      <div className="text-sm text-orange-700">Upcoming (Medium)</div>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col items-center">
                      <span className="text-3xl">✅</span>
                      <div className="mt-2 font-semibold text-emerald-600 text-xl">{completedCount}</div>
                      <div className="text-sm text-emerald-700">Completed</div>
                    </div>
                  </div>
                  {/* Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['overview','plan','upcoming','history'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 rounded-full border transition ${
                          activeTab === tab ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white hover:bg-gray-50'
                        } capitalize`}
                      >
                        {tab.replace(/^\w/, c => c.toUpperCase())}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-red-800">High Priority</h3>
                          <span className="text-2xl">🚨</span>
                        </div>
                        <div className="text-3xl font-bold text-red-600 mb-2">{data.highRisk}</div>
                        <p className="text-sm text-red-700 mb-4">Students requiring immediate intervention</p>
                        <ul className="space-y-2 text-sm text-red-700">
                          <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Schedule within 24 hours</li>
                          <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>One-on-one counseling</li>
                          <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Academic support plan</li>
                        </ul>
                      </div>
                      <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-orange-800">Medium Priority</h3>
                          <span className="text-2xl">⚠️</span>
                        </div>
                        <div className="text-3xl font-bold text-orange-600 mb-2">{data.mediumRisk}</div>
                        <p className="text-sm text-orange-700 mb-4">Students needing monitoring and support</p>
                        <ul className="space-y-2 text-sm text-orange-700">
                          <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Schedule within 1 week</li>
                          <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Group counseling sessions</li>
                          <li className="flex items-center"><span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>Progress monitoring</li>
                        </ul>
                      </div>
                      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-blue-800">Support Resources</h3>
                          <span className="text-2xl">💡</span>
                        </div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">Available</div>
                        <p className="text-sm text-blue-700 mb-4">Counseling and support services</p>
                        <ul className="space-y-2 text-sm text-blue-700">
                          <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Academic advisors</li>
                          <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Mental health counselors</li>
                          <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Financial aid support</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'plan' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="p-6 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Create Counseling Session</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Student Name<span className="text-red-500"> *</span></label>
                            <input value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" placeholder="Enter student name" />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Priority</label>
                            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Date<span className="text-red-500"> *</span></label>
                            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Time<span className="text-red-500"> *</span></label>
                            <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Counselor<span className="text-red-500"> *</span></label>
                            <input value={form.counselor} onChange={e => setForm({ ...form, counselor: e.target.value })} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10" placeholder="Enter counselor name" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600 mb-1">Notes</label>
                            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-md px-3 py-2" rows={3} placeholder="Reason / context" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                          <button onClick={scheduleSession} disabled={!form.studentName || !form.date || !form.time || !form.counselor} className={`px-6 py-2 rounded-md text-white ${(!form.studentName || !form.date || !form.time || !form.counselor) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>Schedule Session</button>
                          {(!form.studentName || !form.date || !form.time || !form.counselor) && (
                            <span className="text-sm text-gray-500">Fill all required fields</span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Guidelines</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                          <li>High priority students must be scheduled within 24 hours.</li>
                          <li>Use group sessions for medium priority where appropriate.</li>
                          <li>Document outcomes and next steps after each session.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === 'upcoming' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border rounded-md">
                        <thead className="bg-gray-50">
                          <tr className="text-left text-sm text-gray-600">
                            <th className="p-3 border">Student</th>
                            <th className="p-3 border">Priority</th>
                            <th className="p-3 border">Date</th>
                            <th className="p-3 border">Time</th>
                            <th className="p-3 border">Counselor</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingSessions.map(s => (
                            <tr key={s.id} className="text-sm">
                              <td className="p-3 border">{s.studentName}</td>
                              <td className="p-3 border">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{s.priority}</span>
                              </td>
                              <td className="p-3 border">{s.date}</td>
                              <td className="p-3 border">{s.time}</td>
                              <td className="p-3 border">{s.counselor}</td>
                              <td className="p-3 border">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : s.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{s.status}</span>
                              </td>
                              <td className="p-3 border">
                                <div className="flex gap-2">
                                  <button onClick={() => markComplete(s.id)} className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">Complete</button>
                                  <button onClick={() => cancelSession(s.id)} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">Cancel</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {upcomingSessions.length === 0 && (
                            <tr>
                              <td className="p-4 text-center text-gray-500" colSpan={7}>No upcoming sessions</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border rounded-md">
                        <thead className="bg-gray-50">
                          <tr className="text-left text-sm text-gray-600">
                            <th className="p-3 border">Student</th>
                            <th className="p-3 border">Priority</th>
                            <th className="p-3 border">Date</th>
                            <th className="p-3 border">Time</th>
                            <th className="p-3 border">Counselor</th>
                            <th className="p-3 border">Status</th>
                            <th className="p-3 border">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historySessions.map(s => (
                            <tr key={s.id} className="text-sm">
                              <td className="p-3 border">{s.studentName}</td>
                              <td className="p-3 border">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{s.priority}</span>
                              </td>
                              <td className="p-3 border">{s.date}</td>
                              <td className="p-3 border">{s.time}</td>
                              <td className="p-3 border">{s.counselor}</td>
                              <td className="p-3 border">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{s.status}</span>
                              </td>
                              <td className="p-3 border">{s.notes || '-'}</td>
                            </tr>
                          ))}
                          {historySessions.length === 0 && (
                            <tr>
                              <td className="p-4 text-center text-gray-500" colSpan={7}>No past sessions</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })()}
          </CardContent>
        </Card>
    </div>
    </PageContainer>
  )
}
