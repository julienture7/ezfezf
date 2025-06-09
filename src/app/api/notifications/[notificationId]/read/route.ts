import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { markNotificationAsRead } from '@/lib/api/notifications'

export async function PUT(request: NextRequest, { params }: { params: { notificationId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId } = params
    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 })
    }

    // markNotificationAsRead in the lib ensures the notification belongs to the userId
    const updatedNotification = await markNotificationAsRead(notificationId, session.user.id)

    if (!updatedNotification) {
      // This case should ideally be covered by markNotificationAsRead throwing an error
      // if it's designed to do so for "not found or not authorized".
      // If it returns null in such cases, this check is needed.
      // Based on my lib implementation, it throws "Notification not found or user not authorized".
      return NextResponse.json({ error: 'Notification not found or access denied' }, { status: 404 })
    }

    return NextResponse.json(updatedNotification)
  } catch (error) {
    console.error(`Error marking notification ${params.notificationId} as read:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    if (errorMessage.toLowerCase().includes('notification not found or user not authorized')) {
      return NextResponse.json({ error: 'Notification not found or access denied' }, { status: 404 })
    }
    // Consider if a 403 is more appropriate if the error clearly distinguishes
    // "not found" from "found but not authorized". The current lib throws one combined error.
    return NextResponse.json({ error: 'Failed to mark notification as read', details: errorMessage }, { status: 500 })
  }
}
