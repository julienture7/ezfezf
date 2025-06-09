import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSymptomStats } from '@/lib/api/symptoms'

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
    const days = Number.parseInt(searchParams.get('days') || '30')

    const stats = await getSymptomStats(session.user.id, days)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching symptom stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch symptom statistics' },
      { status: 500 }
    )
  }
}
