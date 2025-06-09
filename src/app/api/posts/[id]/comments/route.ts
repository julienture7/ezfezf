import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: postId } = params
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get('limit') || '50')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get comments for the post
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          }
        },
        _count: {
          select: {
            likes: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.comment.count({
      where: { postId }
    })

    return NextResponse.json({
      comments,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: postId } = params
    const data = await request.json()
    const { content, parentCommentId } = data

    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { error: 'Missing required field: content' },
        { status: 400 }
      )
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        forum: {
          include: {
            memberships: {
              where: { userId: session.user.id }
            }
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if forum is private and user is member
    if (post.forum.isPrivate && post.forum.memberships.length === 0) {
      return NextResponse.json(
        { error: 'Access denied - Forum membership required' },
        { status: 403 }
      )
    }

    // If replying to a comment, verify it exists
    if (parentCommentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentCommentId }
      })

      if (!parentComment || parentComment.postId !== postId) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
        parentCommentId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          }
        },
        _count: {
          select: {
            likes: true,
          }
        }
      }
    })

    // Create notification for post author if not self
    if (post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          title: 'New Comment',
          content: `${session.user.fullName} commented on your post: ${post.title}`,
          type: 'forum',
          referenceId: postId,
        }
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
EOF  
cd /home/project && cd ezfezf && cat > "src/app/api/posts/[id]/comments/route.ts" << 'EOF'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: postId } = params
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get('limit') || '50')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Get comments for the post
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          }
        },
        _count: {
          select: {
            likes: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.comment.count({
      where: { postId }
    })

    return NextResponse.json({
      comments,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: postId } = params
    const data = await request.json()
    const { content, parentCommentId } = data

    // Validate required fields
    if (!content) {
      return NextResponse.json(
        { error: 'Missing required field: content' },
        { status: 400 }
      )
    }

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        forum: {
          include: {
            memberships: {
              where: { userId: session.user.id }
            }
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if forum is private and user is member
    if (post.forum.isPrivate && post.forum.memberships.length === 0) {
      return NextResponse.json(
        { error: 'Access denied - Forum membership required' },
        { status: 403 }
      )
    }

    // If replying to a comment, verify it exists
    if (parentCommentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentCommentId }
      })

      if (!parentComment || parentComment.postId !== postId) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
        parentCommentId,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          }
        },
        _count: {
          select: {
            likes: true,
          }
        }
      }
    })

    // Create notification for post author if not self
    if (post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          title: 'New Comment',
          content: `${session.user.fullName} commented on your post: ${post.title}`,
          type: 'forum',
          referenceId: postId,
        }
      })
    }

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
