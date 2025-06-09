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

    // Get all conversations for the user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { recipientId: session.user.id }
        ]
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group messages by conversation partner
    const conversationsMap = new Map()
    
    for (const message of messages) {
      const partnerId = message.senderId === session.user.id 
        ? message.recipientId 
        : message.senderId
      
      const partner = message.senderId === session.user.id 
        ? message.recipient 
        : message.sender

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partnerId,
          partner,
          lastMessage: message,
          unreadCount: 0,
          totalMessages: 1
        })
      } else {
        const conversation = conversationsMap.get(partnerId)
        conversation.totalMessages++
        
        // Update last message if this one is more recent
        if (message.createdAt > conversation.lastMessage.createdAt) {
          conversation.lastMessage = message
        }
      }

      // Count unread messages (messages sent to current user that are unread)
      if (message.recipientId === session.user.id && !message.isRead) {
        const conversation = conversationsMap.get(partnerId)
        conversation.unreadCount++
      }
    }

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > src/app/api/messages/conversations/route.ts << 'EOF'
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

    // Get all conversations for the user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { recipientId: session.user.id }
        ]
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Group messages by conversation partner
    const conversationsMap = new Map()
    
    for (const message of messages) {
      const partnerId = message.senderId === session.user.id 
        ? message.recipientId 
        : message.senderId
      
      const partner = message.senderId === session.user.id 
        ? message.recipient 
        : message.sender

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partnerId,
          partner,
          lastMessage: message,
          unreadCount: 0,
          totalMessages: 1
        })
      } else {
        const conversation = conversationsMap.get(partnerId)
        conversation.totalMessages++
        
        // Update last message if this one is more recent
        if (message.createdAt > conversation.lastMessage.createdAt) {
          conversation.lastMessage = message
        }
      }

      // Count unread messages (messages sent to current user that are unread)
      if (message.recipientId === session.user.id && !message.isRead) {
        const conversation = conversationsMap.get(partnerId)
        conversation.unreadCount++
      }
    }

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}
