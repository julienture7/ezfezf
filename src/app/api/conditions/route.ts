import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getConditions, createCondition, getConditionsByCategory } from '@/lib/api/conditions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let conditions
    if (category) {
      conditions = await getConditionsByCategory(category)
    } else {
      conditions = await getConditions()
    }

    return NextResponse.json(conditions)
  } catch (error) {
    console.error('Error fetching conditions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conditions' },
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

    // Only admins can create new conditions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, category, symptoms } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Condition name and category are required' },
        { status: 400 }
      )
    }

    const condition = await createCondition({
      name,
      description,
      category,
      symptoms
    })

    return NextResponse.json(condition, { status: 201 })
  } catch (error) {
    console.error('Error creating condition:', error)
    return NextResponse.json(
      { error: 'Failed to create condition' },
      { status: 500 }
    )
  }
}
