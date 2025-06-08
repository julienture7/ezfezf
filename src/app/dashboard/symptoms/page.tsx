'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Calendar, Heart, Clock, TrendingUp, Plus, Filter } from 'lucide-react'

interface SymptomLog {
  id: string
  symptomName: string
  severity: number
  duration: number
  triggers: string[]
  notes: string
  timestamp: string
}

export default function SymptomsPage() {
  const [showLogForm, setShowLogForm] = useState(false)
  const [severity, setSeverity] = useState([5])
  const [duration, setDuration] = useState('')
  const [selectedSymptom, setSelectedSymptom] = useState('')
  const [triggers, setTriggers] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  // Mock data - in real app, this would come from your API
  const commonSymptoms = [
    'Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Joint Pain',
    'Anxiety', 'Sleep Issues', 'Stomach Pain', 'Muscle Tension', 'Mood Changes'
  ]

  const commonTriggers = [
    'Stress', 'Weather', 'Food', 'Exercise', 'Sleep', 'Medication',
    'Work', 'Social Situations', 'Screen Time', 'Bright Lights'
  ]

  const recentLogs: SymptomLog[] = [
    {
      id: '1',
      symptomName: 'Headache',
      severity: 7,
      duration: 120,
      triggers: ['Stress', 'Screen Time'],
      notes: 'Started after long work session, felt better after break',
      timestamp: '2024-06-08T14:30:00Z'
    },
    {
      id: '2',
      symptomName: 'Fatigue',
      severity: 5,
      duration: 240,
      triggers: ['Sleep'],
      notes: 'Poor sleep last night, felt tired all morning',
      timestamp: '2024-06-08T09:00:00Z'
    },
    {
      id: '3',
      symptomName: 'Nausea',
      severity: 4,
      duration: 30,
      triggers: ['Food'],
      notes: 'After breakfast, went away quickly',
      timestamp: '2024-06-07T08:30:00Z'
    }
  ]

  const toggleTrigger = (trigger: string) => {
    setTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newLog: SymptomLog = {
      id: Date.now().toString(),
      symptomName: selectedSymptom,
      severity: severity[0],
      duration: Number.parseInt(duration) || 0,
      triggers,
      notes,
      timestamp: new Date().toISOString()
    }

    console.log('New symptom log:', newLog)

    // Reset form
    setSelectedSymptom('')
    setSeverity([5])
    setDuration('')
    setTriggers([])
    setNotes('')
    setShowLogForm(false)

    // In real app, save to API
    alert('Symptom logged successfully!')
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'bg-green-500'
    if (severity <= 6) return 'bg-yellow-500'
    if (severity <= 8) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getSeverityText = (severity: number) => {
    if (severity <= 3) return 'Mild'
    if (severity <= 6) return 'Moderate'
    if (severity <= 8) return 'Severe'
    return 'Very Severe'
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Symptom Tracker</h1>
          <p className="mt-2 text-gray-600">
            Log and track your symptoms to identify patterns and triggers.
          </p>
        </div>
        <Button onClick={() => setShowLogForm(!showLogForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Symptom
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Symptoms</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">-1 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Severity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.3/10</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Headache</div>
            <p className="text-xs text-muted-foreground">12 times this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Trigger</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Stress</div>
            <p className="text-xs text-muted-foreground">65% of symptoms</p>
          </CardContent>
        </Card>
      </div>

      {/* Log Form */}
      {showLogForm && (
        <Card>
          <CardHeader>
            <CardTitle>Log New Symptom</CardTitle>
            <CardDescription>
              Record details about your symptom to help track patterns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symptom">Symptom Type</Label>
                  <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select symptom type" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonSymptoms.map((symptom) => (
                        <SelectItem key={symptom} value={symptom}>
                          {symptom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="How long did it last?"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Severity: {severity[0]}/10 - {getSeverityText(severity[0])}</Label>
                <Slider
                  value={severity}
                  onValueChange={setSeverity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                  <span>Very Severe</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Possible Triggers</Label>
                <div className="flex flex-wrap gap-2">
                  {commonTriggers.map((trigger) => (
                    <Button
                      key={trigger}
                      type="button"
                      variant={triggers.includes(trigger) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTrigger(trigger)}
                    >
                      {trigger}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional details about this symptom..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!selectedSymptom}>
                  Log Symptom
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowLogForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Symptom Logs</CardTitle>
          <CardDescription>
            Your symptom history and patterns over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{log.symptomName}</h3>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getSeverityColor(log.severity)}`}
                      />
                      <span className="text-sm font-medium">
                        {log.severity}/10 - {getSeverityText(log.severity)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(log.timestamp).toLocaleDateString()} at{' '}
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Duration: {formatDuration(log.duration)}</span>
                  {log.triggers.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <span>Triggers:</span>
                      <div className="flex space-x-1">
                        {log.triggers.map((trigger) => (
                          <Badge key={trigger} variant="secondary" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {log.notes && (
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {log.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {recentLogs.length === 0 && (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No symptoms logged yet</h3>
              <p className="text-gray-600 mb-4">
                Start tracking your symptoms to identify patterns and triggers.
              </p>
              <Button onClick={() => setShowLogForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Log Your First Symptom
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patterns & Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Patterns & Insights</CardTitle>
          <CardDescription>
            AI-powered insights based on your symptom data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Pattern Detected</h4>
              <p className="text-blue-800 text-sm">
                Your headaches seem to occur more frequently on weekdays, particularly after long screen time sessions.
                Consider taking regular breaks and using blue light filters.
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Improvement Noted</h4>
              <p className="text-green-800 text-sm">
                Your average symptom severity has decreased by 15% over the past month. Keep up the good work!
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Recommendation</h4>
              <p className="text-yellow-800 text-sm">
                Stress appears to be your most common trigger. Consider incorporating stress management techniques
                like meditation or deep breathing exercises into your daily routine.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
