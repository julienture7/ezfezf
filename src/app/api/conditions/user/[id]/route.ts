import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth' // Assuming authOptions is in /lib/auth
import {
  getUserConditionById,
  updateUserCondition,
  deleteUserCondition
} from '@/lib/api/conditions'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'User condition ID is required' }, { status: 400 })
    }

    const userCondition = await getUserConditionById(id, session.user.id)

    if (!userCondition) {
      return NextResponse.json({ error: 'User condition not found' }, { status: 404 })
    }

    return NextResponse.json(userCondition)
  } catch (error) {
    console.error('Error fetching user condition:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: 'Failed to fetch user condition', details: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'User condition ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { diagnosedDate, severity, notes, isActive } = body

    // Basic validation for presence of at least one field to update
    if (diagnosedDate === undefined && severity === undefined && notes === undefined && isActive === undefined) {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 })
    }

    const updates: Partial<{
      diagnosedDate: Date | null
      severity: string | null
      notes: string | null
      isActive: boolean
    }> = {}

    if (diagnosedDate !== undefined) updates.diagnosedDate = diagnosedDate ? new Date(diagnosedDate) : null
    if (severity !== undefined) updates.severity = severity
    if (notes !== undefined) updates.notes = notes
    if (isActive !== undefined) updates.isActive = isActive

    const updatedUserCondition = await updateUserCondition(id, session.user.id, updates)

    return NextResponse.json(updatedUserCondition)
  } catch (error) {
    console.error('Error updating user condition:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.includes('User condition not found or user not authorized')) {
      return NextResponse.json({ error: 'User condition not found or not authorized to update' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update user condition', details: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'User condition ID is required' }, { status: 400 })
    }

    await deleteUserCondition(id, session.user.id)

    return NextResponse.json(null, { status: 204 }) // No Content
  } catch (error) {
    console.error('Error deleting user condition:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    if (errorMessage.includes('User condition not found or user not authorized')) {
      return NextResponse.json({ error: 'User condition not found or not authorized to delete' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete user condition', details: errorMessage }, { status: 500 })
  }
}
