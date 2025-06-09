import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const doctorId = searchParams.get('doctorId')

    const whereClause: any = {}
    
    // Filter based on user role
    if (session.user.role === 'PATIENT') {
      whereClause.patientId = session.user.id
    } else if (session.user.role === 'DOCTOR') {
      whereClause.doctorId = session.user.id
    } else if (session.user.role === 'ADMIN') {
      // Admin can see all appointments
    } else {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Add additional filters
    if (status) {
      whereClause.status = status
    }
    if (doctorId && session.user.role !== 'DOCTOR') {
      whereClause.doctorId = doctorId
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            doctorProfile: {
              select: {
                specialization: true,
                clinicAddress: true,
              }
            }
          }
        }
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      doctorId,
      title,
      description,
      appointmentDate,
      durationMinutes = 30,
      location,
      type = 'IN_PERSON',
      notes
    } = data

    // Validate required fields
    if (!doctorId || !title || !appointmentDate) {
      return NextResponse.json(
        { error: 'Missing required fields: doctorId, title, appointmentDate' },
        { status: 400 }
      )
    }

    // Verify doctor exists and is actually a doctor
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

    // Check for conflicts (same doctor, overlapping time)
    const appointmentDateTime = new Date(appointmentDate)
    const endTime = new Date(appointmentDateTime.getTime() + (durationMinutes * 60000))

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        },
        AND: [
          {
            appointmentDate: {
              lt: endTime
            }
          },
          {
            appointmentDate: {
              gte: new Date(appointmentDateTime.getTime() - (30 * 60000)) // 30 min buffer
            }
          }
        ]
      }
    })

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'Doctor is not available at this time' },
        { status: 409 }
      )
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId,
        title,
        description,
        appointmentDate: appointmentDateTime,
        durationMinutes,
        location,
        type,
        notes,
        status: 'SCHEDULED'
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            doctorProfile: {
              select: {
                specialization: true,
                clinicAddress: true,
              }
            }
          }
        }
      }
    })

    // Create notification for doctor
    await prisma.notification.create({
      data: {
        userId: doctorId,
        title: 'New Appointment Request',
        content: `New appointment request from ${session.user.fullName} for ${title}`,
        type: 'appointment',
        referenceId: appointment.id,
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > src/app/api/appointments/route.ts << 'EOF'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const doctorId = searchParams.get('doctorId')

    const whereClause: any = {}
    
    // Filter based on user role
    if (session.user.role === 'PATIENT') {
      whereClause.patientId = session.user.id
    } else if (session.user.role === 'DOCTOR') {
      whereClause.doctorId = session.user.id
    } else if (session.user.role === 'ADMIN') {
      // Admin can see all appointments
    } else {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Add additional filters
    if (status) {
      whereClause.status = status
    }
    if (doctorId && session.user.role !== 'DOCTOR') {
      whereClause.doctorId = doctorId
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            doctorProfile: {
              select: {
                specialization: true,
                clinicAddress: true,
              }
            }
          }
        }
      },
      orderBy: {
        appointmentDate: 'asc'
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const {
      doctorId,
      title,
      description,
      appointmentDate,
      durationMinutes = 30,
      location,
      type = 'IN_PERSON',
      notes
    } = data

    // Validate required fields
    if (!doctorId || !title || !appointmentDate) {
      return NextResponse.json(
        { error: 'Missing required fields: doctorId, title, appointmentDate' },
        { status: 400 }
      )
    }

    // Verify doctor exists and is actually a doctor
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

    // Check for conflicts (same doctor, overlapping time)
    const appointmentDateTime = new Date(appointmentDate)
    const endTime = new Date(appointmentDateTime.getTime() + (durationMinutes * 60000))

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        },
        AND: [
          {
            appointmentDate: {
              lt: endTime
            }
          },
          {
            appointmentDate: {
              gte: new Date(appointmentDateTime.getTime() - (30 * 60000)) // 30 min buffer
            }
          }
        ]
      }
    })

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'Doctor is not available at this time' },
        { status: 409 }
      )
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        doctorId,
        title,
        description,
        appointmentDate: appointmentDateTime,
        durationMinutes,
        location,
        type,
        notes,
        status: 'SCHEDULED'
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            doctorProfile: {
              select: {
                specialization: true,
                clinicAddress: true,
              }
            }
          }
        }
      }
    })

    // Create notification for doctor
    await prisma.notification.create({
      data: {
        userId: doctorId,
        title: 'New Appointment Request',
        content: `New appointment request from ${session.user.fullName} for ${title}`,
        type: 'appointment',
        referenceId: appointment.id,
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
