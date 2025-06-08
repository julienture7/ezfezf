import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getForums, createForum } from '@/lib/api/forums'

export async function GET() {
  try {
    const forums = await getForums()
    return NextResponse.json(forums)
  } catch (error) {
    console.error('Error fetching forums:', error)
    return NextResponse.json(
      { error: 'Failed to fetch forums' },
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

    // Only admins and doctors can create forums
    if (session.user.role !== 'ADMIN' && session.user.role !== 'DOCTOR') {
      return NextResponse.json(
        { error: 'Forbidden - Admin or Doctor only' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, conditionId, rules, isPrivate } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Forum name is required' },
        { status: 400 }
      )
    }

    const forum = await createForum({
      name,
      description,
      conditionId,
      rules,
      isPrivate
    })

    return NextResponse.json(forum, { status: 201 })
  } catch (error) {
    console.error('Error creating forum:', error)
    return NextResponse.json(
      { error: 'Failed to create forum' },
      { status: 500 }
    )
  }
}
