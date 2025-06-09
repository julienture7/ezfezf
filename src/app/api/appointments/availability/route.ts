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

    // Get date range for availability check
    let startDate: Date
    let endDate: Date

    if (date) {
      startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
    } else {
      // Default to next 7 days
      startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date()
      endDate.setDate(endDate.getDate() + 7)
      endDate.setHours(23, 59, 59, 999)
    }

    // Get existing appointments for the doctor
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: startDate,
          lte: endDate
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        }
      },
      select: {
        appointmentDate: true,
        durationMinutes: true,
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    })

    // Generate available time slots
    const availableSlots = generateAvailableSlots(startDate, endDate, existingAppointments)

    return NextResponse.json({
      doctorId,
      dateRange: {
        start: startDate,
        end: endDate
      },
      availableSlots,
      existingAppointments: existingAppointments.length
    })
  } catch (error) {
    console.error('Error fetching doctor availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctor availability' },
      { status: 500 }
    )
  }
}

function generateAvailableSlots(
  startDate: Date, 
  endDate: Date, 
  existingAppointments: Array<{ appointmentDate: Date; durationMinutes: number }>
) {
  const slots = []
  const workingHours = {
    start: 9, // 9 AM
    end: 17,  // 5 PM
  }
  const slotDuration = 30 // 30 minutes

  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Generate slots for this day
      for (let hour = workingHours.start; hour < workingHours.end; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const slotStart = new Date(currentDate)
          slotStart.setHours(hour, minute, 0, 0)
          
          const slotEnd = new Date(slotStart)
          slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration)
          
          // Skip slots in the past
          if (slotStart < new Date()) {
            continue
          }
          
          // Check if slot conflicts with existing appointments
          const hasConflict = existingAppointments.some(appointment => {
            const appointmentStart = new Date(appointment.appointmentDate)
            const appointmentEnd = new Date(appointmentStart.getTime() + (appointment.durationMinutes * 60000))
            
            return (
              slotStart < appointmentEnd && slotEnd > appointmentStart
            )
          })
          
          if (!hasConflict) {
            slots.push({
              start: slotStart,
              end: slotEnd,
              available: true
            })
          }
        }
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(0, 0, 0, 0)
  }
  
  return slots
}
EOF  
cd /home/project && cd ezfezf && cat > src/app/api/appointments/availability/route.ts << 'EOF'
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

    // Get date range for availability check
    let startDate: Date
    let endDate: Date

    if (date) {
      startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
    } else {
      // Default to next 7 days
      startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date()
      endDate.setDate(endDate.getDate() + 7)
      endDate.setHours(23, 59, 59, 999)
    }

    // Get existing appointments for the doctor
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: {
          gte: startDate,
          lte: endDate
        },
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        }
      },
      select: {
        appointmentDate: true,
        durationMinutes: true,
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    })

    // Generate available time slots
    const availableSlots = generateAvailableSlots(startDate, endDate, existingAppointments)

    return NextResponse.json({
      doctorId,
      dateRange: {
        start: startDate,
        end: endDate
      },
      availableSlots,
      existingAppointments: existingAppointments.length
    })
  } catch (error) {
    console.error('Error fetching doctor availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctor availability' },
      { status: 500 }
    )
  }
}

function generateAvailableSlots(
  startDate: Date, 
  endDate: Date, 
  existingAppointments: Array<{ appointmentDate: Date; durationMinutes: number }>
) {
  const slots = []
  const workingHours = {
    start: 9, // 9 AM
    end: 17,  // 5 PM
  }
  const slotDuration = 30 // 30 minutes

  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Generate slots for this day
      for (let hour = workingHours.start; hour < workingHours.end; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
          const slotStart = new Date(currentDate)
          slotStart.setHours(hour, minute, 0, 0)
          
          const slotEnd = new Date(slotStart)
          slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration)
          
          // Skip slots in the past
          if (slotStart < new Date()) {
            continue
          }
          
          // Check if slot conflicts with existing appointments
          const hasConflict = existingAppointments.some(appointment => {
            const appointmentStart = new Date(appointment.appointmentDate)
            const appointmentEnd = new Date(appointmentStart.getTime() + (appointment.durationMinutes * 60000))
            
            return (
              slotStart < appointmentEnd && slotEnd > appointmentStart
            )
          })
          
          if (!hasConflict) {
            slots.push({
              start: slotStart,
              end: slotEnd,
              available: true
            })
          }
        }
      }
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
    currentDate.setHours(0, 0, 0, 0)
  }
  
  return slots
}
