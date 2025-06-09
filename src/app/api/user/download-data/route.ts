import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all user data
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        userTreatments: {
          include: {
            treatment: true,
            condition: true,
            medicationReminders: true
          }
        },
        userSymptoms: {
          include: {
            symptom: true
          }
        },
        userConditions: {
          include: {
            condition: true
          }
        },
        patientAppointments: true,
        doctorAppointments: true,
        sentMessages: true,
        receivedMessages: true,
        posts: {
          include: {
            comments: true
          }
        },
        comments: true,
        notifications: true,
        medicationReminders: true,
        doctorProfile: true,
        forumMemberships: {
          include: {
            forum: true
          }
        },
        settings: true
      }
    })

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove sensitive data
    const sanitizedData = {
      ...userData,
      password: undefined, // Never include password
      accounts: undefined, // Don't include OAuth account data
      sessions: undefined  // Don't include session data
    }

    // Create JSON response with proper headers for download
    const jsonData = JSON.stringify(sanitizedData, null, 2)

    const response = new NextResponse(jsonData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="user-data-${session.user.id}-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })

    return response
  } catch (error) {
    console.error('Error downloading user data:', error)
    return NextResponse.json({ error: 'Failed to download data' }, { status: 500 })
  }
}
