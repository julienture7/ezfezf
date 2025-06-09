'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, User, Plus } from 'lucide-react'
import { format } from 'date-fns'

interface Appointment {
  id: string
  title: string
  description: string
  appointmentDate: string
  durationMinutes: number
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  location?: string
  type: 'IN_PERSON' | 'VIDEO_CALL' | 'PHONE_CALL'
  notes?: string
  patient: {
    id: string
    fullName: string
    email: string
    image?: string
  }
  doctor: {
    id: string
    fullName: string
    email: string
    image?: string
    specialization?: string
  }
}

export default function AppointmentsPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetchAppointments()
    }
  }, [session])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (!response.ok) {
        throw new Error('Failed to fetch appointments')
      }
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IN_PERSON':
        return <MapPin className="h-4 w-4" />
      case 'VIDEO_CALL':
        return <Calendar className="h-4 w-4" />
      case 'PHONE_CALL':
        return <Clock className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Appointments</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Appointments</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={fetchAppointments} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
            <p className="text-gray-500 mb-4">Get started by scheduling your first appointment</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{appointment.title}</CardTitle>
                    <CardDescription>{appointment.description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.toLowerCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {format(new Date(appointment.appointmentDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>
                      {format(new Date(appointment.appointmentDate), 'h:mm a')}
                      ({appointment.durationMinutes} min)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(appointment.type)}
                    <span className="capitalize">
                      {appointment.type.replace('_', ' ').toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>
                      {session?.user?.role === 'DOCTOR'
                        ? appointment.patient.fullName
                        : appointment.doctor.fullName}
                    </span>
                  </div>
                </div>

                {appointment.location && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{appointment.location}</span>
                  </div>
                )}

                {appointment.notes && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">{appointment.notes}</p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {appointment.status === 'SCHEDULED' && (
                    <>
                      <Button size="sm">Confirm</Button>
                      <Button size="sm" variant="outline">Reschedule</Button>
                      <Button size="sm" variant="destructive">Cancel</Button>
                    </>
                  )}
                  {appointment.status === 'CONFIRMED' && (
                    <>
                      <Button size="sm">Join Call</Button>
                      <Button size="sm" variant="outline">Reschedule</Button>
                    </>
                  )}
                  {appointment.status === 'COMPLETED' && (
                    <Button size="sm" variant="outline">View Details</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
