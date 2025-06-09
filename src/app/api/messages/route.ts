import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  getConversations,
  sendMessage,
  type MessageData,
  getMessages
} from '@/lib/api/messages'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = request.nextUrl
    const conversationWith = searchParams.get('conversationWith')
    const limitStr = searchParams.get('limit')
    const offsetStr = searchParams.get('offset')

    if (conversationWith) {
      const limit = limitStr ? Number.parseInt(limitStr, 10) : 50 // Default limit 50
      const offset = offsetStr ? Number.parseInt(offsetStr, 10) : 0 // Default offset 0

      if (isNaN(limit) || limit < 1 || limit > 200) {
        return NextResponse.json({ error: 'Invalid limit value (1-200)' }, { status: 400 })
      }
      if (isNaN(offset) || offset < 0) {
        return NextResponse.json({ error: 'Invalid offset value' }, { status: 400 })
      }
      const messages = await getMessages(session.user.id, conversationWith, limit, offset)
      return NextResponse.json(messages)
    } else {
      const conversations = await getConversations(session.user.id)
      return NextResponse.json(conversations)
    }
  } catch (error) {
    console.error('Error fetching messages or conversations:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: 'Failed to fetch data', details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { recipientId, subject, content, relatedAppointmentId } = body as MessageData

    if (!recipientId || !content) {
      return NextResponse.json({ error: 'Recipient ID and content are required' }, { status: 400 })
    }
    if (content.length < 1) {
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 })
    }
    if (subject && subject.length > 255) {
      return NextResponse.json({ error: 'Subject too long (max 255 chars)' }, { status: 400 })
    }
    if (recipientId === session.user.id) {
      return NextResponse.json({ error: 'Cannot send a message to yourself' }, { status: 400})
    }


    const messageData: MessageData = {
      recipientId,
      subject: subject || undefined,
      content,
      relatedAppointmentId: relatedAppointmentId || undefined
    }

    const newMessage = await sendMessage(session.user.id, messageData)
    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.toLowerCase().includes('recipient not found')) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to send message', details: errorMessage }, { status: 500 })
  }
}
