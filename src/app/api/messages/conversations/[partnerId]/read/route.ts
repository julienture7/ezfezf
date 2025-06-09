import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { markConversationAsRead } from '@/lib/api/messages'

export async function PUT(request: NextRequest, { params }: { params: { partnerId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { partnerId } = params
    if (!partnerId) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 })
    }

    // markConversationAsRead updates messages where sender is partnerId and recipient is session.user.id.
    // It returns a count of updated messages.
    const updateResult = await markConversationAsRead(session.user.id, partnerId)

    // if (updateResult.count === 0) {
      // This could mean no unread messages, or partnerId doesn't exist/no conversation.
      // The problem statement asks for 200 or 204 on success.
      // Returning 200 with the count, or 204 if we don't need to return the count.
      // For simplicity and consistency with "success", 200 with count or just 204 is fine.
      // The subtask mentions "Return success (200 or 204)". Let's go with 204.
    // }

    return new NextResponse(null, { status: 204 }) // Success, no content to return

  } catch (error) {
    console.error(`Error marking conversation with ${params.partnerId} as read:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    // markConversationAsRead in the lib doesn't explicitly throw for "partner not found".
    // It would just update 0 records. So, specific 404 for partner is not directly handled here
    // unless the lib function is changed.
    // A 403 might be relevant if there was a check that the user is part of the conversation,
    // but the current lib function just updates based on userId and partnerId.
    return NextResponse.json({ error: 'Failed to mark conversation as read', details: errorMessage }, { status: 500 })
  }
}
