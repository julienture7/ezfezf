import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  type AppointmentUpdateData // Ensure this is imported if not already
} from '@/lib/api/appointments'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session.user.role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

    const appointment = await getAppointmentById(id, session.user.id, session.user.role)

    if (!appointment) {
      // getAppointmentById returns null if not found or user is not authorized.
      return NextResponse.json({ error: 'Appointment not found or access denied' }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment by ID:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    // Check if the error from the lib is "Failed to fetch appointment" which is generic
    // The more specific error handling (404) is handled by the null check above
    return NextResponse.json({ error: 'Failed to fetch appointment', details: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session.user.role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

    const data = (await request.json()) as AppointmentUpdateData

    if (Object.keys(data).length === 0) {
        return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }
    if (data.appointmentDate && typeof data.appointmentDate === 'string' && isNaN(new Date(data.appointmentDate).getTime())) {
        return NextResponse.json({ error: 'Invalid appointmentDate format.' }, { status: 400 });
    }
    // Add other validations for data fields as necessary, e.g. status enum check

    const updatedAppointment = await updateAppointment(id, session.user.id, session.user.role, data)
    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.toLowerCase().includes('forbidden')) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to update this appointment.' }, { status: 403 })
    }
    if (errorMessage.toLowerCase().includes('not found')) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    if (errorMessage.toLowerCase().includes('doctor is not available at this time') || errorMessage.toLowerCase().includes('conflict')) {
      return NextResponse.json({ error: 'Appointment conflict: Doctor is not available at this time' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to update appointment', details: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !session.user.role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
    }

    await cancelAppointment(id, session.user.id, session.user.role)

    // Return 204 No Content on successful cancellation (which is an update to 'CANCELLED')
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.toLowerCase().includes('forbidden')) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to cancel this appointment.' }, { status: 403 })
    }
    if (errorMessage.toLowerCase().includes('not found')) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to cancel appointment', details: errorMessage }, { status: 500 })
  }
}
