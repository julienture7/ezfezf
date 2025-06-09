import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  getForumPosts,
  createPost,
  type PostData
} from '@/lib/api/forums' // Assuming this path is correct

export async function GET(request: NextRequest, { params }: { params: { forumId: string } }) {
  try {
    const { forumId } = params
    if (!forumId) {
      return NextResponse.json({ error: 'Forum ID is required' }, { status: 400 })
    }

    const { searchParams } = request.nextUrl
    const pageStr = searchParams.get('page')
    const limitStr = searchParams.get('limit')

    const page = pageStr ? Number.parseInt(pageStr, 10) : 1
    const limit = limitStr ? Number.parseInt(limitStr, 10) : 10

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: 'Invalid page number' }, { status: 400 })
    }
    if (isNaN(limit) || limit < 1 || limit > 100) { // Max limit 100
      return NextResponse.json({ error: 'Invalid limit value' }, { status: 400 })
    }

    // Note: getForumPosts in the provided lib/api/forums.ts doesn't explicitly check
    // if the forumId itself is valid before querying posts. It might return empty results.
    // For a true 404 if forum not found, getForumById would need to be called first,
    // or getForumPosts modified. Assuming current behavior of getForumPosts is acceptable.
    const result = await getForumPosts(forumId, page, limit)

    // If the forum doesn't exist, getForumPosts might return an empty array for posts
    // and totalPosts = 0. A true 404 for the forum itself is not explicitly handled here
    // unless getForumPosts throws a specific error for it.
    // The current implementation of getForumPosts doesn't seem to throw a "not found" for the forum.
    // It would simply return no posts.
    // if (!result || result.totalPosts === 0 && page === 1) { // A more robust check might be needed
    //   // This check is tricky; an existing forum might have no posts.
    //   // A dedicated check for forum existence might be better if strict 404 for forum is needed.
    // }

    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error fetching posts for forum ${params.forumId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    // Consider if getForumPosts can throw a specific "Forum not found" error
    // For now, relying on its generic error for 500.
    return NextResponse.json({ error: 'Failed to fetch forum posts', details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { forumId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { forumId } = params
    if (!forumId) {
      return NextResponse.json({ error: 'Forum ID is required for posting' }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, tags } = body as Omit<PostData, 'forumId'>

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required for a post' }, { status: 400 })
    }

    if (title.length > 255) { // Example validation
        return NextResponse.json({ error: 'Title too long (max 255 chars)'}, { status: 400 });
    }
    if (content.length < 10) { // Example validation
        return NextResponse.json({ error: 'Content too short (min 10 chars)'}, { status: 400 });
    }
    if (tags && !Array.isArray(tags)) {
        return NextResponse.json({ error: 'Tags must be an array of strings' }, { status: 400 });
    }


    const postData: PostData = {
      forumId,
      title,
      content,
      tags: tags || []
    }

    // The createPost function in forums.ts should ideally check if the forumId is valid
    // and throw an error if the forum doesn't exist, which could then be caught here.
    const newPost = await createPost(session.user.id, postData)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error(`Error creating post in forum ${params.forumId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    // Example: if createPost throws a specific error for "Forum not found"
    if (errorMessage.toLowerCase().includes('forum not found')) { // This depends on error thrown by createPost
      return NextResponse.json({ error: 'Forum not found, cannot create post' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to create post', details: errorMessage }, { status: 500 })
  }
}
