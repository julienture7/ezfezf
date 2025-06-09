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
    const isRead = searchParams.get('isRead')
    const type = searchParams.get('type')
    const limit = Number.parseInt(searchParams.get('limit') || '50')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    const whereClause: any = {
      userId: session.user.id
    }

    if (isRead !== null) {
      whereClause.isRead = isRead === 'true'
    }

    if (type) {
      whereClause.type = type
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.notification.count({
      where: whereClause
    })

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false
      }
    })

    return NextResponse.json({
      notifications,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
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

    // Only allow admins to create notifications for other users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { userId, title, content, type, referenceId } = data

    // Validate required fields
    if (!userId || !title || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, title, content, type' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        content,
        type,
        referenceId,
        isRead: false,
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > src/app/api/notifications/route.ts << 'EOF'
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
    const isRead = searchParams.get('isRead')
    const type = searchParams.get('type')
    const limit = Number.parseInt(searchParams.get('limit') || '50')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    const whereClause: any = {
      userId: session.user.id
    }

    if (isRead !== null) {
      whereClause.isRead = isRead === 'true'
    }

    if (type) {
      whereClause.type = type
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.notification.count({
      where: whereClause
    })

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false
      }
    })

    return NextResponse.json({
      notifications,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
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

    // Only allow admins to create notifications for other users
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { userId, title, content, type, referenceId } = data

    // Validate required fields
    if (!userId || !title || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, title, content, type' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        content,
        type,
        referenceId,
        isRead: false,
      }
    })

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
