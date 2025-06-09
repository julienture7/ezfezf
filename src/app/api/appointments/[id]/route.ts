import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
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

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this appointment
    const hasAccess = 
      session.user.role === 'ADMIN' ||
      appointment.patientId === session.user.id ||
      appointment.doctorId === session.user.id

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const data = await request.json()

    // Get existing appointment
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to update
    const canUpdate = 
      session.user.role === 'ADMIN' ||
      existingAppointment.patientId === session.user.id ||
      existingAppointment.doctorId === session.user.id

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const {
      title,
      description,
      appointmentDate,
      durationMinutes,
      status,
      location,
      type,
      notes
    } = data

    // If updating appointment date, check for conflicts
    if (appointmentDate && appointmentDate !== existingAppointment.appointmentDate) {
      const appointmentDateTime = new Date(appointmentDate)
      const duration = durationMinutes || existingAppointment.durationMinutes
      const endTime = new Date(appointmentDateTime.getTime() + (duration * 60000))

      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          doctorId: existingAppointment.doctorId,
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
                gte: new Date(appointmentDateTime.getTime() - (30 * 60000))
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
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }),
        ...(durationMinutes && { durationMinutes }),
        ...(status && { status }),
        ...(location !== undefined && { location }),
        ...(type && { type }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date(),
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

    // Create notification for status changes
    if (status && status !== existingAppointment.status) {
      const notificationUserId = session.user.id === existingAppointment.patientId 
        ? existingAppointment.doctorId 
        : existingAppointment.patientId

      if (notificationUserId) {
        await prisma.notification.create({
          data: {
            userId: notificationUserId,
            title: 'Appointment Updated',
            content: `Appointment "${title || existingAppointment.title}" status changed to ${status}`,
            type: 'appointment',
            referenceId: id,
          }
        })
      }
    }

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to delete
    const canDelete = 
      session.user.role === 'ADMIN' ||
      appointment.patientId === session.user.id ||
      appointment.doctorId === session.user.id

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Update status to cancelled instead of deleting
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      }
    })

    // Create notification
    const notificationUserId = session.user.id === appointment.patientId 
      ? appointment.doctorId 
      : appointment.patientId

    if (notificationUserId) {
      await prisma.notification.create({
        data: {
          userId: notificationUserId,
          title: 'Appointment Cancelled',
          content: `Appointment "${appointment.title}" has been cancelled`,
          type: 'appointment',
          referenceId: id,
        }
      })
    }

    return NextResponse.json({ message: 'Appointment cancelled successfully' })
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > "src/app/api/appointments/[id]/route.ts" << 'EOF'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    const appointment = await prisma.appointment.findUnique({
      where: { id },
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

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this appointment
    const hasAccess = 
      session.user.role === 'ADMIN' ||
      appointment.patientId === session.user.id ||
      appointment.doctorId === session.user.id

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const data = await request.json()

    // Get existing appointment
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to update
    const canUpdate = 
      session.user.role === 'ADMIN' ||
      existingAppointment.patientId === session.user.id ||
      existingAppointment.doctorId === session.user.id

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const {
      title,
      description,
      appointmentDate,
      durationMinutes,
      status,
      location,
      type,
      notes
    } = data

    // If updating appointment date, check for conflicts
    if (appointmentDate && appointmentDate !== existingAppointment.appointmentDate) {
      const appointmentDateTime = new Date(appointmentDate)
      const duration = durationMinutes || existingAppointment.durationMinutes
      const endTime = new Date(appointmentDateTime.getTime() + (duration * 60000))

      const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          doctorId: existingAppointment.doctorId,
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
                gte: new Date(appointmentDateTime.getTime() - (30 * 60000))
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
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(appointmentDate && { appointmentDate: new Date(appointmentDate) }),
        ...(durationMinutes && { durationMinutes }),
        ...(status && { status }),
        ...(location !== undefined && { location }),
        ...(type && { type }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date(),
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

    // Create notification for status changes
    if (status && status !== existingAppointment.status) {
      const notificationUserId = session.user.id === existingAppointment.patientId 
        ? existingAppointment.doctorId 
        : existingAppointment.patientId

      if (notificationUserId) {
        await prisma.notification.create({
          data: {
            userId: notificationUserId,
            title: 'Appointment Updated',
            content: `Appointment "${title || existingAppointment.title}" status changed to ${status}`,
            type: 'appointment',
            referenceId: id,
          }
        })
      }
    }

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to delete
    const canDelete = 
      session.user.role === 'ADMIN' ||
      appointment.patientId === session.user.id ||
      appointment.doctorId === session.user.id

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Update status to cancelled instead of deleting
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      }
    })

    // Create notification
    const notificationUserId = session.user.id === appointment.patientId 
      ? appointment.doctorId 
      : appointment.patientId

    if (notificationUserId) {
      await prisma.notification.create({
        data: {
          userId: notificationUserId,
          title: 'Appointment Cancelled',
          content: `Appointment "${appointment.title}" has been cancelled`,
          type: 'appointment',
          referenceId: id,
        }
      })
    }

    return NextResponse.json({ message: 'Appointment cancelled successfully' })
  } catch (error) {
    console.error('Error cancelling appointment:', error)
    return NextResponse.json(
      { error: 'Failed to cancel appointment' },
      { status: 500 }
    )
  }
}
