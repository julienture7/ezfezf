import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'DOCTOR') {
      return NextResponse.json(
        { error: 'Forbidden - Doctor only' },
        { status: 403 }
      )
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            createdAt: true,
          }
        }
      }
    })

    if (!doctorProfile) {
      return NextResponse.json(
        { error: 'Doctor profile not found' },
        { status: 404 }
      )
    }

    // Get doctor statistics
    const stats = await getDoctorStats(session.user.id)

    return NextResponse.json({
      ...doctorProfile,
      stats
    })
  } catch (error) {
    console.error('Error fetching doctor profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch doctor profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'DOCTOR') {
      return NextResponse.json(
        { error: 'Forbidden - Doctor only' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const {
      specialization,
      licenseNumber,
      experience,
      bio,
      clinicAddress,
      consultationFee,
      availability
    } = data

    const updatedProfile = await prisma.doctorProfile.upsert({
      where: { userId: session.user.id },
      update: {
        ...(specialization && { specialization }),
        ...(licenseNumber && { licenseNumber }),
        ...(experience !== undefined && { experience }),
        ...(bio !== undefined && { bio }),
        ...(clinicAddress !== undefined && { clinicAddress }),
        ...(consultationFee !== undefined && { consultationFee }),
        ...(availability && { availability: JSON.stringify(availability) }),
      },
      create: {
        userId: session.user.id,
        specialization: specialization || '',
        licenseNumber: licenseNumber || '',
        verified: false,
        experience: experience || 0,
        bio: bio || '',
        clinicAddress: clinicAddress || '',
        consultationFee: consultationFee || 0,
        availability: availability ? JSON.stringify(availability) : '{}',
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            createdAt: true,
          }
        }
      }
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating doctor profile:', error)
    return NextResponse.json(
      { error: 'Failed to update doctor profile' },
      { status: 500 }
    )
  }
}

async function getDoctorStats(doctorId: string) {
  const [
    totalAppointments,
    upcomingAppointments,
    totalPatients,
    completedAppointments
  ] = await Promise.all([
    prisma.appointment.count({
      where: { doctorId }
    }),
    prisma.appointment.count({
      where: {
        doctorId,
        appointmentDate: { gte: new Date() },
        status: { in: ['SCHEDULED', 'CONFIRMED'] }
      }
    }),
    prisma.appointment.groupBy({
      by: ['patientId'],
      where: { doctorId },
      _count: { patientId: true }
    }).then(result => result.length),
    prisma.appointment.count({
      where: {
        doctorId,
        status: 'COMPLETED'
      }
    })
  ])

  return {
    totalAppointments,
    upcomingAppointments,
    totalPatients,
    completedAppointments
  }
}
