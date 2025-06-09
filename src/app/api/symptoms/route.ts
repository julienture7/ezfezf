import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSymptoms, createSymptom } from '@/lib/api/symptoms'

export async function GET() {
  try {
    const symptoms = await getSymptoms()
    return NextResponse.json(symptoms)
  } catch (error) {
    console.error('Error fetching symptoms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch symptoms' },
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

    // Only admins can create new symptoms
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, severityScale, measurementUnit } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Symptom name is required' },
        { status: 400 }
      )
    }

    const symptom = await createSymptom({
      name,
      description,
      severityScale,
      measurementUnit
    })

    return NextResponse.json(symptom, { status: 201 })
  } catch (error) {
    console.error('Error creating symptom:', error)
    return NextResponse.json(
      { error: 'Failed to create symptom' },
      { status: 500 }
    )
  }
}
