import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserConditions, addUserCondition } from '@/lib/api/conditions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userConditions = await getUserConditions(session.user.id)
    return NextResponse.json(userConditions)
  } catch (error) {
    console.error('Error fetching user conditions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user conditions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { conditionId, diagnosedDate, severity, notes, isActive } = body

    if (!conditionId) {
      return NextResponse.json(
        { error: 'Condition ID is required' },
        { status: 400 }
      )
    }

    const userCondition = await addUserCondition(session.user.id, {
      conditionId,
      diagnosedDate,
      severity,
      notes,
      isActive
    })

    return NextResponse.json(userCondition, { status: 201 })
  } catch (error) {
    console.error('Error adding user condition:', error)
    return NextResponse.json(
      { error: 'Failed to add user condition' },
      { status: 500 }
    )
  }
}
