import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  getUserNotifications,
  createNotification,
  NotificationData
} from '@/lib/api/notifications'
import type { NotificationType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const isReadStr = searchParams.get('isRead')
    const type = searchParams.get('type') as NotificationType | null // Cast to NotificationType or null

    const filters: { isRead?: boolean; type?: NotificationType } = {}
    if (isReadStr !== null) { // Check for null, as 'false' is a valid string value
      filters.isRead = isReadStr.toLowerCase() === 'true'
    }
    if (type) {
      // Basic validation for NotificationType enum can be added here if needed
      // e.g. if (!Object.values(NotificationType).includes(type)) { ... return 400 ... }
      filters.type = type
    }

    const notifications = await getUserNotifications(session.user.id, filters)
    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: 'Failed to fetch notifications', details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Per subtask: "Consider admin-only... For now, allow authenticated users"
    // If admin-only, add role check:
    // if (session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const body = await request.json()
    // NotificationData interface in src/lib/api/notifications.ts expects userId.
    // This userId is the recipient of the notification.
    const { userId, title, content, type, referenceId } = body as NotificationData

    if (!userId || !title || !content || !type) {
      return NextResponse.json({ error: 'Missing required fields: userId, title, content, type' }, { status: 400 })
    }
    // Add any other specific validation for type, title length, content length etc.
    // Example: if (!Object.values(NotificationType).includes(type)) { ... return 400 ... }


    const notificationData: NotificationData = {
      userId, // The user for whom this notification is intended
      title,
      content,
      type,
      referenceId: referenceId || undefined
    }

    // createNotification from the lib handles the actual creation.
    const newNotification = await createNotification(notificationData)
    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.toLowerCase().includes('user with id') && errorMessage.toLowerCase().includes('not found')) {
        return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to create notification', details: errorMessage }, { status: 500 })
  }
}
