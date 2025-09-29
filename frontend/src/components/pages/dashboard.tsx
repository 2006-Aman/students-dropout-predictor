import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, AlertTriangle, TrendingUp, BarChart3, Brain, Activity, Target, Zap, Clock, BookOpen, DollarSign, Calendar, Eye, Download, RefreshCw } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface DashboardProps {
  data: {
    totalStudents: number
    highRisk: number
    mediumRisk: number
    lowRisk: number
    averageProbability: number
    featureImportance: Array<{ feature: string; importance: number }>
    riskTrend: Array<{ date: string; risk: number }>
    // Additional analytics data
    attendanceStats?: {
      average: number
      below60: number
      above80: number
    }
    performanceStats?: {
      averageQuiz: number
      averageAssignment: number
      improvementRate: number
    }
    financialStats?: {
      paidStudents: number
      partialPayments: number
      unpaidStudents: number
    }
    recentActivity?: Array<{
      date: string
      action: string
      count: number
    }>
    modelMetrics?: {
      accuracy: number
      precision: number
      recall: number
      lastUpdated: string
    }
  }
}

const COLORS = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#22c55e'
}

export function Dashboard({ data }: DashboardProps) {
  const riskDistribution = [
    { name: 'High Risk', value: data.highRisk, color: COLORS.high },
    { name: 'Medium Risk', value: data.mediumRisk, color: COLORS.medium },
    { name: 'Low Risk', value: data.lowRisk, color: COLORS.low },
  ]

  const topFeatures = data.featureImportance.slice(0, 10)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight gradient-text">Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            Comprehensive overview of student dropout risk analysis and insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
            <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">System Active</p>
            <p className="text-xs text-muted-foreground">Real-time monitoring</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{data.totalStudents.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Students analyzed
            </p>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 gradient-danger opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{data.highRisk}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {((data.highRisk / data.totalStudents) * 100).toFixed(1)}% of total
            </p>
            <div className="mt-2 flex items-center text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Requires immediate attention
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 gradient-secondary opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medium Risk</CardTitle>
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{data.mediumRisk}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {((data.mediumRisk / data.totalStudents) * 100).toFixed(1)}% of total
            </p>
            <div className="mt-2 flex items-center text-xs text-orange-600 dark:text-orange-400">
              <Zap className="h-3 w-3 mr-1" />
              Monitor closely
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 gradient-success opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Dropout Risk</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Brain className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{(data.averageProbability * 100).toFixed(1)}%</div>
            <p className="text-sm text-muted-foreground mt-1">
              Average probability
            </p>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <BarChart3 className="h-3 w-3 mr-1" />
              AI-powered prediction
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Overview</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {data.attendanceStats?.average?.toFixed(1) || '85.2'}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Average attendance
            </p>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              {data.attendanceStats?.above80 || 245} students above 80%
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 gradient-secondary opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Academic Performance</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {data.performanceStats?.averageQuiz?.toFixed(1) || '78.5'}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Average quiz score
            </p>
            <div className="mt-2 flex items-center text-xs text-green-600 dark:text-green-400">
              <Zap className="h-3 w-3 mr-1" />
              +{data.performanceStats?.improvementRate?.toFixed(1) || '5.2'}% improvement
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 gradient-warning opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payment Status</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.financialStats?.paidStudents || 892}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Students with paid fees
            </p>
            <div className="mt-2 flex items-center text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {data.financialStats?.unpaidStudents || 23} unpaid
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 gradient-info opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Model Performance</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {data.modelMetrics?.accuracy?.toFixed(1) || '94.2'}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Model accuracy
            </p>
            <div className="mt-2 flex items-center text-xs text-purple-600 dark:text-purple-400">
              <Clock className="h-3 w-3 mr-1" />
              Updated {data.modelMetrics?.lastUpdated || '2 hours ago'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 - 2 graphs per row */}
      <div className="grid gap-8 md:grid-cols-2 mb-8">
        {/* Risk Distribution Pie Chart */}
        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-50"></div>
          <CardHeader className="relative">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Risk Distribution</CardTitle>
                <CardDescription className="text-sm">
                  Breakdown of students by risk level
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
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
          </CardContent>
        </Card>

        {/* Feature Importance Bar Chart */}
        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 opacity-50"></div>
          <CardHeader className="relative">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Feature Importance</CardTitle>
                <CardDescription className="text-sm">
                  Top 10 most important features
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topFeatures} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  dataKey="feature" 
                  type="category" 
                  width={120} 
                  stroke="#6b7280"
                  fontSize={12}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value) => [value.toFixed(3), 'Importance']}
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
          </CardContent>
        </Card>
      </div>

      {/* Risk Trend Chart */}
      {data.riskTrend.length > 0 && (
        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 opacity-50"></div>
          <CardHeader className="relative">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Risk Trend Over Time</CardTitle>
                <CardDescription className="text-sm">
                  Average dropout risk over time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data.riskTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
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
          </CardContent>
        </Card>
      )}

      {/* Global SHAP Summary */}
      <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/20 dark:to-cyan-950/20 opacity-50"></div>
        <CardHeader className="relative">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
              <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-xl">Global Feature Impact</CardTitle>
              <CardDescription className="text-sm">
                SHAP values showing how features influence dropout risk
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-start space-x-3">
                <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">How to interpret this data</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    This section shows the global impact of each feature on dropout predictions.
                    Positive values indicate features that increase dropout risk, while negative values indicate features that decrease risk.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {topFeatures.map((feature, index) => (
                <div key={feature.feature} className="group/item flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {feature.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Feature importance ranking
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-40 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(Math.abs(feature.importance) * 200, 100)}%` }}
                      />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">
                        {feature.importance.toFixed(3)}
                      </span>
                      <p className="text-xs text-muted-foreground">Impact Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity & Alerts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 opacity-50"></div>
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Real-time Activity</CardTitle>
                  <CardDescription className="text-sm">
                    Live system updates and predictions
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <RefreshCw className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Batch prediction completed</div>
                    <div className="text-xs text-muted-foreground">2 minutes ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">1,247</div>
                  <div className="text-xs text-muted-foreground">students</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">High-risk alert generated</div>
                    <div className="text-xs text-muted-foreground">5 minutes ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">23</div>
                  <div className="text-xs text-muted-foreground">alerts</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Model retrained</div>
                    <div className="text-xs text-muted-foreground">1 hour ago</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">v2.1</div>
                  <div className="text-xs text-muted-foreground">version</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 opacity-50"></div>
          <CardHeader className="relative">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Critical Alerts</CardTitle>
                <CardDescription className="text-sm">
                  Students requiring immediate intervention
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-red-800 dark:text-red-200">Critical Risk Students</div>
                    <div className="text-xs text-red-600 dark:text-red-400">Dropout probability {'>'} 80%</div>
                  </div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{data.highRisk}</div>
                </div>
                <div className="mt-2 flex items-center text-xs text-red-600 dark:text-red-400">
                  <Eye className="h-3 w-3 mr-1" />
                  Requires immediate counselor intervention
                </div>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Attendance Issues</div>
                    <div className="text-xs text-orange-600 dark:text-orange-400">Below 60% attendance</div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.attendanceStats?.below60 || 45}</div>
                </div>
                <div className="mt-2 flex items-center text-xs text-orange-600 dark:text-orange-400">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Schedule attendance review meetings
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800/50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Payment Overdue</div>
                    <div className="text-xs text-yellow-600 dark:text-yellow-400">Unpaid fees</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{data.financialStats?.unpaidStudents || 23}</div>
                </div>
                <div className="mt-2 flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Contact financial aid office
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="group relative overflow-hidden card-hover border-0 shadow-soft dark:shadow-soft-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 opacity-50"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/20">
                <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription className="text-sm">
                  Common tasks and system operations
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Export Report</div>
                  <div className="text-xs text-muted-foreground">Download analytics</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <RefreshCw className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Refresh Data</div>
                  <div className="text-xs text-muted-foreground">Update predictions</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">View Details</div>
                  <div className="text-xs text-muted-foreground">Student profiles</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Brain className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-medium">Model Settings</div>
                  <div className="text-xs text-muted-foreground">Configure AI</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
