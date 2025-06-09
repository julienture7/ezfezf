import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  getUserAppointments,
  createAppointment,
  type AppointmentData
} from '@/lib/api/appointments'
import type { AppointmentStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session.user.role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as AppointmentStatus | null
    const doctorId = searchParams.get('doctorId')
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')

    const filters: {
      status?: AppointmentStatus;
      doctorId?: string;
      startDate?: Date;
      endDate?: Date;
    } = {}
    if (status) filters.status = status
    if (doctorId) filters.doctorId = doctorId
    if (startDateStr) filters.startDate = new Date(startDateStr)
    if (endDateStr) filters.endDate = new Date(endDateStr)

    const appointments = await getUserAppointments(session.user.id, session.user.role, filters)
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized to view these appointments' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to fetch appointments', details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      // Role check can be implicitly handled by createAppointment or add explicit check if needed
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = (await request.json()) as AppointmentData

    if (!data.doctorId || !data.appointmentDate || !data.title) {
      return NextResponse.json({ error: 'Missing required appointment data: doctorId, appointmentDate, and title are required.' }, { status: 400 })
    }
    
    if (isNaN(new Date(data.appointmentDate).getTime())) {
      return NextResponse.json({ error: 'Invalid appointmentDate format.' }, { status: 400 });
    }

    // Assuming createAppointment takes patientId as the first argument
    const newAppointment = await createAppointment(session.user.id, data)
    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    if (errorMessage.toLowerCase().includes('doctor not found')) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }
    if (errorMessage.toLowerCase().includes('doctor is not available at this time') || errorMessage.toLowerCase().includes('conflict')) {
      return NextResponse.json({ error: 'Appointment conflict: Doctor is not available at this time' }, { status: 409 })
    }
    // It's good practice to check session.user.role if only specific roles can create appointments.
    // For example, if only 'PATIENT' role can create an appointment for themselves:
    // if (session.user.role !== 'PATIENT') {
    //   return NextResponse.json({ error: 'Forbidden: Only patients can create appointments.' }, { status: 403 });
    // }
    // However, createAppointment itself might handle this logic internally based on patientId.

    return NextResponse.json({ error: 'Failed to create appointment', details: errorMessage }, { status: 500 })
  }
}
