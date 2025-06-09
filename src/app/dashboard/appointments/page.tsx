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
    doctorProfile?: {
      specialization: string
      clinicAddress?: string
    }
  }
}

export default function AppointmentsPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_CALL': return '🎥'
      case 'PHONE_CALL': return '📞'
      case 'IN_PERSON': return '🏥'
      default: return '📅'
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate)
    const now = new Date()
    
    switch (filter) {
      case 'upcoming':
        return appointmentDate >= now && appointment.status !== 'CANCELLED'
      case 'past':
        return appointmentDate < now || appointment.status === 'COMPLETED'
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-600">Manage your medical appointments</p>
        </div>
        {session?.user?.role === 'PATIENT' && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Book Appointment
          </Button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === 'past' ? 'default' : 'outline'}
          onClick={() => setFilter('past')}
        >
          Past
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 text-center">
              {filter === 'upcoming' 
                ? "You don't have any upcoming appointments."
                : "No appointments match your current filter."
              }
            </p>
            {session?.user?.role === 'PATIENT' && filter === 'upcoming' && (
              <Button className="mt-4">
                Book Your First Appointment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span>{getTypeIcon(appointment.type)}</span>
                      {appointment.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {appointment.description}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(appointment.appointmentDate), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {format(new Date(appointment.appointmentDate), 'p')} 
                        ({appointment.durationMinutes} min)
                      </span>
                    </div>
                    {appointment.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{appointment.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>
                        {session?.user?.role === 'PATIENT' 
                          ? `Dr. ${appointment.doctor.fullName}`
                          : appointment.patient.fullName
                        }
                      </span>
                    </div>
                    {appointment.doctor.doctorProfile?.specialization && (
                      <div className="text-sm text-gray-600">
                        {appointment.doctor.doctorProfile.specialization}
                      </div>
                    )}
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{appointment.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {appointment.status === 'SCHEDULED' && (
                    <>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="destructive" size="sm">
                        Cancel
                      </Button>
                    </>
                  )}
                  {appointment.type === 'VIDEO_CALL' && appointment.status === 'CONFIRMED' && (
                    <Button size="sm">
                      Join Video Call
                    </Button>
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
EOF  
cd /home/project && cd ezfezf && cat > src/app/dashboard/appointments/page.tsx << 'EOF'
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
    doctorProfile?: {
      specialization: string
      clinicAddress?: string
    }
  }
}

export default function AppointmentsPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO_CALL': return '🎥'
      case 'PHONE_CALL': return '📞'
      case 'IN_PERSON': return '🏥'
      default: return '📅'
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate)
    const now = new Date()
    
    switch (filter) {
      case 'upcoming':
        return appointmentDate >= now && appointment.status !== 'CANCELLED'
      case 'past':
        return appointmentDate < now || appointment.status === 'COMPLETED'
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-600">Manage your medical appointments</p>
        </div>
        {session?.user?.role === 'PATIENT' && (
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Book Appointment
          </Button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant={filter === 'past' ? 'default' : 'outline'}
          onClick={() => setFilter('past')}
        >
          Past
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 text-center">
              {filter === 'upcoming' 
                ? "You don't have any upcoming appointments."
                : "No appointments match your current filter."
              }
            </p>
            {session?.user?.role === 'PATIENT' && filter === 'upcoming' && (
              <Button className="mt-4">
                Book Your First Appointment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span>{getTypeIcon(appointment.type)}</span>
                      {appointment.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {appointment.description}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{format(new Date(appointment.appointmentDate), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {format(new Date(appointment.appointmentDate), 'p')} 
                        ({appointment.durationMinutes} min)
                      </span>
                    </div>
                    {appointment.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{appointment.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>
                        {session?.user?.role === 'PATIENT' 
                          ? `Dr. ${appointment.doctor.fullName}`
                          : appointment.patient.fullName
                        }
                      </span>
                    </div>
                    {appointment.doctor.doctorProfile?.specialization && (
                      <div className="text-sm text-gray-600">
                        {appointment.doctor.doctorProfile.specialization}
                      </div>
                    )}
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{appointment.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {appointment.status === 'SCHEDULED' && (
                    <>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="destructive" size="sm">
                        Cancel
                      </Button>
                    </>
                  )}
                  {appointment.type === 'VIDEO_CALL' && appointment.status === 'CONFIRMED' && (
                    <Button size="sm">
                      Join Video Call
                    </Button>
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
