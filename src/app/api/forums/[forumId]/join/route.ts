import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth' // Assuming authOptions is in /lib/auth
import { joinForum } from '@/lib/api/forums' // Assuming this path is correct

export async function POST(request: NextRequest, { params }: { params: { forumId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { forumId } = params
    if (!forumId) {
      return NextResponse.json({ error: 'Forum ID is required to join' }, { status: 400 })
    }

    // The joinForum function in src/lib/api/forums.ts should handle:
    // 1. Checking if the forum exists.
    // 2. Checking if the user is already a member.
    // 3. Creating the membership.
    // It throws specific errors for "Already a member" or general errors.
    const membership = await joinForum(session.user.id, forumId)

    // If joinForum successfully creates a new membership, a 201 is appropriate.
    // If it "succeeds" by confirming an existing membership without erroring, 200 is fine.
    // Given joinForum throws for "Already a member", a successful call means new membership.
    return NextResponse.json(membership, { status: 201 })

  } catch (error) {
    console.error(`Error joining forum ${params.forumId} for user:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'

    if (errorMessage.toLowerCase().includes('already a member')) {
      return NextResponse.json({ error: 'User is already a member of this forum' }, { status: 409 })
    }
    // Assuming joinForum might throw a generic error if the forum itself is not found,
    // or if prisma.$transaction fails within joinForum.
    // A more specific "Forum not found" error from joinForum would be ideal for a 404.
    // For now, other errors from joinForum will result in a 500.
    // If joinForum could throw "Forum not found", we could add:
    // if (errorMessage.toLowerCase().includes('forum not found')) {
    //   return NextResponse.json({ error: 'Forum not found' }, { status: 404 });
    // }
    return NextResponse.json({ error: 'Failed to join forum', details: errorMessage }, { status: 500 })
  }
}
