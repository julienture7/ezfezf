import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  getPostById,
  createComment,
  type CommentData
} from '@/lib/api/forums' // Assuming this path is correct

export async function GET(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }

    const post = await getPostById(postId)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // The getPostById function from forums.ts includes comments,
    // specifically top-level comments with their replies.
    // The subtask asks to "Extract the comments array from the returned post object."
    return NextResponse.json(post.comments || []) // Return empty array if no comments
  } catch (error) {
    console.error(`Error fetching comments for post ${params.postId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    // getPostById might throw "Failed to fetch post" which is caught here.
    // A specific "Post not found" is handled by the null check above.
    return NextResponse.json({ error: 'Failed to fetch comments', details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized to post comment' }, { status: 401 })
    }

    const { postId } = params
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required for commenting' }, { status: 400 })
    }

    const body = await request.json()
    // parentId is optional for top-level comments
    const { content, parentId } = body as Omit<CommentData, 'postId'>

    if (!content) {
      return NextResponse.json({ error: 'Content is required for a comment' }, { status: 400 })
    }
    if (content.length < 1 || content.length > 10000) { // Example validation
        return NextResponse.json({ error: 'Comment content length invalid (1-10000 chars)'}, { status: 400 });
    }
    if (parentId && typeof parentId !== 'string') {
        return NextResponse.json({ error: 'Invalid parentId format' }, { status: 400 });
    }

    const commentData: CommentData = {
      postId,
      content,
      parentId: parentId || undefined // Ensure parentId is undefined if not provided, not null
    }

    // The createComment function in forums.ts should ideally check if the postId is valid
    // and throw an error if the post doesn't exist.
    const newComment = await createComment(session.user.id, commentData)

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error(`Error creating comment for post ${params.postId}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    // Example: if createComment throws a specific error for "Post not found"
    if (errorMessage.toLowerCase().includes('post not found')) { // This depends on error thrown by createComment
      return NextResponse.json({ error: 'Post not found, cannot create comment' }, { status: 404 })
    }
    // Handle other potential errors from createComment, e.g., invalid parentId
    if (errorMessage.toLowerCase().includes('parent comment not found')) { // Hypothetical error
        return NextResponse.json({ error: 'Parent comment not found'}, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to create comment', details: errorMessage }, { status: 500 })
  }
}
