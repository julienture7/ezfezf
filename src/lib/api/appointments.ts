import { prisma } from '@/lib/prisma'
import type { Appointment, AppointmentStatus, AppointmentType } from '@prisma/client'

export interface AppointmentData {
  doctorId: string
  title: string
  description?: string
  appointmentDate: string
  durationMinutes?: number
  location?: string
  type?: AppointmentType
  notes?: string
}

export interface AppointmentUpdateData {
  title?: string
  description?: string
  appointmentDate?: string
  durationMinutes?: number
  status?: AppointmentStatus
  location?: string
  type?: AppointmentType
  notes?: string
}

export interface AppointmentWithDetails extends Appointment {
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

// Get appointments for a user (filtered by role)
export async function getUserAppointments(
  userId: string,
  userRole: string,
  filters?: {
    status?: AppointmentStatus
    doctorId?: string
    startDate?: Date
    endDate?: Date
  }
) {
  const whereClause: any = {}
  
  // Filter based on user role
  if (userRole === 'PATIENT') {
    whereClause.patientId = userId
  } else if (userRole === 'DOCTOR') {
    whereClause.doctorId = userId
  } else if (userRole !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Add additional filters
  if (filters?.status) {
    whereClause.status = filters.status
  }
  if (filters?.doctorId && userRole !== 'DOCTOR') {
    whereClause.doctorId = filters.doctorId
  }
  if (filters?.startDate || filters?.endDate) {
    whereClause.appointmentDate = {}
    if (filters.startDate) {
      whereClause.appointmentDate.gte = filters.startDate
    }
    if (filters.endDate) {
      whereClause.appointmentDate.lte = filters.endDate
    }
  }

  return await prisma.appointment.findMany({
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
}

// Get a specific appointment by ID
export async function getAppointmentById(appointmentId: string, userId: string, userRole: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
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
    });

    if (!appointment) {
      return null; // Or throw new Error('Appointment not found')
    }

    // Verify authorization
    if (userRole === 'ADMIN' || appointment.patientId === userId || appointment.doctorId === userId) {
      return appointment;
    } else {
      return null; // Not authorized or not found for this user
    }
  } catch (error) {
    console.error(`Error fetching appointment ${appointmentId}:`, error);
    throw new Error('Failed to fetch appointment');
  }
}

// Create a new appointment
export async function createAppointment(patientId: string, data: AppointmentData) {
  // Verify doctor exists and is actually a doctor
  const doctor = await prisma.user.findFirst({
    where: {
      id: data.doctorId,
      role: 'DOCTOR'
    }
  })

  if (!doctor) {
    throw new Error('Doctor not found')
  }

  // Check for conflicts
  const appointmentDateTime = new Date(data.appointmentDate)
  const durationMinutes = data.durationMinutes || 30
  const endTime = new Date(appointmentDateTime.getTime() + (durationMinutes * 60000))

  const conflictingAppointment = await prisma.appointment.findFirst({
    where: {
      doctorId: data.doctorId,
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
    throw new Error('Doctor is not available at this time')
  }

  return await prisma.appointment.create({
    data: {
      patientId,
      doctorId: data.doctorId,
      title: data.title,
      description: data.description,
      appointmentDate: appointmentDateTime,
      durationMinutes: durationMinutes,
      location: data.location,
      type: data.type || 'IN_PERSON',
      notes: data.notes,
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
}

// Update an appointment
export async function updateAppointment(
  appointmentId: string,
  userId: string,
  userRole: string,
  data: AppointmentUpdateData
) {
  // Get existing appointment
  const existingAppointment = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  })

  if (!existingAppointment) {
    throw new Error('Appointment not found')
  }

  // Check if user has permission to update
  const canUpdate = 
    userRole === 'ADMIN' ||
    existingAppointment.patientId === userId ||
    existingAppointment.doctorId === userId

  if (!canUpdate) {
    throw new Error('Forbidden')
  }

  // If updating appointment date, check for conflicts
  if (data.appointmentDate && data.appointmentDate !== existingAppointment.appointmentDate.toISOString()) {
    const appointmentDateTime = new Date(data.appointmentDate)
    const duration = data.durationMinutes || existingAppointment.durationMinutes
    const endTime = new Date(appointmentDateTime.getTime() + (duration * 60000))

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        id: { not: appointmentId },
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
      throw new Error('Doctor is not available at this time')
    }
  }

  return await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.appointmentDate && { appointmentDate: new Date(data.appointmentDate) }),
      ...(data.durationMinutes && { durationMinutes: data.durationMinutes }),
      ...(data.status && { status: data.status }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.type && { type: data.type }),
      ...(data.notes !== undefined && { notes: data.notes }),
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
}

// Cancel an appointment
export async function cancelAppointment(
  appointmentId: string,
  userId: string,
  userRole: string
) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId }
  })

  if (!appointment) {
    throw new Error('Appointment not found')
  }

  // Check if user has permission to cancel
  const canCancel = 
    userRole === 'ADMIN' ||
    appointment.patientId === userId ||
    appointment.doctorId === userId

  if (!canCancel) {
    throw new Error('Forbidden')
  }

  return await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      status: 'CANCELLED',
      updatedAt: new Date(),
    }
  })
}

// Get doctor availability
export async function getDoctorAvailability(
  doctorId: string,
  startDate?: Date,
  endDate?: Date
) {
  // Verify doctor exists
  const doctor = await prisma.user.findFirst({
    where: {
      id: doctorId,
      role: 'DOCTOR'
    }
  })

  if (!doctor) {
    throw new Error('Doctor not found')
  }

  // Set default date range if not provided
  if (!startDate) {
    startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
  }
  if (!endDate) {
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

  return {
    doctorId,
    dateRange: {
      start: startDate,
      end: endDate
    },
    existingAppointments,
    availableSlots: generateAvailableSlots(startDate, endDate, existingAppointments)
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
    // Skip weekends
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
