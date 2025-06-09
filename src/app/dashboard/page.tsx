'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Heart,
  Pill,
  TrendingUp,
  MessageSquare,
  Users,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardData {
  healthMetrics: {
    symptomsToday: number
    activeTreatments: number
    appointmentsThisWeek: number
    treatmentEffectiveness: number
  }
  recentSymptoms: Array<{
    id: string
    name: string
    severity: number
    time: string
  }>
  upcomingAppointments: Array<{
    id: string
    title: string
    date: string
    time: string
    type: string
  }>
  currentTreatments: Array<{
    id: string
    name: string
    type: string
    effectiveness: number
    dosage?: string
    frequency?: string
  }>
  stats: {
    symptomStats: any
    treatmentStats: any
    conditionStats: any
  }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  // Mock forum activity data (not implemented in API yet)
  const recentForumActivity = [
    {
      id: 1,
      title: 'New migraine prevention techniques',
      forum: 'Migraine Support',
      replies: 23,
      lastActivity: '1 hour ago'
    },
    {
      id: 2,
      title: 'Side effects of new medication',
      forum: 'Treatment Discussion',
      replies: 8,
      lastActivity: '3 hours ago'
    }
  ]

  if (user?.role === 'DOCTOR') {
    return <DoctorDashboard />
  }

  if (user?.role === 'ADMIN') {
    return <AdminDashboard />
  }

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    )
  }

  const healthMetrics = dashboardData?.healthMetrics || {
    symptomsToday: 0,
    activeTreatments: 0,
    appointmentsThisWeek: 0,
    treatmentEffectiveness: 0
  }

  const recentSymptoms = dashboardData?.recentSymptoms || []
  const upcomingAppointments = dashboardData?.upcomingAppointments || []
  const currentTreatments = dashboardData?.currentTreatments || []

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullName || user?.name || 'User'}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your health journey today.
        </p>
      </div>

      {/* Health Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Symptoms Today</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.symptomsToday}</div>
            <p className="text-xs text-muted-foreground">
              -2 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Treatments</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.activeTreatments}</div>
            <p className="text-xs text-muted-foreground">
              Active treatments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.appointmentsThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.length > 0 ? `Next: ${upcomingAppointments[0].date} ${upcomingAppointments[0].time}` : 'No upcoming appointments'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatment Effectiveness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.treatmentEffectiveness}%</div>
            <p className="text-xs text-muted-foreground">
              Average effectiveness
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Symptoms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Symptoms
              <Link href="/dashboard/symptoms">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Symptom
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSymptoms.length > 0 ? (
                recentSymptoms.map((symptom) => (
                  <div key={symptom.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{symptom.name}</p>
                      <p className="text-sm text-gray-500">{symptom.time}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(symptom.severity / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{symptom.severity}/10</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No recent symptoms logged</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Upcoming Appointments
              <Link href="/dashboard/appointments">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{appointment.title}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {appointment.type === 'video_call' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Video Call
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Person
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No upcoming appointments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Treatments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Treatments
              <Link href="/dashboard/treatments">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentTreatments.length > 0 ? (
                currentTreatments.map((treatment) => (
                  <div key={treatment.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{treatment.name}</h4>
                      <span className="text-sm text-gray-500">{treatment.effectiveness}% effective</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {treatment.dosage && `${treatment.dosage} `}
                      {treatment.frequency && `- ${treatment.frequency}`}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No active treatments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Community Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Community Activity
              <Link href="/dashboard/community">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join Discussion
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentForumActivity.map((activity) => (
                <div key={activity.id} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.forum}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {activity.replies} replies • {activity.lastActivity}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/dashboard/symptoms">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
            <Heart className="h-6 w-6 mb-2" />
            <span className="text-sm">Log Symptoms</span>
          </Button>
        </Link>
        <Link href="/dashboard/treatments">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
            <Pill className="h-6 w-6 mb-2" />
            <span className="text-sm">Track Medication</span>
          </Button>
        </Link>
        <Link href="/dashboard/appointments">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
            <Calendar className="h-6 w-6 mb-2" />
            <span className="text-sm">Book Appointment</span>
          </Button>
        </Link>
        <Link href="/dashboard/community">
          <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
            <Users className="h-6 w-6 mb-2" />
            <span className="text-sm">Join Community</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}

function DoctorDashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your patients and appointments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Today's Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-gray-600">2 new consultations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-gray-600">Treatment plans to review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-sm text-gray-600">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-12">
        <p className="text-gray-500">Doctor dashboard features coming soon...</p>
      </div>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-sm text-gray-600">+23 today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Forums</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-sm text-gray-600">156 new posts today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-sm text-gray-600">5 pending verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-sm text-gray-600">Uptime</p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center py-12">
        <p className="text-gray-500">Admin dashboard features coming soon...</p>
      </div>
    </div>
  )
}
