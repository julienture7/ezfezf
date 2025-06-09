import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user settings, create default if doesn't exist
    let settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id }
    })

    if (!settings) {
      // Create default settings
      settings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          // All defaults are handled by the schema
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate the settings data
    const validatedData: any = {}

    // Notification settings
    if (typeof body.emailNotifications === 'boolean') {
      validatedData.emailNotifications = body.emailNotifications
    }
    if (typeof body.pushNotifications === 'boolean') {
      validatedData.pushNotifications = body.pushNotifications
    }
    if (typeof body.appointmentReminders === 'boolean') {
      validatedData.appointmentReminders = body.appointmentReminders
    }
    if (typeof body.messageNotifications === 'boolean') {
      validatedData.messageNotifications = body.messageNotifications
    }
    if (typeof body.communityUpdates === 'boolean') {
      validatedData.communityUpdates = body.communityUpdates
    }

    // Privacy settings
    if (body.profileVisibility && ['public', 'friends', 'private'].includes(body.profileVisibility)) {
      validatedData.profileVisibility = body.profileVisibility
    }
    if (typeof body.showHealthData === 'boolean') {
      validatedData.showHealthData = body.showHealthData
    }
    if (typeof body.allowDirectMessages === 'boolean') {
      validatedData.allowDirectMessages = body.allowDirectMessages
    }

    // Preferences
    if (body.theme && ['light', 'dark', 'system'].includes(body.theme)) {
      validatedData.theme = body.theme
    }
    if (body.language && typeof body.language === 'string') {
      validatedData.language = body.language
    }
    if (body.timezone && typeof body.timezone === 'string') {
      validatedData.timezone = body.timezone
    }

    // Upsert the settings
    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
