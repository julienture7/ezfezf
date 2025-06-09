import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logSymptom } from '@/lib/api/symptoms'

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
    const { symptomId, severity, notes, triggers, durationMinutes, loggedAt } = body

    if (!symptomId || !severity) {
      return NextResponse.json(
        { error: 'Symptom ID and severity are required' },
        { status: 400 }
      )
    }

    if (severity < 1 || severity > 10) {
      return NextResponse.json(
        { error: 'Severity must be between 1 and 10' },
        { status: 400 }
      )
    }

    const symptomLog = await logSymptom(session.user.id, {
      symptomId,
      severity,
      notes,
      triggers,
      durationMinutes,
      loggedAt: loggedAt || new Date().toISOString()
    })

    return NextResponse.json(symptomLog, { status: 201 })
  } catch (error) {
    console.error('Error logging symptom:', error)
    return NextResponse.json(
      { error: 'Failed to log symptom' },
      { status: 500 }
    )
  }
}
