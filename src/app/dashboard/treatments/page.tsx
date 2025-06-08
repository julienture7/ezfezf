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
import { Switch } from '@/components/ui/switch'
import {
  Pill,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Bell,
  Activity
} from 'lucide-react'

interface Treatment {
  id: string
  name: string
  type: 'medication' | 'therapy' | 'lifestyle' | 'alternative'
  condition: string
  startDate: string
  endDate?: string
  dosage?: string
  frequency?: string
  effectivenessRating?: number
  sideEffects: string[]
  notes: string
  isActive: boolean
  reminderEnabled: boolean
  reminderTimes: string[]
}

interface Reminder {
  id: string
  treatmentId: string
  treatmentName: string
  time: string
  days: string[]
  isActive: boolean
  lastTaken?: string
}

export default function TreatmentsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [effectiveness, setEffectiveness] = useState([7])
  const [selectedType, setSelectedType] = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [treatmentName, setTreatmentName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [notes, setNotes] = useState('')
  const [sideEffects, setSideEffects] = useState<string[]>([])
  const [reminderEnabled, setReminderEnabled] = useState(true)

  // Mock data - in real app, this would come from your API
  const treatmentTypes = ['medication', 'therapy', 'lifestyle', 'alternative']
  const conditions = ['Migraine', 'Anxiety', 'Depression', 'GERD', 'Hypertension']
  const commonSideEffects = [
    'Nausea', 'Dizziness', 'Drowsiness', 'Headache', 'Fatigue',
    'Dry mouth', 'Upset stomach', 'Insomnia', 'Weight gain', 'Weight loss'
  ]

  const currentTreatments: Treatment[] = [
    {
      id: '1',
      name: 'Sumatriptan',
      type: 'medication',
      condition: 'Migraine',
      startDate: '2024-02-01',
      dosage: '50mg',
      frequency: 'As needed',
      effectivenessRating: 8,
      sideEffects: ['Mild nausea', 'Drowsiness'],
      notes: 'Works well for severe migraines. Take at first sign of headache.',
      isActive: true,
      reminderEnabled: false,
      reminderTimes: []
    },
    {
      id: '2',
      name: 'Meditation',
      type: 'lifestyle',
      condition: 'Anxiety',
      startDate: '2024-01-15',
      dosage: '15 minutes',
      frequency: 'Daily',
      effectivenessRating: 7,
      sideEffects: [],
      notes: 'Using Headspace app. Helps reduce daily anxiety.',
      isActive: true,
      reminderEnabled: true,
      reminderTimes: ['07:00', '19:00']
    },
    {
      id: '3',
      name: 'Omeprazole',
      type: 'medication',
      condition: 'GERD',
      startDate: '2024-03-01',
      dosage: '20mg',
      frequency: 'Once daily',
      effectivenessRating: 9,
      sideEffects: [],
      notes: 'Take before breakfast. Significant improvement in symptoms.',
      isActive: true,
      reminderEnabled: true,
      reminderTimes: ['08:00']
    }
  ]

  const upcomingReminders: Reminder[] = [
    {
      id: '1',
      treatmentId: '2',
      treatmentName: 'Morning Meditation',
      time: '07:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      isActive: true
    },
    {
      id: '2',
      treatmentId: '3',
      treatmentName: 'Omeprazole',
      time: '08:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      isActive: true,
      lastTaken: '2024-06-08T08:00:00Z'
    },
    {
      id: '3',
      treatmentId: '2',
      treatmentName: 'Evening Meditation',
      time: '19:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      isActive: true
    }
  ]

  const toggleSideEffect = (effect: string) => {
    setSideEffects(prev =>
      prev.includes(effect)
        ? prev.filter(e => e !== effect)
        : [...prev, effect]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newTreatment: Treatment = {
      id: Date.now().toString(),
      name: treatmentName,
      type: selectedType as Treatment['type'],
      condition: selectedCondition,
      startDate: new Date().toISOString().split('T')[0],
      dosage,
      frequency,
      effectivenessRating: effectiveness[0],
      sideEffects,
      notes,
      isActive: true,
      reminderEnabled,
      reminderTimes: reminderEnabled ? ['08:00'] : []
    }

    console.log('New treatment:', newTreatment)

    // Reset form
    setTreatmentName('')
    setSelectedType('')
    setSelectedCondition('')
    setDosage('')
    setFrequency('')
    setNotes('')
    setSideEffects([])
    setEffectiveness([7])
    setReminderEnabled(true)
    setShowAddForm(false)

    alert('Treatment added successfully!')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-blue-100 text-blue-800'
      case 'therapy': return 'bg-green-100 text-green-800'
      case 'lifestyle': return 'bg-purple-100 text-purple-800'
      case 'alternative': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEffectivenessColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600'
    if (rating >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatment Management</h1>
          <p className="mt-2 text-gray-600">
            Track your treatments, medications, and their effectiveness.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Treatment
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentTreatments.filter(t => t.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Currently tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Effectiveness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(currentTreatments.reduce((acc, t) => acc + (t.effectivenessRating || 0), 0) / currentTreatments.length * 10) / 10}/10
            </div>
            <p className="text-xs text-muted-foreground">Across all treatments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders Today</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingReminders.filter(r => r.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherence Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Treatment Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Treatment</CardTitle>
            <CardDescription>
              Record a new treatment or medication you're starting.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="treatment-name">Treatment Name</Label>
                  <Input
                    id="treatment-name"
                    placeholder="e.g., Ibuprofen, Yoga, Meditation"
                    value={treatmentName}
                    onChange={(e) => setTreatmentName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Treatment Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {treatmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., Once daily, As needed"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage/Duration</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 50mg, 15 minutes"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Effectiveness: {effectiveness[0]}/10</Label>
                  <Slider
                    value={effectiveness}
                    onValueChange={setEffectiveness}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Side Effects (if any)</Label>
                <div className="flex flex-wrap gap-2">
                  {commonSideEffects.map((effect) => (
                    <Button
                      key={effect}
                      type="button"
                      variant={sideEffects.includes(effect) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSideEffect(effect)}
                    >
                      {effect}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional details about this treatment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="reminder"
                  checked={reminderEnabled}
                  onCheckedChange={setReminderEnabled}
                />
                <Label htmlFor="reminder">Enable medication reminders</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!treatmentName || !selectedType}>
                  Add Treatment
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Current Treatments */}
      <Card>
        <CardHeader>
          <CardTitle>Current Treatments</CardTitle>
          <CardDescription>
            Manage your active treatments and track their effectiveness.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentTreatments.map((treatment) => (
              <div key={treatment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{treatment.name}</h3>
                      <Badge className={getTypeColor(treatment.type)}>
                        {treatment.type}
                      </Badge>
                      {treatment.reminderEnabled && (
                        <Badge variant="secondary">
                          <Bell className="h-3 w-3 mr-1" />
                          Reminders On
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">For {treatment.condition}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Dosage:</span>
                    <p>{treatment.dosage || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span>
                    <p>{treatment.frequency || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Started:</span>
                    <p>{new Date(treatment.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium">Effectiveness:</span>
                    <p className={`font-semibold ${getEffectivenessColor(treatment.effectivenessRating || 0)}`}>
                      {treatment.effectivenessRating}/10
                    </p>
                  </div>
                </div>

                {treatment.sideEffects.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Side Effects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {treatment.sideEffects.map((effect) => (
                        <Badge key={effect} variant="secondary" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {treatment.notes && (
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <span className="font-medium">Notes: </span>
                    {treatment.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Today's Reminders
          </CardTitle>
          <CardDescription>
            Your scheduled medication and treatment reminders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{reminder.treatmentName}</p>
                    <p className="text-sm text-gray-600">{reminder.time}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {reminder.lastTaken && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <Button size="sm" variant={reminder.lastTaken ? "outline" : "default"}>
                    {reminder.lastTaken ? 'Taken' : 'Mark as Taken'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
