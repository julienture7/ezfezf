import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserSymptomLogs } from '@/lib/api/symptoms'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get('limit') || '20')

    const logs = await getUserSymptomLogs(session.user.id, limit)

    // Parse triggers JSON for each log
    const parsedLogs = logs.map(log => ({
      ...log,
      triggers: JSON.parse(log.triggers || '[]')
    }))

    return NextResponse.json(parsedLogs)
  } catch (error) {
    console.error('Error fetching symptom logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch symptom logs' },
      { status: 500 }
    )
  }
}
