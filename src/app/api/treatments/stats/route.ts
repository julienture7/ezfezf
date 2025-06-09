import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getTreatmentStats } from '@/lib/api/treatments'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stats = await getTreatmentStats(session.user.id)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching treatment stats:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: 'Failed to fetch treatment statistics', details: errorMessage }, { status: 500 })
  }
}
