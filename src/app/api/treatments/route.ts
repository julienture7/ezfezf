import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTreatments, createTreatment } from '@/lib/api/treatments'

export async function GET() {
  try {
    const treatments = await getTreatments()
    return NextResponse.json(treatments)
  } catch (error) {
    console.error('Error fetching treatments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch treatments' },
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

    // Only admins can create new treatments
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, type, description, sideEffects, contraindications } = body

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Treatment name and type are required' },
        { status: 400 }
      )
    }

    const treatment = await createTreatment({
      name,
      type,
      description,
      sideEffects,
      contraindications
    })

    return NextResponse.json(treatment, { status: 201 })
  } catch (error) {
    console.error('Error creating treatment:', error)
    return NextResponse.json(
      { error: 'Failed to create treatment' },
      { status: 500 }
    )
  }
}
