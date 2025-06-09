import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { markAllNotificationsAsRead } from '@/lib/api/notifications'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await markAllNotificationsAsRead(session.user.id)

    // result from prisma.updateMany includes a 'count' of updated records.
    // We can return this count in the response if desired, or just 204.
    // Subtask asks for "success (204) or error".
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: 'Failed to mark all notifications as read', details: errorMessage }, { status: 500 })
  }
}
