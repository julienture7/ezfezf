import { NextRequest, NextResponse } from 'next/server'
import { getForumById } from '@/lib/api/forums' // Assuming this path is correct

export async function GET(request: NextRequest, { params }: { params: { forumId: string } }) {
  try {
    const { forumId } = params
    if (!forumId) {
      return NextResponse.json({ error: 'Forum ID is required' }, { status: 400 })
    }

    const forum = await getForumById(forumId)

    if (!forum) {
      return NextResponse.json({ error: 'Forum not found' }, { status: 404 })
    }

    return NextResponse.json(forum)
  } catch (error) {
    console.error(`Error fetching forum ${params.forumId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    // getForumById might throw "Failed to fetch forum" which is generic.
    // The specific "Forum not found" is handled by the null check above.
    return NextResponse.json({ error: 'Failed to fetch forum details', details: errorMessage }, { status: 500 })
  }
}
