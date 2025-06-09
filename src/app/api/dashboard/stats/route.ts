import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSymptomStats } from '@/lib/api/symptoms'
import { getTreatmentStats } from '@/lib/api/treatments'
import { getConditionStats } from '@/lib/api/conditions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get today's symptoms count
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const symptomsToday = await prisma.userSymptom.count({
      where: {
        userId: userId,
        loggedAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Get active treatments count
    const activeTreatments = await prisma.userTreatment.count({
      where: {
        userId: userId,
        endDate: null
      }
    })

    // Get this week's appointments count
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 7)

    const appointmentsThisWeek = await prisma.appointment.count({
      where: {
        patientId: userId,
        appointmentDate: {
          gte: startOfWeek,
          lt: endOfWeek
        }
      }
    })

    // Get treatment effectiveness average
    const treatmentStats = await getTreatmentStats(userId)

    // Get recent symptoms (last 5)
    const recentSymptoms = await prisma.userSymptom.findMany({
      where: {
        userId: userId
      },
      include: {
        symptom: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        loggedAt: 'desc'
      },
      take: 5
    })

    // Get upcoming appointments (next 3)
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        patientId: userId,
        appointmentDate: {
          gte: new Date()
        }
      },
      include: {
        doctor: {
          select: {
            name: true,
            doctorProfile: {
              select: {
                specialty: true
              }
            }
          }
        }
      },
      orderBy: {
        appointmentDate: 'asc'
      },
      take: 3
    })

    // Get active user treatments with details
    const currentTreatments = await prisma.userTreatment.findMany({
      where: {
        userId: userId,
        endDate: null
      },
      include: {
        treatment: {
          select: {
            name: true,
            type: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      },
      take: 5
    })

    // Get condition stats
    const conditionStats = await getConditionStats(userId)

    const dashboardStats = {
      healthMetrics: {
        symptomsToday,
        activeTreatments,
        appointmentsThisWeek,
        treatmentEffectiveness: Math.round(treatmentStats.averageEffectiveness)
      },
      recentSymptoms: recentSymptoms.map(symptom => ({
        id: symptom.id,
        name: symptom.symptom?.name || 'Unknown',
        severity: symptom.severity,
        time: getRelativeTime(symptom.loggedAt)
      })),
      upcomingAppointments: upcomingAppointments.map(appointment => ({
        id: appointment.id,
        title: `${appointment.doctor?.name || 'Doctor'} - ${appointment.doctor?.doctorProfile?.specialty || 'General'}`,
        date: formatDate(appointment.appointmentDate),
        time: formatTime(appointment.appointmentDate),
        type: appointment.type.toLowerCase()
      })),
      currentTreatments: currentTreatments.map(userTreatment => ({
        id: userTreatment.id,
        name: userTreatment.treatment?.name || 'Unknown',
        type: userTreatment.treatment?.type || 'UNKNOWN',
        effectiveness: userTreatment.effectivenessRating || 0,
        dosage: userTreatment.dosage,
        frequency: userTreatment.frequency
      })),
      stats: {
        symptomStats: await getSymptomStats(userId),
        treatmentStats,
        conditionStats
      }
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return date.toLocaleDateString()
}

function formatDate(date: Date): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Today'
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
