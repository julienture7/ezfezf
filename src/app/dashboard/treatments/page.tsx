'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { toast } from 'react-hot-toast' // Assuming react-hot-toast is available
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
  Activity,
  Loader2 // For loading indicators
} from 'lucide-react'

// Matches Prisma schema for UserTreatment, Treatment, Condition
interface UserTreatment {
  id: string
  userId: string
  treatmentId: string
  conditionId: string
  startDate: string // ISO String
  endDate?: string | null // ISO String
  dosage?: string | null
  frequency?: string | null
  effectivenessRating?: number | null
  sideEffectsExperienced: string[] // Stored as JSON string in DB, parsed to array
  notes?: string | null
  createdAt: string // ISO String
  updatedAt: string // ISO String
  treatment: { // Nested Treatment object
    id: string
    name: string
    type: string // TreatmentType enum: MEDICATION, THERAPY, LIFESTYLE, OTHER
    description?: string | null
  }
  condition: { // Nested Condition object
    id: string
    name: string
    // category: string
  }
}

// Matches Prisma schema for MedicationReminder
interface MedicationReminder {
  id: string
  userTreatmentId: string
  userId: string // Added for convenience if needed, though not directly in Prisma model
  reminderTime: string // "HH:mm"
  daysOfWeek: string[] // Array of DayOfWeek enum
  isActive: boolean
  createdAt: string // ISO String
  updatedAt: string // ISO String
  userTreatment: { // Nested UserTreatment with its own Treatment
    id: string
    treatment: {
      name: string
    }
  }
}

interface Treatment { // Global treatment type
  id: string;
  name: string;
  type: string; // TreatmentType enum
  description?: string | null;
}

interface Condition { // Global condition type
  id: string;
  name: string;
  // description?: string | null;
  // category?: string;
}

interface TreatmentStats {
  totalTreatments: number;
  activeTreatments: number;
  // completedTreatments: number; // Not used in current UI mock
  averageEffectiveness: number;
  // mostEffectiveTreatment: string;
  // treatmentTypes: Record<string, number>;
}


const initialFormState = {
  treatmentId: '',
  conditionId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  dosage: '',
  frequency: '',
  effectivenessRating: 7,
  sideEffectsExperienced: [] as string[],
  notes: '',
  // reminderEnabled is not a direct DB field on UserTreatment
  // Will be handled by creating/deleting reminders separately if time permits
  // For now, it's a UI placeholder.
  reminderEnabled: false,
};


