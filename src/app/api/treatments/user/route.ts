import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserTreatments, addUserTreatment } from '@/lib/api/treatments'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userTreatments = await getUserTreatments(session.user.id)
    return NextResponse.json(userTreatments)
  } catch (error) {
    console.error('Error fetching user treatments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user treatments' },
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
    const { treatmentId, conditionId, startDate, endDate, dosage, frequency, effectivenessRating, sideEffectsExperienced, notes } = body

    if (!treatmentId || !conditionId || !startDate) {
      return NextResponse.json(
        { error: 'Treatment ID, condition ID, and start date are required' },
        { status: 400 }
      )
    }

    const userTreatment = await addUserTreatment(session.user.id, {
      treatmentId,
      conditionId,
      startDate,
      endDate,
      dosage,
      frequency,
      effectivenessRating,
      sideEffectsExperienced,
      notes
    })

    return NextResponse.json(userTreatment, { status: 201 })
  } catch (error) {
    console.error('Error adding user treatment:', error)
    return NextResponse.json(
      { error: 'Failed to add user treatment' },
      { status: 500 }
    )
  }
}
