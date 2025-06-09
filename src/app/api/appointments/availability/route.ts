import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get('doctorId')
    const date = searchParams.get('date')

    if (!doctorId) {
      return NextResponse.json(
        { error: 'Doctor ID is required' },
        { status: 400 }
      )
    }

    // Verify doctor exists
    const doctor = await prisma.user.findFirst({
      where: {
        id: doctorId,
        role: 'DOCTOR'
      }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    let targetDate = new Date()
    if (date) {
      targetDate = new Date(date)
      if (Number.isNaN(targetDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }
    }

    // Set to start of day
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    // Get existing appointments for the doctor on this date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: ['CONFIRMED', 'PENDING']
        }
      }
    })

    // Generate available time slots
    const availableSlots = generateTimeSlots(targetDate, existingAppointments)

    return NextResponse.json({
      doctorId,
      date: targetDate.toISOString().split('T')[0],
      availableSlots
    })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}

function generateTimeSlots(date: Date, existingAppointments: any[]) {
  const slots = []
  const workStartHour = 9 // 9 AM
  const workEndHour = 17 // 5 PM
  const slotDurationMinutes = 30

  const existingTimes = existingAppointments.map(apt =>
    new Date(apt.appointmentDate).toTimeString().slice(0, 5)
  )

  for (let hour = workStartHour; hour < workEndHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

      if (!existingTimes.includes(timeString)) {
        const slotDateTime = new Date(date)
        slotDateTime.setHours(hour, minute, 0, 0)

        // Only show future slots if it's today
        const now = new Date()
        if (date.toDateString() !== now.toDateString() || slotDateTime > now) {
          slots.push({
            time: timeString,
            available: true
          })
        }
      }
    }
  }

  return slots
}