export default function TreatmentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTreatment, setEditingTreatment] = useState<UserTreatment | null>(null)
  const [formState, setFormState] = useState(initialFormState)

  // API Data States
  const [allTreatments, setAllTreatments] = useState<Treatment[]>([])
  const [allConditions, setAllConditions] = useState<Condition[]>([])
  const [userTreatments, setUserTreatments] = useState<UserTreatment[]>([])
  const [reminders, setReminders] = useState<MedicationReminder[]>([])
  const [treatmentStats, setTreatmentStats] = useState<TreatmentStats | null>(null)

  // Loading and Error States
  const [loading, setLoading] = useState({
    allTreatments: false,
    allConditions: false,
    userTreatments: false,
    reminders: false,
    treatmentStats: false,
    formSubmit: false,
  })
  const [errors, setErrors] = useState({
    allTreatments: null,
    allConditions: null,
    userTreatments: null,
    reminders: null,
    treatmentStats: null,
    formSubmit: null,
  })

  const treatmentTypes = ['MEDICATION', 'THERAPY', 'LIFESTYLE', 'ALTERNATIVE', 'OTHER'] // Matches Prisma enum
  const commonSideEffects = [
    'Nausea', 'Dizziness', 'Drowsiness', 'Headache', 'Fatigue',
    'Dry mouth', 'Upset stomach', 'Insomnia', 'Weight gain', 'Weight loss'
  ]

  const fetchData = async () => {
    setLoading(prev => ({ ...prev, allTreatments: true, allConditions: true, userTreatments: true, reminders: true, treatmentStats: true }));
    setErrors(prev => ({ ...prev, allTreatments: null, allConditions: null, userTreatments: null, reminders: null, treatmentStats: null }));

    try {
      const [
        allTreatmentsRes,
        allConditionsRes,
        userTreatmentsRes,
        remindersRes,
        treatmentStatsRes
      ] = await Promise.all([
        fetch('/api/treatments').finally(() => setLoading(prev => ({ ...prev, allTreatments: false }))),
        fetch('/api/conditions').finally(() => setLoading(prev => ({ ...prev, allConditions: false }))),
        fetch('/api/treatments/user').finally(() => setLoading(prev => ({ ...prev, userTreatments: false }))),
        fetch('/api/reminders').finally(() => setLoading(prev => ({ ...prev, reminders: false }))),
        fetch('/api/treatments/stats').finally(() => setLoading(prev => ({ ...prev, treatmentStats: false })))
      ]);

      if (allTreatmentsRes.ok) setAllTreatments(await allTreatmentsRes.json());
      else setErrors(prev => ({ ...prev, allTreatments: `Failed: ${allTreatmentsRes.statusText}` }));

      if (allConditionsRes.ok) setAllConditions(await allConditionsRes.json());
      else setErrors(prev => ({ ...prev, allConditions: `Failed: ${allConditionsRes.statusText}` }));

      if (userTreatmentsRes.ok) setUserTreatments(await userTreatmentsRes.json());
      else setErrors(prev => ({ ...prev, userTreatments: `Failed: ${userTreatmentsRes.statusText}` }));

      if (remindersRes.ok) setReminders(await remindersRes.json());
      else setErrors(prev => ({ ...prev, reminders: `Failed: ${remindersRes.statusText}` }));

      if (treatmentStatsRes.ok) setTreatmentStats(await treatmentStatsRes.json());
      else setErrors(prev => ({ ...prev, treatmentStats: `Failed: ${treatmentStatsRes.statusText}` }));

    } catch (error: any) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load some page data.');
      // Set a general error if needed, or rely on individual error states
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormState(prev => ({ ...prev, effectivenessRating: value[0] }));
  };

  const toggleSideEffect = (effect: string) => {
    setFormState(prev => ({
      ...prev,
      sideEffectsExperienced: prev.sideEffectsExperienced.includes(effect)
        ? prev.sideEffectsExperienced.filter(e => e !== effect)
        : [...prev.sideEffectsExperienced, effect]
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormState(prev => ({ ...prev, reminderEnabled: checked }));
  };

  const openAddForm = () => {
    setEditingTreatment(null);
    setFormState(initialFormState);
    setIsFormOpen(true);
  };

  const openEditForm = (treatment: UserTreatment) => {
    setEditingTreatment(treatment);
    setFormState({
      treatmentId: treatment.treatmentId,
      conditionId: treatment.conditionId,
      startDate: treatment.startDate ? new Date(treatment.startDate).toISOString().split('T')[0] : '',
      endDate: treatment.endDate ? new Date(treatment.endDate).toISOString().split('T')[0] : '',
      dosage: treatment.dosage || '',
      frequency: treatment.frequency || '',
      effectivenessRating: treatment.effectivenessRating || 7,
      sideEffectsExperienced: Array.isArray(treatment.sideEffectsExperienced)
        ? treatment.sideEffectsExperienced
        : (typeof treatment.sideEffectsExperienced === 'string' ? JSON.parse(treatment.sideEffectsExperienced || '[]') : []),
      notes: treatment.notes || '',
      reminderEnabled: false, // Placeholder: logic for this needs to be defined based on actual reminder data
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, formSubmit: true }));
    setErrors(prev => ({ ...prev, formSubmit: null }));

    const payload = {
      treatmentId: formState.treatmentId,
      conditionId: formState.conditionId,
      startDate: formState.startDate,
      endDate: formState.endDate || null,
      dosage: formState.dosage || null,
      frequency: formState.frequency || null,
      effectivenessRating: formState.effectivenessRating,
      sideEffectsExperienced: formState.sideEffectsExperienced,
      notes: formState.notes || null,
    };

    try {
      let response;
      if (editingTreatment) {
        response = await fetch(`/api/treatments/user/${editingTreatment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch('/api/treatments/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingTreatment ? 'update' : 'add'} treatment`);
      }

      toast.success(`Treatment ${editingTreatment ? 'updated' : 'added'} successfully!`);
      setIsFormOpen(false);
      fetchData(); // Re-fetch user treatments and stats
    } catch (error: any) {
      console.error(`Error ${editingTreatment ? 'updating' : 'adding'} treatment:`, error);
      toast.error(error.message || `Could not ${editingTreatment ? 'update' : 'add'} treatment.`);
      setErrors(prev => ({ ...prev, formSubmit: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, formSubmit: false }));
    }
  };

  const handleDeleteTreatment = async (treatmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this treatment?')) return;

    setLoading(prev => ({...prev, userTreatments: true})); // Indicate loading for the list
    try {
      const response = await fetch(`/api/treatments/user/${treatmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete treatment');
      }
      toast.success('Treatment deleted successfully!');
      fetchData(); // Re-fetch user treatments and stats
    } catch (error: any) {
      console.error('Error deleting treatment:', error);
      toast.error(error.message || 'Could not delete treatment.');
    } finally {
       setLoading(prev => ({...prev, userTreatments: false}));
    }
  };


  const getTypeColor = (type: string | undefined) => {
    switch (type?.toUpperCase()) {
      case 'MEDICATION': return 'bg-blue-100 text-blue-800';
      case 'THERAPY': return 'bg-green-100 text-green-800';
      case 'LIFESTYLE': return 'bg-purple-100 text-purple-800';
      case 'ALTERNATIVE': return 'bg-orange-100 text-orange-800';
      case 'OTHER': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffectivenessColor = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) return 'text-gray-500';
    if (rating >= 8) return 'text-green-600';
    if (rating >= 5) return 'text-yellow-600'; // Adjusted threshold
    return 'text-red-600';
  };

  // Helper to format date strings
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Treatment Management</h1>
          <p className="mt-2 text-gray-600">
            Track your treatments, medications, and their effectiveness.
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Treatment
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.treatmentStats ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{treatmentStats?.activeTreatments ?? '--'}</div>
                <p className="text-xs text-muted-foreground">Currently tracking</p>
              </>
            )}
             {errors.treatmentStats && <p className="text-xs text-red-500">{errors.treatmentStats}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Effectiveness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
           {loading.treatmentStats ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">
                  {treatmentStats?.averageEffectiveness ? treatmentStats.averageEffectiveness.toFixed(1) : '--'}/10
                </div>
                <p className="text-xs text-muted-foreground">Across rated treatments</p>
              </>
            )}
            {errors.treatmentStats && <p className="text-xs text-red-500">{errors.treatmentStats}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders Today</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading.reminders ? <Loader2 className="h-6 w-6 animate-spin" /> : (
              <>
                {/* This logic needs to be more sophisticated based on daysOfWeek and current date */}
                <div className="text-2xl font-bold">{reminders.filter(r => r.isActive).length}</div>
                <p className="text-xs text-muted-foreground">Active reminders (not specific to today yet)</p>
              </>
            )}
            {errors.reminders && <p className="text-xs text-red-500">{errors.reminders}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adherence Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Placeholder - Adherence requires more complex tracking */}
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">Feature coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Treatment Form Modal/Dialog (simplified as inline card for now) */}
      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}</CardTitle>
            <CardDescription>
              {editingTreatment ? 'Update the details of your existing treatment.' : 'Record a new treatment or medication you\'re starting.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="treatmentId">Treatment Name</Label>
                  <Select
                    name="treatmentId"
                    value={formState.treatmentId}
                    onValueChange={(value) => handleSelectChange('treatmentId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select treatment" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading.allTreatments && <Loader2 className="h-4 w-4 animate-spin mx-auto" />}
                      {errors.allTreatments && <p className="text-xs text-red-500 p-2">{errors.allTreatments}</p>}
                      {allTreatments.map((treatment) => (
                        <SelectItem key={treatment.id} value={treatment.id}>
                          {treatment.name} ({treatment.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditionId">Condition</Label>
                  <Select
                    name="conditionId"
                    value={formState.conditionId}
                    onValueChange={(value) => handleSelectChange('conditionId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading.allConditions && <Loader2 className="h-4 w-4 animate-spin mx-auto" />}
                      {errors.allConditions && <p className="text-xs text-red-500 p-2">{errors.allConditions}</p>}
                      {allConditions.map((condition) => (
                        <SelectItem key={condition.id} value={condition.id}>
                          {condition.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formState.startDate}
                    onChange={handleFormInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (optional)</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formState.endDate}
                    onChange={handleFormInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    placeholder="e.g., Once daily, As needed"
                    value={formState.frequency}
                    onChange={handleFormInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage/Duration</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    placeholder="e.g., 50mg, 15 minutes"
                    value={formState.dosage}
                    onChange={handleFormInputChange}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Effectiveness: {formState.effectivenessRating}/10</Label>
                  <Slider
                    value={[formState.effectivenessRating]}
                    onValueChange={handleSliderChange}
                    max={10}
                    min={0} // Allow 0 for not effective
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Side Effects Experienced (if any)</Label>
                <div className="flex flex-wrap gap-2">
                  {commonSideEffects.map((effect) => (
                    <Button
                      key={effect}
                      type="button"
                      variant={formState.sideEffectsExperienced.includes(effect) ? "default" : "outline"}
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
                  name="notes"
                  placeholder="Any additional details about this treatment..."
                  value={formState.notes}
                  onChange={handleFormInputChange}
                  rows={3}
                />
              </div>

              {/* Reminder switch is a placeholder for now, as per subtask simplification */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="reminderEnabled"
                  checked={formState.reminderEnabled}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="reminderEnabled">Enable medication reminders (UI Placeholder)</Label>
              </div>
              {formState.reminderEnabled && <p className="text-xs text-muted-foreground">Note: Detailed reminder setup (time, days) would be in a dedicated reminders section or an expanded form. This switch is a placeholder.</p>}


              <div className="flex gap-2">
                <Button type="submit" disabled={loading.formSubmit || !formState.treatmentId || !formState.conditionId}>
                  {loading.formSubmit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingTreatment ? 'Update Treatment' : 'Add Treatment'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={loading.formSubmit}>
                  Cancel
                </Button>
              </div>
              {errors.formSubmit && <p className="text-sm text-red-500">{errors.formSubmit}</p>}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Current Treatments List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Treatments</CardTitle>
          <CardDescription>
            Manage your active and past treatments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading.userTreatments && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
          {errors.userTreatments && <p className="text-red-500 text-center">{errors.userTreatments}</p>}
          {!loading.userTreatments && userTreatments.length === 0 && !errors.userTreatments && (
            <p className="text-center text-gray-500">No treatments added yet. Click "Add Treatment" to get started.</p>
          )}
          <div className="space-y-4">
            {userTreatments.map((ut) => (
              <div key={ut.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{ut.treatment.name}</h3>
                      <Badge className={getTypeColor(ut.treatment.type)}>
                        {ut.treatment.type}
                      </Badge>
                      {/* Reminder badge can be added if there's a direct link or derived from reminders state */}
                    </div>
                    <p className="text-sm text-gray-600">For {ut.condition.name}</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditForm(ut)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTreatment(ut.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Dosage:</span>
                    <p>{ut.dosage || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span>
                    <p>{ut.frequency || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Started:</span>
                    <p>{formatDate(ut.startDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Effectiveness:</span>
                    <p className={`font-semibold ${getEffectivenessColor(ut.effectivenessRating)}`}>
                      {ut.effectivenessRating !== null ? `${ut.effectivenessRating}/10` : 'N/A'}
                    </p>
                  </div>
                </div>

                {(ut.sideEffectsExperienced && (Array.isArray(ut.sideEffectsExperienced) ? ut.sideEffectsExperienced : JSON.parse(ut.sideEffectsExperienced || '[]')).length > 0) && (
                  <div>
                    <span className="text-sm font-medium">Side Effects:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(Array.isArray(ut.sideEffectsExperienced) ? ut.sideEffectsExperienced : JSON.parse(ut.sideEffectsExperienced || '[]')).map((effect: string) => (
                        <Badge key={effect} variant="secondary" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {ut.notes && (
                  <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                    <span className="font-medium">Notes: </span>
                    {ut.notes}
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
            Upcoming Reminders
          </CardTitle>
          <CardDescription>
            Your scheduled medication and treatment reminders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading.reminders && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
          {errors.reminders && <p className="text-red-500 text-center">{errors.reminders}</p>}
          {!loading.reminders && reminders.length === 0 && !errors.reminders &&(
            <p className="text-center text-gray-500">No active reminders found.</p>
          )}
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{reminder.userTreatment.treatment.name}</p>
                    <p className="text-sm text-gray-600">
                      Time: {reminder.reminderTime} | Days: {reminder.daysOfWeek.join(', ')}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled> {/* Mark as Taken is future enhancement */}
                  Mark as Taken
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
