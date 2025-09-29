import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Settings as SettingsIcon, Brain, Shield, Trash2, RefreshCw, AlertTriangle } from 'lucide-react'

interface SettingsProps {
  onRetrain: () => void
  onThresholdChange: (thresholds: { high: number; medium: number }) => void
}

export function Settings({ onRetrain, onThresholdChange }: SettingsProps) {
  const [highThreshold, setHighThreshold] = useState(0.65)
  const [mediumThreshold, setMediumThreshold] = useState(0.35)
  const [autoHyperparameterTuning, setAutoHyperparameterTuning] = useState(false)
  const [dataRetentionDays, setDataRetentionDays] = useState(30)
  const [autoDelete, setAutoDelete] = useState(true)
  const [roleBasedAccess, setRoleBasedAccess] = useState(true)

  const handleThresholdChange = () => {
    onThresholdChange({
      high: highThreshold,
      medium: mediumThreshold
    })
  }

  const modelInfo = {
    version: 'v1.2.3',
    lastTrained: '2025-09-15 01:24:37',
    accuracy: 0.980,
    f1Score: 0.962,
    features: 15,
    trainingSamples: 1000
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure model parameters and system preferences
        </p>
      </div>

      {/* Model Status */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Model Status
          </CardTitle>
          <CardDescription>
            Current model information and training status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Version</span>
                <Badge variant="outline">{modelInfo.version}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Trained</span>
                <span className="text-sm text-muted-foreground">{modelInfo.lastTrained}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Features</span>
                <span className="text-sm text-muted-foreground">{modelInfo.features}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-sm font-mono">{(modelInfo.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">F1-Score</span>
                <span className="text-sm font-mono">{(modelInfo.f1Score * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Training Samples</span>
                <span className="text-sm text-muted-foreground">{modelInfo.trainingSamples.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button onClick={onRetrain} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retrain Model
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Thresholds */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Thresholds
          </CardTitle>
          <CardDescription>
            Adjust the probability thresholds for risk classification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">High Risk Threshold</label>
                <span className="text-sm font-mono">{(highThreshold * 100).toFixed(1)}%</span>
              </div>
              <Slider
                value={[highThreshold]}
                onValueChange={(value) => setHighThreshold(value[0])}
                max={1}
                min={0.5}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Students with probability ≥ {highThreshold} will be classified as high risk
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Medium Risk Threshold</label>
                <span className="text-sm font-mono">{(mediumThreshold * 100).toFixed(1)}%</span>
              </div>
              <Slider
                value={[mediumThreshold]}
                onValueChange={(value) => setMediumThreshold(value[0])}
                max={highThreshold - 0.01}
                min={0.1}
                step={0.01}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Students with probability {mediumThreshold} to {highThreshold} will be classified as medium risk
              </p>
            </div>

            <Button onClick={handleThresholdChange} className="w-full">
              Apply Thresholds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Model Training Settings */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Model Training Settings</CardTitle>
          <CardDescription>
            Configure advanced training parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto Hyperparameter Tuning</label>
                <p className="text-xs text-muted-foreground">
                  Automatically optimize model parameters (takes longer)
                </p>
              </div>
              <Switch
                checked={autoHyperparameterTuning}
                onCheckedChange={setAutoHyperparameterTuning}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Configure data retention and access controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Auto-delete Data</label>
                <p className="text-xs text-muted-foreground">
                  Automatically delete uploaded data after specified days
                </p>
              </div>
              <Switch
                checked={autoDelete}
                onCheckedChange={setAutoDelete}
              />
            </div>

            {autoDelete && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Data Retention Period</label>
                  <span className="text-sm font-mono">{dataRetentionDays} days</span>
                </div>
                <Slider
                  value={[dataRetentionDays]}
                  onValueChange={(value) => setDataRetentionDays(value[0])}
                  max={365}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Data will be automatically deleted after {dataRetentionDays} days
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Role-based Access Control</label>
                <p className="text-xs text-muted-foreground">
                  Restrict certain features to admin users only
                </p>
              </div>
              <Switch
                checked={roleBasedAccess}
                onCheckedChange={setRoleBasedAccess}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="card-hover border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that affect data and model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-950/20">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Clear All Data</h4>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                This will permanently delete all uploaded student data and reset the model.
              </p>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
