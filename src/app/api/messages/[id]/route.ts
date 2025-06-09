import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { markMessageAsRead } from '@/lib/api/messages'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const data = await request.json()
    const { isRead } = data

    if (isRead === true) {
      const updatedMessage = await markMessageAsRead(id, session.user.id)
      return NextResponse.json(updatedMessage)
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating message:', error)
    if (error instanceof Error && error.message === 'Message not found') {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > "src/app/api/messages/[id]/route.ts" << 'EOF'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { markMessageAsRead } from '@/lib/api/messages'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const data = await request.json()
    const { isRead } = data

    if (isRead === true) {
      const updatedMessage = await markMessageAsRead(id, session.user.id)
      return NextResponse.json(updatedMessage)
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating message:', error)
    if (error instanceof Error && error.message === 'Message not found') {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}
