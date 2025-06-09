import { prisma } from '@/lib/prisma'
import type { Message } from '@prisma/client'

export interface MessageData {
  recipientId: string
  subject?: string
  content: string
  relatedAppointmentId?: string
}

export interface MessageWithDetails extends Message {
  sender: {
    id: string
    fullName: string
    email: string
    image?: string
    role: string
  }
  recipient: {
    id: string
    fullName: string
    email: string
    image?: string
    role: string
  }
}

export interface Conversation {
  partnerId: string
  partner: {
    id: string
    fullName: string
    email: string
    image?: string
    role: string
  }
  lastMessage: MessageWithDetails
  unreadCount: number
  totalMessages: number
}

// Get messages for a user (optionally filtered by conversation partner)
export async function getMessages(
  userId: string,
  conversationWith?: string,
  limit = 50,
  offset = 0
) {
  let whereClause: any = {
    OR: [
      { senderId: userId },
      { recipientId: userId }
    ]
  }

  // Filter by conversation partner if specified
  if (conversationWith) {
    whereClause = {
      OR: [
        {
          senderId: userId,
          recipientId: conversationWith
        },
        {
          senderId: conversationWith,
          recipientId: userId
        }
      ]
    }
  }

  return await prisma.message.findMany({
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
}

// Send a message
export async function sendMessage(senderId: string, data: MessageData) {
  // Verify recipient exists
  const recipient = await prisma.user.findUnique({
    where: { id: data.recipientId }
  })

  if (!recipient) {
    throw new Error('Recipient not found')
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      senderId,
      recipientId: data.recipientId,
      subject: data.subject,
      content: data.content,
      relatedAppointmentId: data.relatedAppointmentId,
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
      userId: data.recipientId,
      title: 'New Message',
      content: `New message from ${message.sender.fullName}: ${data.subject || data.content.substring(0, 50)}`,
      type: 'message',
      referenceId: message.id,
    }
  })

  return message
}

// Get conversations for a user
export async function getConversations(userId: string): Promise<Conversation[]> {
  // Get all messages for the user
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { recipientId: userId }
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
  const conversationsMap = new Map<string, Conversation>()
  
  for (const message of messages) {
    const partnerId = message.senderId === userId 
      ? message.recipientId 
      : message.senderId
    
    const partner = message.senderId === userId 
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
      const conversation = conversationsMap.get(partnerId)!
      conversation.totalMessages++
      
      // Update last message if this one is more recent
      if (message.createdAt > conversation.lastMessage.createdAt) {
        conversation.lastMessage = message
      }
    }

    // Count unread messages (messages sent to current user that are unread)
    if (message.recipientId === userId && !message.isRead) {
      const conversation = conversationsMap.get(partnerId)!
      conversation.unreadCount++
    }
  }

  return Array.from(conversationsMap.values()).sort(
    (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  )
}

// Mark message as read
export async function markMessageAsRead(messageId: string, userId: string) {
  // Check if message exists and belongs to user
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      recipientId: userId
    }
  })

  if (!message) {
    throw new Error('Message not found')
  }

  return await prisma.message.update({
    where: { id: messageId },
    data: {
      isRead: true,
      readAt: new Date(),
    }
  })
}

// Mark all messages in a conversation as read
export async function markConversationAsRead(userId: string, partnerId: string) {
  return await prisma.message.updateMany({
    where: {
      senderId: partnerId,
      recipientId: userId,
      isRead: false
    },
    data: {
      isRead: true,
      readAt: new Date(),
    }
  })
}
EOF  
cd /home/project && cd ezfezf && cat > src/lib/api/messages.ts << 'EOF'
import { prisma } from '@/lib/prisma'
import type { Message } from '@prisma/client'

export interface MessageData {
  recipientId: string
  subject?: string
  content: string
  relatedAppointmentId?: string
}

export interface MessageWithDetails extends Message {
  sender: {
    id: string
    fullName: string
    email: string
    image?: string
    role: string
  }
  recipient: {
    id: string
    fullName: string
    email: string
    image?: string
    role: string
  }
}

export interface Conversation {
  partnerId: string
  partner: {
    id: string
    fullName: string
    email: string
    image?: string
    role: string
  }
  lastMessage: MessageWithDetails
  unreadCount: number
  totalMessages: number
}

// Get messages for a user (optionally filtered by conversation partner)
export async function getMessages(
  userId: string,
  conversationWith?: string,
  limit = 50,
  offset = 0
) {
  let whereClause: any = {
    OR: [
      { senderId: userId },
      { recipientId: userId }
    ]
  }

  // Filter by conversation partner if specified
  if (conversationWith) {
    whereClause = {
      OR: [
        {
          senderId: userId,
          recipientId: conversationWith
        },
        {
          senderId: conversationWith,
          recipientId: userId
        }
      ]
    }
  }

  return await prisma.message.findMany({
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
}

// Send a message
export async function sendMessage(senderId: string, data: MessageData) {
  // Verify recipient exists
  const recipient = await prisma.user.findUnique({
    where: { id: data.recipientId }
  })

  if (!recipient) {
    throw new Error('Recipient not found')
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      senderId,
      recipientId: data.recipientId,
      subject: data.subject,
      content: data.content,
      relatedAppointmentId: data.relatedAppointmentId,
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
      userId: data.recipientId,
      title: 'New Message',
      content: `New message from ${message.sender.fullName}: ${data.subject || data.content.substring(0, 50)}`,
      type: 'message',
      referenceId: message.id,
    }
  })

  return message
}

// Get conversations for a user
export async function getConversations(userId: string): Promise<Conversation[]> {
  // Get all messages for the user
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { recipientId: userId }
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
  const conversationsMap = new Map<string, Conversation>()
  
  for (const message of messages) {
    const partnerId = message.senderId === userId 
      ? message.recipientId 
      : message.senderId
    
    const partner = message.senderId === userId 
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
      const conversation = conversationsMap.get(partnerId)!
      conversation.totalMessages++
      
      // Update last message if this one is more recent
      if (message.createdAt > conversation.lastMessage.createdAt) {
        conversation.lastMessage = message
      }
    }

    // Count unread messages (messages sent to current user that are unread)
    if (message.recipientId === userId && !message.isRead) {
      const conversation = conversationsMap.get(partnerId)!
      conversation.unreadCount++
    }
  }

  return Array.from(conversationsMap.values()).sort(
    (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  )
}

// Mark message as read
export async function markMessageAsRead(messageId: string, userId: string) {
  // Check if message exists and belongs to user
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      recipientId: userId
    }
  })

  if (!message) {
    throw new Error('Message not found')
  }

  return await prisma.message.update({
    where: { id: messageId },
    data: {
      isRead: true,
      readAt: new Date(),
    }
  })
}

// Mark all messages in a conversation as read
export async function markConversationAsRead(userId: string, partnerId: string) {
  return await prisma.message.updateMany({
    where: {
      senderId: partnerId,
      recipientId: userId,
      isRead: false
    },
    data: {
      isRead: true,
      readAt: new Date(),
    }
  })
}
