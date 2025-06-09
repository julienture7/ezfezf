import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversationWith = searchParams.get('conversationWith')
    const limit = Number.parseInt(searchParams.get('limit') || '50')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    let whereClause: any = {
      OR: [
        { senderId: session.user.id },
        { recipientId: session.user.id }
      ]
    }

    // Filter by conversation partner if specified
    if (conversationWith) {
      whereClause = {
        OR: [
          {
            senderId: session.user.id,
            recipientId: conversationWith
          },
          {
            senderId: conversationWith,
            recipientId: session.user.id
          }
        ]
      }
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            role: true,
          }
        },
        recipient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { recipientId, subject, content, relatedAppointmentId } = data

    // Validate required fields
    if (!recipientId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: recipientId, content' },
        { status: 400 }
      )
    }

    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
        subject,
        content,
        relatedAppointmentId,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            role: true,
          }
        },
        recipient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            role: true,
          }
        }
      }
    })

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        title: 'New Message',
        content: `New message from ${session.user.fullName}: ${subject || content.substring(0, 50)}`,
        type: 'message',
        referenceId: message.id,
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > src/app/api/messages/route.ts << 'EOF'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversationWith = searchParams.get('conversationWith')
    const limit = Number.parseInt(searchParams.get('limit') || '50')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    let whereClause: any = {
      OR: [
        { senderId: session.user.id },
        { recipientId: session.user.id }
      ]
    }

    // Filter by conversation partner if specified
    if (conversationWith) {
      whereClause = {
        OR: [
          {
            senderId: session.user.id,
            recipientId: conversationWith
          },
          {
            senderId: conversationWith,
            recipientId: session.user.id
          }
        ]
      }
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            role: true,
          }
        },
        recipient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { recipientId, subject, content, relatedAppointmentId } = data

    // Validate required fields
    if (!recipientId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: recipientId, content' },
        { status: 400 }
      )
    }

    // Verify recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
        subject,
        content,
        relatedAppointmentId,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            role: true,
          }
        },
        recipient: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            role: true,
          }
        }
      }
    })

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        title: 'New Message',
        content: `New message from ${session.user.fullName}: ${subject || content.substring(0, 50)}`,
        type: 'message',
        referenceId: message.id,
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
