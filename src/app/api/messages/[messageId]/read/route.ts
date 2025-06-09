import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { markMessageAsRead } from '@/lib/api/messages'

export async function PUT(request: NextRequest, { params }: { params: { messageId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messageId } = params
    if (!messageId) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 })
    }

    // markMessageAsRead should throw an error if the message isn't found
    // or if the message doesn't belong to the user (recipientId check).
    const updatedMessage = await markMessageAsRead(messageId, session.user.id)

    return NextResponse.json(updatedMessage) // Returns the updated message
  } catch (error) {
    console.error(`Error marking message ${params.messageId} as read:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    if (errorMessage.toLowerCase().includes('message not found')) {
      // This also covers cases where the message exists but doesn't belong to the user,
      // as markMessageAsRead checks recipientId.
      return NextResponse.json({ error: 'Message not found or access denied' }, { status: 404 })
    }
    // A more specific 403 could be returned if the error clearly indicates an auth issue
    // beyond just not being the recipient (e.g. if markMessageAsRead had separate checks).
    // However, "Message not found" from the lib function covers the current logic.
    return NextResponse.json({ error: 'Failed to mark message as read', details: errorMessage }, { status: 500 })
  }
}
